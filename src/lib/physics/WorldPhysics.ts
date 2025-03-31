import GameObject from "../GameObject";
import Scene from "../Scene";
import { Vector2D } from "../types/Physics";
import BoxCollider from "./BoxCollider";
import { ColliderProps } from "./Collider";
import { CollisionResult } from "./CollisionResult";
import DynamicQuadTree from "./DynamicQuadTree";
import PhysicsObject from "./PhysicsObject";
import RigidBody from "./RigidBody";

export default class WorldPhysics implements GameObject {
    private physic_objects: PhysicsObject[];
    private quad_tree?: DynamicQuadTree;
    private quad_capacity: number = 8;
    private _scene!: Scene;
    private _debug: boolean = false;

    private accumulator: number = 0;
    private fixedTimeStep: number = 1 / 60;
    private _paused: boolean = false;
    private _friction: number = 0.9;
    get friction() {
        return this._friction;
    }

    set friction(num: number) {
        this._friction = num;
    }

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
        const quad_rect: ColliderProps = {
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

    check_collision(a: RigidBody, b: RigidBody): CollisionResult | undefined {
        if (a.overlaps) { a.onOverlap && a.onOverlap(b) }
        if (b.overlaps) { b.onOverlap && b.onOverlap(a) }
        if (a.overlaps || b.overlaps) return undefined;

        const ACollider = a.collider as BoxCollider;
        const BCollider = b.collider as BoxCollider;

        const manifold = ACollider.getManifold(BCollider);
        if (!manifold) {
            return undefined; // No collision
        }

        const { normal, penetration } = manifold;
        const result: CollisionResult = {
            a,
            b,
            normal,
            penetration,
            contactPoints: []
        };
        return result;
    }
    //check_collision(a: RigidBody, b: RigidBody): CollisionResult | undefined {
    //    if (a.overlaps) {
    //        a.onOverlap && a.onOverlap(b);
    //    }
    //    if (b.overlaps) {
    //        b.onOverlap && b.onOverlap(a);
    //    }
    //    if (a.overlaps || b.overlaps) {
    //        return undefined;
    //    };
    //    const distX = b.x - a.x;
    //    const distY = b.y - a.y;

    //    const sumHalfWidth = a.halfWidth + b.halfWidth;
    //    const sumHalfHeight = a.halfHeight + b.halfHeight;

    //    if (Math.abs(distX) > sumHalfWidth) return undefined;
    //    if (Math.abs(distY) > sumHalfHeight) return undefined;

    //    const overlapX = sumHalfWidth - Math.abs(distX);
    //    const overlapY = sumHalfHeight - Math.abs(distY);

    //    let normal: Vector2D = { x: 0, y: 0 };
    //    let penetration = 0;

    //    if (overlapX < overlapY) {
    //        penetration = overlapX;
    //        normal.x = distX > 0 ? 1 : -1;
    //        normal.y = 0;
    //    } else {
    //        penetration = overlapY;
    //        normal.x = 0;
    //        normal.y = distY > 0 ? 1 : -1;
    //    }

    //    const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
    //    normal.x /= length;
    //    normal.y /= length;
    //    const result: CollisionResult = {
    //        a,
    //        b,
    //        normal,
    //        penetration,
    //        contactPoints: []
    //    };
    //    return result;
    //}

    resolve_collision(collision: CollisionResult) {
        const { a, b, normal, penetration } = collision;
        const invMassA = (a.mass === Infinity) ? 0 : (1 / a.mass);
        const invMassB = (b.mass === Infinity) ? 0 : (1 / b.mass);
        const invMassSum = invMassA + invMassB;

        if (invMassSum > 0) {
            const movePerInvMass = penetration / invMassSum;
            if (invMassA > 0) {
                a.x -= normal.x * movePerInvMass * invMassA;
                a.y -= normal.y * movePerInvMass * invMassA;
            }
            if (invMassB > 0) {
                b.x += normal.x * movePerInvMass * invMassB;
                b.y += normal.y * movePerInvMass * invMassB;
            }
        }

        let rvx = b.velocity.x - a.velocity.x;
        let rvy = b.velocity.y - a.velocity.y;

        let velAlongNormal = rvx * normal.x + rvy * normal.y;
        if (velAlongNormal > 0) {
            return;
        }

        const e = Math.min(a.restitution, b.restitution);
        const jn = -(1 + e) * velAlongNormal / invMassSum;
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

        const normalImpulseMag = Math.abs(jn);

        rvx = b.velocity.x - a.velocity.x;
        rvy = b.velocity.y - a.velocity.y;

        let tx = normal.y;
        let ty = -normal.x;

        const relVelTangent = rvx * tx + rvy * ty;

        if (Math.abs(relVelTangent) < 1e-6) {
            return;
        }

        const tLen = Math.sqrt(tx * tx + ty * ty);
        tx /= tLen;
        ty /= tLen;

        const combinedFriction = Math.sqrt(a.friction * b.friction);
        let jt = -relVelTangent / invMassSum;

        const maxFriction = normalImpulseMag * combinedFriction;
        if (jt > maxFriction) jt = maxFriction;
        else if (jt < -maxFriction) jt = -maxFriction;

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
        const speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
        if (speed > 0) {
            let newSpeed = speed - frictionVal * dt;
            if (newSpeed < 0) newSpeed = 0;

            const scale = newSpeed / speed;
            body.velocity.x *= scale;
            body.velocity.y *= scale;
        }
    }

    update() {
        if (this._paused) return;
        if (!this.quad_tree) return;
        const dtSec = this._scene.p5.deltaTime / 1000;
        this.accumulator += this.accumulator >= 1 ? 0 : dtSec; 
        while (this.accumulator >= this.fixedTimeStep) {
            this.quad_tree.clear();
            for (const obj of this.physic_objects) {
                obj.update(this.fixedTimeStep * 1000, this._scene);
                this.apply_ground_friction(obj.body, this._friction, this.fixedTimeStep * 1000);
                this.quad_tree.insert({ rect: obj.body.collider, data: obj });
            }
            for (const obj of this.physic_objects) {
                const candidates = this.quad_tree.query(obj.body.collider);
                for (const candidate of candidates) {
                    if (candidate.data.body == obj.body) continue;
                    const collision_data = this.check_collision(obj.body, candidate.data.body);
                    if (!this.quad_tree) { return };
                    if (collision_data) {
                        this.resolve_collision(collision_data);
                    } 
                }
            }
        }
        this.accumulator -= this.fixedTimeStep;
        //}
        if (this._debug) {
            for (const obj of this.physic_objects) {
                this._scene.p5.push();
                this._scene.p5.rectMode("center");
                this._scene.p5.stroke(255, 0, 0);
                this._scene.p5.noFill();
                this._scene.p5.translate(obj.body.x, obj.body.y);
                this._scene.p5.rotate(-obj.body.collider.rotation);
                this._scene.p5.rect(0, 0, obj.body.w, obj.body.h);
                const speed = Math.sqrt(obj.body.velocity.x ** 2 + obj.body.velocity.y ** 2);
                const normX = speed === 0 ? 0 : obj.body.velocity.x / speed;
                const normY = speed === 0 ? 0 : obj.body.velocity.y / speed;
                const magnitude = 50;
                this._scene.p5.pop();
                this._scene.p5.push();
                this._scene.p5.translate(obj.body.x, obj.body.y);
                this._scene.p5.line(
                    0,
                    0,
                    normX * magnitude,
                    normY * magnitude
                );

                this._scene.p5.pop();
            }
            this._scene.p5.push();
            this._scene.p5.stroke(0);
            this.quad_tree.debug_draw(this._scene);
            this._scene.p5.pop();
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
        const rect = new BoxCollider({ h: 1, w: 1, x: this._scene.p5.mouseX + this._scene.camera.x - this._scene.p5.width / 2, y: this._scene.p5.mouseY + this._scene.camera.y - this._scene.p5.height / 2 });
        const found = this.quad_tree.query(rect)
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

    postDraw(): void {
        if (this._debug) {
            this._scene.p5.push();
            this._scene.p5.fill(0)
            this._scene.p5.text("Loaded Bodies: " + this.physic_objects.length, 20 - this._scene.p5.width / 2, 80 - this._scene.p5.height / 2);
            this._scene.p5.pop();
        }
    }
}
