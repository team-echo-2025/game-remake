import PhysicsObject from "../../lib/physics/PhysicsObject";
import RigidBody from "../../lib/physics/RigidBody";
import Player from "../../lib/Player";
import Puzzle from "../../lib/Puzzle";
import Scene from "../../lib/Scene";
import Sprite from "../../lib/Sprite";

export default class interactiveSwitch extends Puzzle {
    physics_objects: PhysicsObject[] = [];
    highlight_states: boolean[] = [];
    collider_timeouts: any[] = [];
    permanentlyActivated: boolean[] = [];
    asset_key: string;
    assets: Sprite[] = [];
    player: Player;
    positions: [number, number][];

    constructor(scene: Scene, puzzle_asset_key: string, player: Player, positions: [number, number][]) {
        super(scene);
        this.asset_key = puzzle_asset_key;
        this.player = player;
        this.positions = positions;
    }

    async preload(): Promise<void> {}

    setup(): void {
        for (let i = 0; i < this.positions.length; i++) {
            const [x, y] = this.positions[i];

            const physics_object = new PhysicsObject({
                width: 45,
                height: 55,
                mass: Infinity
            });

            physics_object.overlaps = true;

            const index = i;
            this.highlight_states.push(false);
            this.collider_timeouts.push(-1);
            this.permanentlyActivated.push(false);

            physics_object.onCollide = (other: RigidBody) => {
                if (other === this.player.body) {
                    clearTimeout(this.collider_timeouts[index]);
                    if (!this.highlight_states[index] && !this.permanentlyActivated[index]) {
                        this.highlight_states[index] = true;
                        this.assets[index].change_asset("switch-highlight");
                    }
                    

                    this.collider_timeouts[index] = setTimeout(() => {
                        this.highlight_states[index] = false;
                        if (!this.permanentlyActivated[index]) {
                            this.assets[index].change_asset("switchesOff");
                        }
                    }, 100);
                }
            };

            this.scene.physics.addObject(physics_object);
            this.physics_objects.push(physics_object);

            const asset = this.scene.add_new.sprite(this.asset_key);
            asset.zIndex = 49;
            asset.x = x;
            asset.y = y;
            asset.width = 24;
            asset.height = 48;
            physics_object.body.x = x+asset.width/2;
            physics_object.body.y = y+asset.height/2;
            this.assets.push(asset);
        }
    }

    interactWithSwitch(index: number, isCorrect: boolean): void {
        if (isCorrect) {
            this.permanentlyActivated[index] = true;
            this.assets[index].change_asset("switchesOn");
        } else {
            this.assets[index].change_asset("wrong");
            setTimeout(() => {
                if (!this.permanentlyActivated[index]) {
                    this.assets[index].change_asset("switchesOff");
                }
            }, 800);
        }
    }

    draw(): void {}
    postDraw(): void {}
}
