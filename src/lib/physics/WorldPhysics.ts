import Scene from "../Scene";
import PhysicsObject from "./PhysicsObject";

export default class WorldPhysics {
    private physic_objects: PhysicsObject[];
    private _scene!: Scene;
    private _debug: boolean = true;
    set scene(scene: Scene) {
        this._scene = scene;
    }
    set debug(debug: boolean) {
        this._debug = debug;
    }
    constructor() {
        this.physic_objects = [];
    }
    addObject(object: PhysicsObject) {
        this.physic_objects.push(object);
        this._scene.add(object);
    }

    resolveAABBOverlap(a: PhysicsObject, b: PhysicsObject) {
        // Amount that a intrudes into b on each axis:
        const overlapX1 = (a.x + a.width) - b.x;            // if a is left, this is how far right edge extends into b
        const overlapX2 = (b.x + b.width) - a.x;            // if b is left, how far b’s right edge extends into a
        // We'll pick a negative or positive value for X so we know which side to push
        let pushX;
        if (overlapX1 < overlapX2) {
            // a is to the left of b, so we push a left
            pushX = -overlapX1;
        } else {
            // b is to the left of a, so we push a right
            pushX = overlapX2;
        }

        // Same logic for Y:
        const overlapY1 = (a.y + a.height) - b.y;
        const overlapY2 = (b.y + b.height) - a.y;
        let pushY;
        if (overlapY1 < overlapY2) {
            pushY = -overlapY1;
        } else {
            pushY = overlapY2;
        }

        if (Math.abs(pushX) < Math.abs(pushY)) {
            // Overlap is smaller along X axis
            a.x += pushX / 2;
            b.x -= pushX / 2;

            // Zero out or reverse velocities along X
            a.velocity.x = 0;
            b.velocity.x = 0;
        } else {
            // Overlap is smaller along Y axis
            a.y += pushY / 2;
            b.y -= pushY / 2;

            a.velocity.y = 0;
            b.velocity.y = 0;
        }
    }


    checkCollision(a: PhysicsObject, b: PhysicsObject): boolean {
        return (
            a.x < b.x + a.width &&
            a.x + a.width > b.x &&
            a.y < b.y + a.height &&
            a.y + a.height > b.y
        );
    }
    update() {
        // Move each object by velocity (even if velocity=0, they'll just stay put)
        for (let i = 0; i < this.physic_objects.length; i++) {
            const a = this.physic_objects[i];
            a.x += a.velocity.x;
            a.y += a.velocity.y;
        }

        // Now do collisions for all pairs
        for (let i = 0; i < this.physic_objects.length; i++) {
            const a = this.physic_objects[i];
            if (this._debug) {
                this._scene.p5.stroke(255, 0, 0);
                this._scene.p5.noFill();
                this._scene.p5.rect(a.x, a.y, a.width, a.height);
            }
            for (let j = i + 1; j < this.physic_objects.length; j++) {
                const b = this.physic_objects[j];
                if (!this.checkCollision(a, b)) return;

                const nextX = a.x + a.velocity.x;
                const nextY = a.y + a.velocity.y;

                const aRight = nextX + a.width;
                const aLeft = nextX;
                const aTop = nextY;
                const aBottom = nextY + a.height;

                const objRight = b.x + b.width;
                const objLeft = b.x;
                const objTop = b.y;
                const objBottom = b.y + b.height;

                if (aRight > objLeft && aLeft < objRight) {
                    if (aBottom > objTop && aTop < objBottom) {
                        // Determine which side is being collided with
                        const overlapX = Math.min(aRight - objLeft, objRight - aLeft);
                        const overlapY = Math.min(aBottom - objTop, objBottom - aTop);

                        if (overlapX < overlapY) {
                            // Horizontal collision
                            if (a.velocity.x > 0) a.x = objLeft - a.width;
                            if (a.velocity.x < 0) a.x = objRight;
                            a.velocity.x = 0; // Stop movement in X
                        } else {
                            // Vertical collision
                            if (a.velocity.y > 0) a.y = objTop - a.height;
                            if (a.velocity.y < 0) a.y = objBottom;
                            a.velocity.y = 0; // Stop movement in Y
                        }
                        //a.moving = false;
                    }
                }
            }
        }
    }
    onDestroy() {
        for (const obj of this.physic_objects) {
            obj.onDestroy();
        }
        this.physic_objects = [];
    }
}
