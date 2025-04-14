import PhysicsObject from "../../lib/physics/PhysicsObject";
import Player from "../../lib/Player";
import Tilemap from "../../lib/tilemap/Tilemap";
import Scene from "../../lib/Scene";
import PageManager from "../../lib/PageManager";
import SwitchesPage from "../../pages/SwitchesPage";
import RigidBody from "../../lib/physics/RigidBody";
import { Vector2D } from "../../lib/types/Physics";
import { PuzzleState } from "../../lib/Puzzle";
import Dialogue from "../../lib/ui/Dialogue";
import Sprite from "../../lib/Sprite";
import interactiveSwitch from "./interactiveSwitches";

type SceneState = {
    access_puzzle: PuzzleState;
};

type StartArgs = Readonly<{
    starting_pos: Vector2D;
}>;

export default class Switches extends Scene {
    pManager: PageManager;
    player?: Player;
    tilemap?: Tilemap;
    positions: [number, number][] = [];
    switches: PhysicsObject[] = [];
    firstSwitch?: [number, number];
    secondSwitch?: [number, number];
    foundFirst = false;
    secondSwitchActivated = false;
    dialogue!: Dialogue;
    playSwitch?: interactiveSwitch;

    constructor() {
        super("Switches");
        this.physics.debug = false;
        this.pManager = new PageManager([new SwitchesPage()], this);
        this.camera.zoom = 3;
    }

    onStart(): void {
        this.add(this.pManager);
        this.pManager.set_page("SwitchesPage");

        this.player = new Player(this);
        this.player.body.x = 557;
        this.player.body.y = 386;
        this.physics.addObject(this.player);
    }

    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/PetersTileMap/Switches.tmx");
        this.loadImage("switchesOff", "assets/tilemaps/PetersTileMap/switchesOff.png");
        this.loadImage("switchesOn", "assets/tilemaps/PetersTileMap/switchesOn.png");
        this.loadImage("wrong", "assets/tilemaps/PetersTileMap/switchesWrong.png");
        this.loadImage("computer-highlight", "assets/puzzleImages/retroIBM-Highlighted.png");
    }

    setup(): void {
        const xOffset = -12;
        const yOffset = -40;
        this.tilemap = this.add_new.tilemap({ tilemap_key: "tilemap" });

        this.positions = [
            [-302,-257], [-238,-257], [-175,-257], [-111,-257], [-47,-257], [17,-257], [81,-257], [145,-257],
            [-302,-190], [-238,-190], [-175,-190], [-111,-190], [-47,-190], [17,-190], [81,-190], [145,-190],
            [-302,-125], [-238,-125], [-175,-125], [-111,-125], [-47,-125], [17,-125], [81,-125], [145,-125]
        ].map(([x, y]) => [x + xOffset, y + yOffset]);

        // Randomize puzzle switches
        const shuffled = [...this.positions].sort(() => Math.random() - 0.5);
        this.firstSwitch = shuffled[0];
        this.secondSwitch = this.findAdjacent(this.firstSwitch)!;

        // Add visible interactive switches
        this.playSwitch = new interactiveSwitch(this, "switchesOff", this.player!, this.positions);
        this.playSwitch.setup();

        // Dialogue
        this.dialogue = new Dialogue(this, this.player!);
    }

    findAdjacent(pos: [number, number]): [number, number] | undefined {
        const [x, y] = pos;
        const directions = [[64,0], [-64,0], [0,64], [0,-64]];
    
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
        if (e.key === "Escape") {
            this.start("menu-scene");
        }

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
                        this.scene_manager.deductTime(.25);
                        this.playSwitch.interactWithSwitch(i, false);
                    }

                    if (this.foundFirst && this.secondSwitchActivated) {
                        this.start("playscene-2");
                    }

                    break; // Avoid multiple triggers
                }
                else{
                    this.scene_manager.deductTime(.25);
                }
            }
        }
    };

    onStop(): void {
        this.tilemap = undefined;
        this.player = undefined;
    }

    draw(): void {}
    postDraw(): void {}
}
