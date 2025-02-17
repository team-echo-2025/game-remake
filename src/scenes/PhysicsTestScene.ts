import Player from "../lib/Player";
import Scene from "../lib/Scene";
import PhysicsObject from "../lib/PhysicsObject";

export default class PhysicsTestScene extends Scene {
    player?: Player;
    physicalObject?: PhysicsObject;

    constructor() {
        super("physics-scene");
    }

    onStart(): void {
        this.player = new Player(this);
        this.add(this.player);
    }

    setup() : void
    {
        this.physicalObject = this.add_new.physics_object
        ({
            x: 200,
            y: 0,
            width: 100,
            height: 100,
            mass: 1,
            isMoveable: false,
            scene: this
        })
    }

    preload(): any {
        console.log("begin preload of Physics scene");
    }

    onStop()
    {
        this.player = undefined;
    }
}