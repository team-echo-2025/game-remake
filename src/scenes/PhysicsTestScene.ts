import PhysicsObject from "../lib/physics/PhysicsObject";
import Player from "../lib/Player";
import Scene from "../lib/Scene";
class TestObject extends PhysicsObject {
    private scene: Scene;
    constructor(scene: Scene) {
        super({
            width: 64,
            height: 64,
            mass: 0,
        })
        this.scene = scene;
    }
    draw(): void {
        this.scene.p5.fill(0);
        this.scene.p5.rect(0, 0, 64, 64);
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
        this.player.x = -100;
        this.physics.addObject(this.player);
        this.testObj = new TestObject(this);
        this.physics.addObject(this.testObj);
    }

    setup(): void { }

    preload(): any {
        console.log("begin preload of Physics scene");
    }

    keyPressed(e: KeyboardEvent): void {
        if (e.key == "Escape") {
            console.log("leaving physics, going to menu")
            this.start('menu-scene');
        }
    }

    onStop() {
        this.player = undefined;
    }
}
