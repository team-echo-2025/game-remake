import GameObject from "../GameObject";
import Scene from "../Scene";
import { Vector2D } from "../types/Physics";
import { CollisionResult } from "./CollisionResult";
import DynamicQuadTree from "./DynamicQuadTree";
import PhysicsObject from "./PhysicsObject";
import Rectangle, { RectangleProps } from "./Rectangle";
import RigidBody from "./RigidBody";

export default class WorldPhysics implements GameObject {
    private physic_objects: PhysicsObject[];
    private quad_tree?: DynamicQuadTree;
    private quad_capacity: number = 8;
    private _scene!: Scene;
    private _debug: boolean = false;

    private accumulator: number = 0;
    private fixedTimeStep: number = 1 / 60; // seconds
    private _paused: boolean = false;

    set scene(scene: Scene) {
        this._scene = scene;
    }

    set debug(debug: boolean) {
        this._debug = debug;
    }
    get debug(): boolean {
        return this._debug;
    }

    constructor() {
        this.physic_objects = [];
    }

    private handle_visibility_change = () => {
        if (document.hidden) {
            this._paused = true;
        } else {
            this._paused = false;
        }
    }

    setup() {
        const quad_rect: RectangleProps = {
            x: 0,
            y: 0,
            w: window.innerWidth,
            h: window.innerHeight,
        }
        this.quad_tree = new DynamicQuadTree(quad_rect, this.quad_capacity);
        document.addEventListener('visibilitychange', this.handle_visibility_change);
    }

    addObject(object: PhysicsObject) {
        this._scene.add(object);
        this.physic_objects.push(object);
    }

    /**
     * Check collision between two AABB bodies.
     * Returns a CollisionResult if overlapping, otherwise undefined.
     */
    check_collision(a: RigidBody, b: RigidBody): CollisionResult | undefined {
        // Calculate distance between centers
        const distX = b.x - a.x;
        const distY = b.y - a.y;

        // Calculate the combined half-widths and half-heights
        const sumHalfWidth = a.halfWidth + b.halfWidth;
        const sumHalfHeight = a.halfHeight + b.halfHeight;

        // Check for no overlap on X or Y
        if (Math.abs(distX) > sumHalfWidth) return undefined;  // no collision on X
        if (Math.abs(distY) > sumHalfHeight) return undefined; // no collision on Y

        // There is overlap. Now compute penetration depths along each axis
        const overlapX = sumHalfWidth - Math.abs(distX);
        const overlapY = sumHalfHeight - Math.abs(distY);

        // We want to push the objects out along the axis of *least* penetration
        let normal: Vector2D = { x: 0, y: 0 };
        let penetration = 0;

        if (overlapX < overlapY) {
            // Collide along X axis
            penetration = overlapX;
            // Normal direction depends on the sign of distX
            normal.x = distX > 0 ? 1 : -1;
            normal.y = 0;
        } else {
            // Collide along Y axis
            penetration = overlapY;
            normal.x = 0;
            normal.y = distY > 0 ? 1 : -1;
        }

        // Convert normal to a unit vector
        const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
        normal.x /= length;
        normal.y /= length;

        const result: CollisionResult = {
            a,
            b,
            normal,
            penetration,
            contactPoints: []
        };

        return result;
    }

    /**
     * Resolves collision by adjusting positions and velocities.
     */
    resolve_collision(collision: CollisionResult) {
        const { a, b, normal, penetration } = collision;

        // ------------------------------------
        // 1) Positional Correction
        // ------------------------------------
        const invMassA = (a.mass === Infinity) ? 0 : (1 / a.mass);
        const invMassB = (b.mass === Infinity) ? 0 : (1 / b.mass);
        const invMassSum = invMassA + invMassB;

        if (invMassSum > 0) {
            // Distribute the correction based on inverse mass
            const movePerInvMass = penetration / invMassSum;

            // Move 'a' opposite the normal
            if (invMassA > 0) {
                a.x -= normal.x * movePerInvMass * invMassA;
                a.y -= normal.y * movePerInvMass * invMassA;
            }
            // Move 'b' along the normal
            if (invMassB > 0) {
                b.x += normal.x * movePerInvMass * invMassB;
                b.y += normal.y * movePerInvMass * invMassB;
            }
        }

        // ------------------------------------
        // 2) Normal (Bounce) Impulse
        // ------------------------------------
        // Compute relative velocity
        let rvx = b.velocity.x - a.velocity.x;
        let rvy = b.velocity.y - a.velocity.y;

        // Relative speed along the collision normal
        let velAlongNormal = rvx * normal.x + rvy * normal.y;

        // If they're separating, no normal impulse needed
        if (velAlongNormal > 0) {
            return;
        }

        // Combine restitution
        const e = Math.min(a.restitution, b.restitution);

        // Normal impulse scalar
        //   jn = -(1 + e) * v_rel_dot_normal / (invMassSum)
        const jn = -(1 + e) * velAlongNormal / invMassSum;

        // Apply impulse along normal
        const impulseX = jn * normal.x;
        const impulseY = jn * normal.y;

        if (invMassA > 0) {
            a.velocity.x -= impulseX * invMassA;
            a.velocity.y -= impulseY * invMassA;
        }
        if (invMassB > 0) {
            b.velocity.x += impulseX * invMassB;
            b.velocity.y += impulseY * invMassB;
        }

        // We'll need this normal impulse magnitude to clamp friction
        const normalImpulseMag = Math.abs(jn);

        // ------------------------------------
        // 3) Friction Impulse
        // ------------------------------------
        // Recompute relative velocity after normal impulse
        rvx = b.velocity.x - a.velocity.x;
        rvy = b.velocity.y - a.velocity.y;

        // Build a 'tangent' vector
        // A quick perpendicular to (nx, ny) in 2D is (ny, -nx)
        let tx = normal.y;
        let ty = -normal.x;

        // Project relative velocity onto tangent
        const relVelTangent = rvx * tx + rvy * ty;

        if (Math.abs(relVelTangent) < 1e-6) {
            // No tangential motion => no friction impulse needed
            return;
        }

        // Now we want a unit tangent
        const tLen = Math.sqrt(tx * tx + ty * ty);
        tx /= tLen;
        ty /= tLen;

        // Combined friction factor (e.g. min or average)
        const combinedFriction = Math.sqrt(a.friction * b.friction);
        // Alternatively: 
        //   const combinedFriction = 0.5 * (a.friction + b.friction);
        //   const combinedFriction = Math.sqrt(a.friction * b.friction);

        // Tangential impulse magnitude
        //   jt = - (v_rel_dot_tangent) / (invMassSum)
        let jt = -relVelTangent / invMassSum;

        // Coulomb's law: friction <= mu * normalImpulse
        // so we clamp jt
        const maxFriction = normalImpulseMag * combinedFriction;
        if (jt > maxFriction) jt = maxFriction;
        else if (jt < -maxFriction) jt = -maxFriction;

        // Apply friction impulse
        const fx = jt * tx;
        const fy = jt * ty;

        if (invMassA > 0) {
            a.velocity.x -= fx * invMassA;
            a.velocity.y -= fy * invMassA;
        }
        if (invMassB > 0) {
            b.velocity.x += fx * invMassB;
            b.velocity.y += fy * invMassB;
        }
    }

