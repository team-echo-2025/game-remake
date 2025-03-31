import Scene from "../Scene";
import { Point } from "../types/Physics";
import Collider, { ColliderProps } from "./Collider";
import QuadTree from "./QuadTree";

export default class DynamicQuadTree {
    root: QuadTree;
    capacity: number;

    constructor(initialRect: ColliderProps, capacity: number) {
        this.root = new QuadTree(initialRect, capacity);
        this.capacity = capacity;
    }

    ensure_root_contains(point: Point) {
        if (this.root.containsPoint(point)) return;

        let newW = this.root.w * 2;
        let newH = this.root.h * 2;
        const newRoot = new QuadTree({ x: this.root.x, y: this.root.y, w: newW, h: newH }, this.capacity);
        newRoot.subdivide();
        const allPoints = this.collect_all_points(this.root);
        for (const p of allPoints) {
            newRoot.insert(p);
        }

        this.root = newRoot;
        if (!this.root.containsPoint(point)) {
            this.ensure_root_contains(point);
        }
    }

    // Recursively collect all points from the tree.
    collect_all_points(node: QuadTree): Point[] {
        let points = [...node.points];
        if (node.subdivided) {
            if (node.northwest) points = points.concat(this.collect_all_points(node.northwest));
            if (node.northeast) points = points.concat(this.collect_all_points(node.northeast));
            if (node.southwest) points = points.concat(this.collect_all_points(node.southwest));
            if (node.southeast) points = points.concat(this.collect_all_points(node.southeast));
        }
        return points;
    }

    // When inserting a point, first ensure the root is big enough.
    insert(point: Point): boolean {
        this.ensure_root_contains(point);
        return this.root.insert(point);
    }

    clear() {
        this.root.clear();
    }

    query(range: Collider) {
        return this.root.query(range);
    }

    debug_draw(scene: Scene) {
        this.root.debug_draw(scene);
    }
}
