import PhysicsObject from "../../lib/physics/PhysicsObject";
import Player from "../../lib/Player";
import Tilemap from "../../lib/tilemap/Tilemap";
import Scene from "../../lib/Scene";
import Puzzle from "../../lib/Puzzle";
import Dialogue from "../../lib/ui/Dialogue";
import interactiveSwitch from "./interactiveSwitches";

export default class Switches extends Puzzle {
    player?: Player;
    tilemap?: Tilemap;
    positions: [number, number][] = [];
    switches: PhysicsObject[] = [];
    firstSwitch?: [number, number];
    secondSwitch?: [number, number];
    foundFirst = false;
    secondSwitchActivated = false;
    dialogue!: Dialogue;
    scene: Scene
    playSwitch?: interactiveSwitch;

    constructor(scene: Scene, player: Player) {
        super(scene);
        this.player = player
        this.scene = scene
    }


    preload(): any {
        this.scene.loadImage("switchesOff", "assets/tilemaps/PetersTileMap/switchesOff.png");
        this.scene.loadImage("switchesOn", "assets/tilemaps/PetersTileMap/switchesOn.png");
        this.scene.loadImage("wrong", "assets/tilemaps/PetersTileMap/switchesWrong.png");
        this.scene.loadImage("switch-highlight", "assets/puzzleImages/switch-highlight.png");
    }

    setup(): void {
        const xOffset = -12;
        const yOffset = -40;

        this.positions = [
            //[-302,-257], [-238,-257], [-175,-257], [-111,-257], [-47,-257], [17,-257], [81,-257], [145,-257],
            //[-302,-190], [-238,-190], [-175,-190], [-111,-190], [-47,-190], [17,-190], [81,-190], [145,-190],
            //[-302,-125], [-238,-125], [-175,-125], [-111,-125], [-47,-125], [17,-125], [81,-125], [145,-125]
            [-1024, -795], [-960, -795], [-896, -795], [-832, -795], [-768, -795], [-704, -795], [-640, -795], [-576, -795],
            [-1024, -731], [-960, -731], [-896, -731], [-832, -731], [-768, -731], [-704, -731], [-640, -731], [-576, -731],
            [-1024, -667], [-960, -667], [-896, -667], [-832, -667], [-768, -667], [-704, -667], [-640, -667], [-576, -667]
        ].map(([x, y]) => [x + xOffset, y + yOffset]);

        // Randomize puzzle switches
        const shuffled = [...this.positions].sort(() => Math.random() - 0.5);
        this.firstSwitch = shuffled[0];
        this.secondSwitch = this.findAdjacent(this.firstSwitch)!;

        // Add visible interactive switches
        this.playSwitch = new interactiveSwitch(this.scene, "switchesOff", this.player!, this.positions);
        this.playSwitch.setup();

        // Dialogue
        this.dialogue = new Dialogue(this.scene, this.player!);
    }

    findAdjacent(pos: [number, number]): [number, number] | undefined {
        const [x, y] = pos;
        const directions = [[64, 0], [-64, 0], [0, 64], [0, -64]];

        // Shuffle directions randomly
        const shuffled = directions.sort(() => Math.random() - 0.5);

        // Try all shuffled directions
        for (const [dx, dy] of shuffled) {
            const neighbor: [number, number] = [x + dx, y + dy];
            if (this.positions.some(([px, py]) => px === neighbor[0] && py === neighbor[1])) {
                return neighbor;
            }
        }

        return undefined;
    }


    positionsEqual(a: [number, number], b: [number, number]): boolean {
        return a[0] === b[0] && a[1] === b[1];
    }
    //pretty much handles all game logic
    keyPressed = (e: KeyboardEvent) => {


        if (e.key.toLowerCase() === "e" && this.playSwitch) {
            for (let i = 0; i < this.playSwitch.highlight_states.length; i++) {
                if (this.playSwitch.highlight_states[i]) {
                    const switchPos = this.positions[i];
                    const isFirst = this.positionsEqual(switchPos, this.firstSwitch!);
                    const isSecond = this.positionsEqual(switchPos, this.secondSwitch!);
                    if (isFirst && !this.foundFirst) {
                        this.foundFirst = true;
                        this.playSwitch.interactWithSwitch(i, true);
                    } else if (isSecond && this.foundFirst && !this.secondSwitchActivated) {
                        this.secondSwitchActivated = true;
                        this.playSwitch.interactWithSwitch(i, true);
                    } else {
                        this.scene.scene_manager.deductTime(.25);
                        this.playSwitch.interactWithSwitch(i, false);
                    }

                    if (this.foundFirst && this.secondSwitchActivated) {
                        this.onCompleted && this.onCompleted();
                        //puzzle complete, do something
                    }

                    break; // Avoid multiple triggers
                }
                else {
                    this.scene.scene_manager.deductTime(.25);
                }
            }
        }
    };

    draw(): void { }
    postDraw(): void { }
}
