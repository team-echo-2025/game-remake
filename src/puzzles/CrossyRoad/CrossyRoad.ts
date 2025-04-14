import PhysicsObject from "../../lib/physics/PhysicsObject";
import RigidBody from "../../lib/physics/RigidBody";
import Player from "../../lib/Player";
import Puzzle, { PuzzleState } from "../../lib/Puzzle";
import Scene from "../../lib/Scene";
import { Vector2D } from "../../lib/types/Physics";
import Key from "./Key";
import Platform from "./Platform";

export default class CrossyRoad extends Puzzle {
    player?: Player;
    key?: Key;
    platform1?: Platform;
    platform2?: Platform;
    platform3?: Platform;
    respawn_point: Vector2D = { x: -323, y: 718 };
    constructor(scene: Scene, player: Player) {
        super(scene);
        this.player = player;

        this.key = new Key(this.scene);
        this.key.x = -320;
        this.key.y = 950;
        this.scene.physics.addObject(this.key);

        // NOTE: order of creation matters because last objects will take control of player over the first objects
        this.platform1 = new Platform(this.scene, this.player);
        this.platform1.body.x = -383;
        this.platform1.body.y = 790;
        this.platform1.maxx = -250;
        this.platform1.minx = -393;
        this.platform1.speed = 100;

        this.platform3 = new Platform(this.scene, this.player);
        this.platform3.body.x = -353;
        this.platform3.body.y = 830;
        this.platform3.maxx = -250;
        this.platform3.minx = -393;
        this.platform3.speed = 200;

        this.platform2 = new Platform(this.scene, this.player);
        this.platform2.body.x = -250;
        this.platform2.body.y = 810;
        this.platform2.flipped = true;
        this.platform2.maxx = -250;
        this.platform2.minx = -359;

    }

    forceSolve() {
        this.player?.collectKey(this.key!);
    }

    preload(): any { }

    setup(): void {
        //this.scene.physics.debug = true;
        let collided = false;
        this.key!.onCollide = (other: RigidBody) => {
            if (!collided && other == this.player!.body) {
                collided = true;
                this.player?.collectKey(this.key!);
                this.onCompleted && this.onCompleted();
                this.state = PuzzleState.completed;
            }
        }
        const river = new PhysicsObject({ width: 150, height: 50, mass: Infinity });
        river.body.x = -320;
        river.body.y = 808;
        river.overlaps = true;
        river.onCollide = (other: RigidBody) => {
            if (!this.player?.on_platform && other == this.player?.body) {
                this.player.body.x = this.respawn_point.x;
                this.player.body.y = this.respawn_point.y;
            }
        }
        this.scene.physics.addObject(river);
    }

    checkSolution(): boolean {
        return this.state == PuzzleState.completed;
    }
}
