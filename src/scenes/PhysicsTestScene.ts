import PhysicsObject from "../lib/physics/PhysicsObject";
import Player from "../lib/Player";
import Scene from "../lib/Scene";
export class TestObject extends PhysicsObject {
    private scene: Scene;
    private color: { r: number, b: number, g: number };
    constructor(scene: Scene, width?: number, height?: number) {
        super({
            width: width ?? 100,
            height: height ?? 100,
            mass: (width ?? 100) * (height ?? 100),
            friction: 0.5
        })
        this.scene = scene;
        this.color = {
            r: Math.random() * 255,
            g: Math.random() * 255,
            b: Math.random() * 255,
        }
    }
    draw(): void {
        this.scene.p5.rectMode('center')
        this.scene.p5.fill(this.color.r, this.color.b, this.color.g);
        this.scene.p5.rect(this.body.x, this.body.y, this.body.w, this.body.h);
    }

}
export default class PhysicsTestScene extends Scene {
    player?: Player;
    testObj?: TestObject;

    constructor() {
        super("physics-scene");
    }

    onStart(): void {
        this.player = new Player(this);
        this.player.body.x = 1;
        this.physics.addObject(this.player);
        this.testObj = new TestObject(this);
        this.physics.addObject(this.testObj);
        const obj_count = 1000;
        for (let i = 0; i < obj_count; i++) {
            const obj = new TestObject(this);
            obj.body.w = Math.random() * (200 - 100) + 50;
            obj.body.h = Math.random() * (200 - 100) + 50;
            obj.body.x = Math.random() * obj_count - Math.random() * obj_count;
            obj.body.y = Math.random() * obj_count - Math.random() * obj_count;
            this.physics.addObject(obj);
        }
    }

    setup(): void { }

    preload(): any {
        console.log("begin preload of Physics scene");
    }

    keyPressed(e: KeyboardEvent): void {
        if (e.key == "Escape") {
            this.start('menu-scene');
        }
    }

    mouseClicked(_: MouseEvent): void {
        if (!this.player?.shooting) {
            const obj = this.physics.raycast();
            if (obj) {
                this.physics.remove(obj);
            }
        }
    }

    onStop() {
        this.player = undefined;
        this.testObj = undefined;
    }
}
