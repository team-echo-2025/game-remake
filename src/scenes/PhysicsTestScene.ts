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
    testObj2?: TestObject;

    constructor() {
        super("physics-scene");
    }

    onStart(): void {
        this.player = new Player(this);
        this.player.body.x = 1;
        this.physics.addObject(this.player);
        this.testObj = new TestObject(this);
        this.physics.addObject(this.testObj);
        return
        for (let i = 0; i < 1000; i++) {
            const obj = new TestObject(this);
            obj.body.w = Math.random() * (100 - 50) + 50;
            obj.body.h = Math.random() * (100 - 50) + 50;
            obj.body.x = Math.random() * 200;
            obj.body.y = Math.random() * 200;
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

    onStop() {
        this.player = undefined;
        this.testObj = undefined;
    }
}
