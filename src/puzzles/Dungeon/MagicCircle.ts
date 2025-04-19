import GameObject from "../../lib/GameObject";
import Sprite from "../../lib/Sprite";
import PhysicsObject from "../../lib/physics/PhysicsObject";
import RigidBody from "../../lib/physics/RigidBody";
import Player from "../../lib/Player";

import Scene from "../../lib/Scene";
import Spritesheet from "../../lib/Spritesheet";
export default class MagicCircle implements GameObject {
    x: number = 0;
    y: number = 0;
    scene: Scene;
    player: Player;
    collider!: PhysicsObject;
    private collider_timeout: any;
    in_range: boolean;
    asset?: Spritesheet;
    asset_key: string;
    hidden: boolean = true;;



    constructor(scene: Scene, xPos: number, yPos: number, asset_key: string, player: Player) {
        this.scene = scene;
        this.x = xPos;
        this.y = yPos;
        this.asset_key = asset_key;
        this.player = player;
        this.in_range = false;
    }

    setup(): void {
        this.collider = new PhysicsObject({
            width: 100,
            height: 100,
            mass: Infinity
        });

        this.asset = this.scene.add_new.spritesheet(this.asset_key, 4, 2, 1000);
        this.asset.x = this.x;
        this.asset.y = this.y;
        // this.asset.width = 64;
        // this.asset.height = 64;

        this.asset.start_col = 0;
        this.asset.end_col = 2;
        this.asset.end_row = 1;
        this.asset.play();

        this.collider.overlaps = true;
        this.collider.body.x = this.x;
        this.collider.body.y = this.y;
        this.scene.physics.addObject(this.collider);
        this.collider.onCollide = (other: RigidBody) => {
            if (other == this.player.body) {
                clearTimeout(this.collider_timeout);
                if (!this.in_range) {
                    this.in_range = true;
                    console.log("in range of circle");
                }
                this.collider_timeout = setTimeout(() => {
                    console.log("outa range of circle");
                    this.in_range = false;
                }, 100);
            }
        }
    }

    draw(): void {

    }

    keyPressed(e: KeyboardEvent): void {
    }
    activateCircle(): void {
        this.asset!.zIndex = 101;
        this.collider.onCollide = (other: RigidBody) => {
            if (other == this.player.body) {
                clearTimeout(this.collider_timeout);
                if (!this.in_range) {
                    this.in_range = true;
                    console.log("in range of active circle");
                }
                this.collider_timeout = setTimeout(() => {
                    console.log("outa range of active circle");
                    this.in_range = false;
                }, 100);
            }
        }
    }
}
