import Collider, { ColliderProps } from "./Collider";
import { Vector2D } from "../types/Physics"; // Or define your own {x:number;y:number;} type.


type Point2D = { x: number; y: number };

export default class BoxCollider extends Collider {
    constructor(props: ColliderProps) {
        super(props);
    }

    intersects(other: Collider): boolean {
        if (!(other instanceof BoxCollider)) {
            console.error("Collider Type Error: only BoxCollider vs. BoxCollider is implemented.");
            throw new Error("Not implemented.");
        }
        if (this.rotation == 0 && other.rotation == 0) {
            return !(other.left > this.right ||
                other.right < this.left ||
                other.top > this.bottom ||
                other.bottom < this.top);
        }

        const cornersA = this.getCorners();
        const cornersB = other.getCorners();
        const axes = [
            ...this.getAxes(cornersA),
            ...this.getAxes(cornersB)
        ];

        for (const axis of axes) {
            if (!this.isOverlapOnAxis(axis, cornersA, cornersB)) {
                // If there's a gap on any axis, there's no collision.
                return false;
            }
        }
        return true;
    }

    private getCorners(): Point2D[] {
        const hw = this.halfWidth;
        const hh = this.halfHeight;
        const localCorners: Point2D[] = [
            { x: -hw, y: -hh },
            { x: hw, y: -hh },
            { x: hw, y: hh },
            { x: -hw, y: hh },
        ];

        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);

        return localCorners.map(({ x, y }) => {
            const rx = x * cos - y * sin;  // rotated x
            const ry = x * sin + y * cos;  // rotated y
            return {
                x: this.x + rx,
                y: this.y + ry
            };
        });
    }

    private getAxes(corners: Point2D[]): Point2D[] {
        const axes: Point2D[] = [];

        for (let i = 0; i < corners.length; i++) {
            const nextIndex = (i + 1) % corners.length;
            const edge = {
                x: corners[nextIndex].x - corners[i].x,
                y: corners[nextIndex].y - corners[i].y
            };

            const normal = { x: -edge.y, y: edge.x };
            const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
            if (length > 0) {
                normal.x /= length;
                normal.y /= length;
            }

            if (i < 2) {
                axes.push(normal);
            }
        }

        return axes;
    }

    private isOverlapOnAxis(axis: Point2D, cornersA: Point2D[], cornersB: Point2D[]): boolean {
        const [minA, maxA] = this.projectCorners(cornersA, axis);
        const [minB, maxB] = this.projectCorners(cornersB, axis);

        if (maxA < minB || maxB < minA) {
            return false;
        }
        return true;
    }

    private projectCorners(corners: Point2D[], axis: Point2D): [number, number] {
        let min = Infinity;
        let max = -Infinity;

        for (const c of corners) {
            const projection = c.x * axis.x + c.y * axis.y;
            if (projection < min) min = projection;
            if (projection > max) max = projection;
        }

        return [min, max];
    }


    getManifold(other: BoxCollider): { normal: Vector2D; penetration: number } | null {
        // 1) Gather both sets of corners
        const cornersA = this.getCorners();
        const cornersB = other.getCorners();

        // 2) Gather the 4 axes (2 from 'this', 2 from 'other')
        const axes = [
            ...this.getAxes(cornersA),
            ...other.getAxes(cornersB)
        ];

        // We'll track the axis with the smallest overlap
        // (that's the "deepest" point of contact).
        let minOverlap = Infinity;
        let collisionNormal: Vector2D | null = null;

        // 3) For each axis, check overlap
        for (const axis of axes) {
            // Project corners on this axis
            const [minA, maxA] = this.projectCorners(cornersA, axis);
            const [minB, maxB] = this.projectCorners(cornersB, axis);

            // Check for a gap
            if (maxA < minB || maxB < minA) {
                // No overlap on this axis => no collision
                return null;
            }

            // Otherwise, find the overlap distance along this axis
            const overlap = Math.min(maxA, maxB) - Math.max(minA, minB);
            if (overlap < minOverlap) {
                minOverlap = overlap;
                collisionNormal = axis;
            }
        }

        // If we get here, there's overlap on all axes. 
        // 'collisionNormal' holds the axis with the smallest overlap.

        // 4) Ensure the normal points from 'this' toward 'other'
        // We can do that by comparing the centers of each box.
        const centerA = { x: this.x, y: this.y };
        const centerB = { x: other.x, y: other.y };
        const centerDelta = {
            x: centerB.x - centerA.x,
            y: centerB.y - centerA.y
        };
        // Dot to see if they're pointing roughly in the same direction
        const dot = centerDelta.x * collisionNormal!.x + centerDelta.y * collisionNormal!.y;
        if (dot < 0) {
            // Flip the normal
            collisionNormal!.x = -collisionNormal!.x;
            collisionNormal!.y = -collisionNormal!.y;
        }

        // 5) Return the manifold
        return {
            normal: collisionNormal!,
            penetration: minOverlap
        };
    }
}
