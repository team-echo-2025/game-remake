import Rectangle from "./physics/Rectangle";
import RigidBody from "./physics/RigidBody";
import Scene from "./Scene";

export default class Camera {
    x: number = 0;
    y: number = 0;
    scene: Scene;
    private _follow: RigidBody | undefined;
    private _zoom: number = 1;
    private _bounds: Rectangle;

    set zoom(zoom: number) {
        this._zoom = zoom;
    }

    constructor(scene: Scene) {
        this.scene = scene;
        this._bounds = new Rectangle({ x: this.x, y: this.y, w: window.innerWidth, h: window.innerHeight })
    }

    lookAt(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    follow(body: RigidBody) {
        this._follow = body;
    }

    apply_transformation() {
        if (this._follow) {
            this.x = this._follow.x;
            this.y = this._follow.y;
        }
        this._bounds.x = this.x;
        this._bounds.y = this.y;
        const cam_left = this._bounds.x - this._bounds.halfWidth / this._zoom;
        const cam_right = this._bounds.x + this._bounds.halfWidth / this._zoom;
        const cam_top = this._bounds.y - this._bounds.halfHeight / this._zoom;
        const cam_bottom = this._bounds.y + this._bounds.halfHeight / this._zoom;
        const left = this.scene.bounds.x - this.scene.bounds.halfWidth;
        const right = this.scene.bounds.x + this.scene.bounds.halfWidth;
        const top = this.scene.bounds.y - this.scene.bounds.halfHeight;
        const bottom = this.scene.bounds.y + this.scene.bounds.halfHeight;
        if (cam_left < left) {
            this.x = left + this._bounds.halfWidth / this._zoom;
        } else if (cam_right > right) {
            this.x = right - this._bounds.halfWidth / this._zoom;
        }
        if (cam_top < top) {
            this.y = top + this._bounds.halfHeight / this._zoom;
        } else if (cam_bottom > bottom) {
            this.y = bottom - this._bounds.halfHeight / this._zoom;
        }
        this.scene.p5.scale(this._zoom);
        this.scene.p5.translate(-this.x, -this.y);
    }
}
