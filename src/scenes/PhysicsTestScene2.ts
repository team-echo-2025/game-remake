import PhysicsObject from "../lib/physics/PhysicsObject";
import Player from "../lib/Player";
import Scene from "../lib/Scene";

export class TestObject extends PhysicsObject {
    private scene: Scene;
    private color: { r: number, b: number, g: number };
    constructor(scene: Scene, width?: number, height?: number) {
        super({
            width: width ?? 50,
            height: height ?? 50,
            mass: (width ?? 50) * (height ?? 50),
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
export default class PhysicsTestScene2 extends Scene {
    player?: Player;
    testObj?: TestObject;

    constructor() {
        super("physics-scene2");
    }

    onStart(): void {
        this.player = new Player(this);
        this.physics.addObject(this.player);
        this.testObj = new TestObject(this);
        this.physics.addObject(this.testObj);
        this.physics.debug = true;
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
