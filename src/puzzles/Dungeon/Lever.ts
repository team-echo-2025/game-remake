import GameObject from "../../lib/GameObject";
import Sprite from "../../lib/Sprite";
import PhysicsObject from "../../lib/physics/PhysicsObject";
import RigidBody from "../../lib/physics/RigidBody";
import Player from "../../lib/Player";

import Scene from "../../lib/Scene";
export default class Lever implements GameObject{
    x: number = 0;
    y: number =0 ;
    scene: Scene;
    player: Player;
    collider!: PhysicsObject;
    private collider_timeout: any;

    flipped: boolean;
    in_range: boolean;
    asset?: Sprite;
    red_key: string;
    blue_key: string;

    

    constructor(scene: Scene, xPos: number, yPos: number, red_asset_key: string, blue_asset_key: string, player: Player) {
        this.scene = scene;
        this.x = xPos;
        this.y = yPos;
        this.red_key = red_asset_key;
        this.blue_key = blue_asset_key;
        this.flipped = false;
        this.in_range = false;
        this.player = player;
    }

    setup(): void {
        this.collider = new PhysicsObject({
                    width: 100,
                    height: 100,
                    mass: Infinity
                });

        this.asset= this.scene.add_new.sprite(this.blue_key);
        this.asset.x = this.x-10;//hard coded positioning cuz the sprite was appearing towards the corner of the collider
        this.asset.y = this.y-50;
        this.asset.width = 32;
        this.asset.height = 48;
        this.asset.zIndex = 101;

        this.collider.overlaps = true;
        this.collider.body.x = this.x;
        this.collider.body.y = this.y;
        this.scene.physics.addObject(this.collider);
        this.collider.onCollide = (other: RigidBody) => {
            if (other == this.player.body) {
                clearTimeout(this.collider_timeout);
                if (!this.in_range) {
                    this.in_range = true;
                    console.log("in range of lever");
                }
                this.collider_timeout = setTimeout(() => {
                    console.log("outa range of lever");
                    this.in_range = false;
                }, 100);
            }
        }
    }

    draw(): void {
        if(this.in_range){
            this.scene.p5.push();
            this.scene.p5.stroke("yellow");
            this.scene.p5.circle(this.asset!.x+15, this.asset!.y+35, 32);

            this.scene.p5.pop()
        }
    }

    keyPressed(e: KeyboardEvent): void {
        if(this.in_range){
            //console.log("lever state: ", this.flipped)
            if (this.flipped) return
            if (e.key == 'e') {
                this.flipped = true;
                this.asset?.change_asset(this.red_key);
            }
        }
    }

}