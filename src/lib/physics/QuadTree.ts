import Scene from "../Scene";
import { Point } from "../types/Physics";
import Rectangle, { RectangleProps } from "./Rectangle";

export default class QuadTree extends Rectangle {
    capacity: number;
    subdivided: boolean = false;
    northeast?: QuadTree;
    northwest?: QuadTree;
    southeast?: QuadTree;
    southwest?: QuadTree;
    points: Point[] = [];
    minx: number = 0;
    maxx: number = 0;
    miny: number = 0;
    maxy: number = 0;

    constructor(rect: RectangleProps, capacity: number) {
        super(rect);
        this.capacity = capacity;
    }

    update_root_bounds() {
        this.minx = this.x - this.box.halfw;
        this.maxx = this.x + this.box.halfw;
        this.miny = this.y - this.box.halfh;
        this.maxy = this.y + this.box.halfh;
    }


    expand_to_fit(point: Point): void {
        // Keep doubling until the point is in bounds
        while (point.x < this.x - this.box.halfw) {
            this.w *= 2;
            this.update_bounds();
        }
        while (point.x > this.x + this.box.halfw) {
            this.w *= 2;
            this.update_bounds();
        }
        while (point.y < this.y - this.box.halfh) {
            this.h *= 2;
            this.update_bounds();
        }
        while (point.y > this.y + this.box.halfh) {
            this.h *= 2;
            this.update_bounds();
        }
    }

    insert(point: Point): boolean {
        if (!this.containsPoint(point)) {
            this.expand_to_fit(point);
        }

        if (this.points.length < this.capacity && !this.subdivided) {
            if (point.x < this.x - this.box.halfw || point.x > this.x + this.box.halfw) {
                this.w *= 2;
                this.update_root_bounds();
            }
            if (point.y < this.y - this.box.halfh || point.y > this.y + this.box.halfh) {
                this.h *= 2;
                this.update_root_bounds();
            }
            this.points.push(point);
            return true;
        }

        if (!this.subdivided) {
            this.subdivide();
        }

        if (this.northeast?.insert(point)) return true
        if (this.northwest?.insert(point)) return true
        if (this.southeast?.insert(point)) return true
        if (this.southwest?.insert(point)) return true

        return false;
    }

    subdivide() {
        const section_width = this.w / 2;
        const section_height = this.h / 2;
        this.subdivided = true;
        this.northwest = new QuadTree({ x: this.x - section_width / 2, y: this.y - section_height / 2, w: section_width, h: section_height }, this.capacity);
        this.northeast = new QuadTree({ x: this.x + section_width / 2, y: this.y - section_height / 2, w: section_width, h: section_height }, this.capacity);
        this.southwest = new QuadTree({ x: this.x - section_width / 2, y: this.y + section_height / 2, w: section_width, h: section_height }, this.capacity);
        this.southeast = new QuadTree({ x: this.x + section_width / 2, y: this.y + section_height / 2, w: section_width, h: section_height }, this.capacity);
        const oldPoints = this.points;
        this.points = [];  // clear parent
        for (const p of oldPoints) {
            // Try each child once:
            if (!this.northwest.insert(p) &&
                !this.northeast.insert(p) &&
                !this.southwest.insert(p) &&
                !this.southeast.insert(p)) {
                // If somehow it doesn’t fit in children, keep in parent
                this.points.push(p);
            }
        }
    }

    query(range: Rectangle, intersecting_points: Point[] = []) {
        if (!this.intersects(range)) {
            return intersecting_points;
        }

        for (const point of this.points) {
            if (range.containsPoint(point)) {
                intersecting_points.push(point);
            }
        }

        if (this.subdivided) {
            this.northeast?.query(range, intersecting_points);
            this.northwest?.query(range, intersecting_points);
            this.southeast?.query(range, intersecting_points);
            this.southwest?.query(range, intersecting_points);
        }

        return intersecting_points;
    }

    debug_draw(scene: Scene) {
        scene.p5.noFill();
        scene.p5.rectMode("center")
        scene.p5.rect(this.x, this.y, this.w, this.h);
        if (this.subdivided) {
            this.northeast?.debug_draw(scene);
            this.northwest?.debug_draw(scene);
            this.southeast?.debug_draw(scene);
            this.southwest?.debug_draw(scene);
        }
    }
    clear(): void {
        this.points = [];
        if (this.subdivided) {
            this.northwest?.clear();
            this.northeast?.clear();
            this.southwest?.clear();
            this.southeast?.clear();
            this.northwest = undefined;
            this.northeast = undefined;
            this.southwest = undefined;
            this.southeast = undefined;
            this.subdivided = false;
        }
    }
}
