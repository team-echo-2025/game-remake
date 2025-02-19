import Scene from "../Scene";
import { Point } from "../types/Physics";
import QuadTree from "./QuadTree";
import Rectangle, { RectangleProps } from "./Rectangle";

// A wrapper class that always ensures the root contains new points.
export default class DynamicQuadTree {
    root: QuadTree;
    capacity: number;

    constructor(initialRect: RectangleProps, capacity: number) {
        this.root = new QuadTree({ ...initialRect, x: initialRect.x - initialRect.w / 2, y: initialRect.y - initialRect.h / 2 }, capacity);
        this.capacity = capacity;
    }

    ensureRootContains(point: Point) {
        // If the point is already inside, nothing to do.
        if (this.root.containsPointTL(point)) return;
        console.error("FIXING")

        // Compute the boundaries of the current root.
        const oldLeft = this.root.x;
        const oldTop = this.root.y;
        const oldRight = this.root.x + this.root.w;
        const oldBottom = this.root.y + this.root.h;

        // Determine the new left and top (the minimum of the old values and the point's coordinates).
        const newLeft = Math.min(oldLeft, point.x);
        const newTop = Math.min(oldTop, point.y);

        // Determine the new right and bottom (the maximum of the old boundaries and the point).
        const newRight = Math.max(oldRight, point.x);
        const newBottom = Math.max(oldBottom, point.y);

        // To keep things simple, we can choose to double the dimensions
        // or you can compute exactly what size is needed.
        // Here we ensure the new width/height are at least double the old ones:
        let newW = this.root.w * 2;
        let newH = this.root.h * 2;

        // Alternatively, if you want the new tree to exactly cover the union:
        // newW = newRight - newLeft;
        // newH = newBottom - newTop;

        // Create the new root with these bounds.
        const newRoot = new QuadTree({ x: this.root.x - newW / 2, y: this.root.y - newH / 2, w: newW, h: newH }, this.capacity);
        newRoot.subdivide(); // subdivide so points can go into children

        // Reinsert all points from the old tree.
        const allPoints = this.collectAllPoints(this.root);
        for (const p of allPoints) {
            newRoot.insert(p);
        }

        // Replace the old root.
        this.root = newRoot;

        // If the point is still not contained (very unlikely if our math is right),
        // we can call ensureRootContains again.
        if (!this.root.containsPoint(point)) {
            this.ensureRootContains(point);
        }
    }

    // Recursively collect all points from the tree.
    collectAllPoints(node: QuadTree): Point[] {
        let points = [...node.points];
        if (node.subdivided) {
            if (node.northwest) points = points.concat(this.collectAllPoints(node.northwest));
            if (node.northeast) points = points.concat(this.collectAllPoints(node.northeast));
            if (node.southwest) points = points.concat(this.collectAllPoints(node.southwest));
            if (node.southeast) points = points.concat(this.collectAllPoints(node.southeast));
        }
        return points;
    }

    // When inserting a point, first ensure the root is big enough.
    insert(point: Point): boolean {
        this.ensureRootContains(point);
        return this.root.insert(point);
    }

    clear() {
        this.root.clear();
    }

    query(range: Rectangle) {
        return this.root.query(range);
    }

    debug_draw(scene: Scene) {
        this.root.debug_draw(scene);
    }
}
