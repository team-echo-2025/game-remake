import PhysicsObject from "../../lib/physics/PhysicsObject";
import RigidBody from "../../lib/physics/RigidBody";
import Player from "../../lib/Player";
import Puzzle from "../../lib/Puzzle";
import Scene from "../../lib/Scene";
import Sprite from "../../lib/Sprite";

//computer object
export default class howToSwitch extends Puzzle {
    physics_object!: PhysicsObject;
    highlight: boolean = false;
    asset_key: string;
    asset!: Sprite;
    player: Player;
    disable: boolean = false;
    private collider_timeout: any;
    x: number = 0;
    y: number = 0;

    constructor(scene: Scene, puzzle_asset_key: string, player: Player) {
        super(scene);
        this.asset_key = puzzle_asset_key;
        this.player = player;
    }

    async preload(): Promise<void> { }

    setup(): void {
        const body = new PhysicsObject({
            width: 20,
            height: 30,
            mass: Infinity
        })
        body.body.x = this.x;
        body.body.y = this.y;
        this.scene.physics.addObject(body);
        this.physics_object = new PhysicsObject({
            width: 100,
            height: 100,
            mass: Infinity
        });
        this.physics_object.overlaps = true;
        this.physics_object.body.x = this.x;
        this.physics_object.body.y = this.y;
        this.scene.physics.addObject(this.physics_object);
        this.physics_object.onCollide = (other: RigidBody) => {
            if (!this.disable && other == this.player.body) {
                clearTimeout(this.collider_timeout);
                if (!this.highlight) {
                    this.highlight = true;
                    this.asset.change_asset("computer-highlight");
                }
                this.collider_timeout = setTimeout(() => {
                    this.highlight = false;
                    this.asset.change_asset("scroll");
                }, 100);
            }
        }
        this.asset = this.scene.add_new.sprite(this.asset_key);
        this.asset.x = this.x - this.asset.width / 2;
        this.asset.y = this.y - this.asset.height / 2;
        this.asset.width = 32;
        this.asset.height = 32;
    }


    draw() { }

    postDraw() { }
}