    apply_ground_friction(body: RigidBody, frictionVal: number, dt: number) {
        // frictionVal is something like "1.0" which means we remove 1 unit of speed per second
        const speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
        if (speed > 0) {
            // We'll reduce speed by frictionVal * dt, but not below 0
            let newSpeed = speed - frictionVal * dt;
            if (newSpeed < 0) newSpeed = 0;

            // Keep direction, scale magnitude
            const scale = newSpeed / speed;
            body.velocity.x *= scale;
            body.velocity.y *= scale;
        }
    }

    update() {
        if (this._paused) return;
        if (!this.quad_tree) return;
        const dtSec = this._scene.p5.deltaTime / 1000;
        this.accumulator += dtSec;
        while (this.accumulator >= this.fixedTimeStep) {
            this.quad_tree.clear();
            for (const obj of this.physic_objects) {
                obj.update(this.fixedTimeStep * 1000)
                this.apply_ground_friction(obj.body, 0.2, this.fixedTimeStep * 1000);
                this.quad_tree.insert({ rect: obj.body, data: obj });
            }
            for (const obj of this.physic_objects) {
                const candidates = this.quad_tree.query(obj.body);
                for (const candidate of candidates) {
                    if (candidate.data.body == obj.body) continue;
                    // acurate detection
                    const collision_data = this.check_collision(obj.body, candidate.data.body);
                    if (collision_data) {
                        this.resolve_collision(collision_data);
                    }

                }
            }
            this.accumulator -= this.fixedTimeStep;
        }
        if (this._debug) {
            for (const obj of this.physic_objects) {
                this._scene.p5.rectMode("center");
                this._scene.p5.stroke(255, 0, 0);
                this._scene.p5.noFill();
                this._scene.p5.rect(obj.body.x, obj.body.y, obj.body.w, obj.body.h);
                const speed = Math.sqrt(obj.body.velocity.x ** 2 + obj.body.velocity.y ** 2);
                const normX = speed === 0 ? 0 : obj.body.velocity.x / speed;
                const normY = speed === 0 ? 0 : obj.body.velocity.y / speed;
                const magnitude = 50;
                this._scene.p5.line(
                    obj.body.x,
                    obj.body.y,
                    obj.body.x + normX * magnitude,
                    obj.body.y + normY * magnitude
                );

            }
            this._scene.p5.stroke(0);
            this.quad_tree.debug_draw(this._scene);
        }
    }

    remove(object: PhysicsObject) {
        this._scene.remove(object);
        this.physic_objects = this.physic_objects.filter(obj => {
            if (obj === object) {
                obj.onDestroy?.();
                return false;
            }
            return true;
        });
    }

    raycast(): PhysicsObject | null {
        if (!this.quad_tree) return null;
        const rect = new Rectangle({ h: 1, w: 1, x: this._scene.p5.mouseX + this._scene.camera.x - this._scene.p5.width / 2, y: this._scene.p5.mouseY + this._scene.camera.y - this._scene.p5.height / 2 });
        const found = this.quad_tree.query(rect)
        console.log(found)
        if (found.length <= 0) return null;
        return found[0].data;
    }

    onDestroy() {
        for (const obj of this.physic_objects) {
            obj.onDestroy();
        }
        this.physic_objects = [];
        this.quad_tree = undefined;
        document.removeEventListener('visibilitychange', this.handle_visibility_change);
    }
}
