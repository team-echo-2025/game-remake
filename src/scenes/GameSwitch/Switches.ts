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
        this.player.body.x = -90;
        this.player.body.y = -70;
        this.physics.addObject(this.player);
    }

    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/PetersTileMap/Switches.tmx");
        this.loadImage("switchesOff", "assets/tilemaps/PetersTileMap/switchesOff.png");
        this.loadImage("switchesOn", "assets/tilemaps/PetersTileMap/switchesOn.png");
        this.loadImage("computer", "assets/puzzleImages/retroIBM.png");
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
        this.secondSwitch = this.findAdjacent(shuffled[0]);

        // Add invisible physics switches for collisions
        for (const pos of this.positions) {
            const graveSwitch = new PhysicsObject({ width: 50, height: 50, mass: Infinity });
            graveSwitch.body.x = pos[0];
            graveSwitch.body.y = pos[1];
            graveSwitch.overlaps = true;
            this.physics.addObject(graveSwitch);
            this.switches.push(graveSwitch);

            graveSwitch.onCollide = (other: RigidBody) => {
                if (other === this.player?.body) {
                    this.handleSwitchPress(pos);
                }
            };
        }

        // Add visible interactive switches
        this.playSwitch = new interactiveSwitch(this, "switchesOff", this.player!, this.positions);
        this.playSwitch.setup();

        // Dialogue
        this.dialogue = new Dialogue(this, this.player!);
    }

    findAdjacent(pos: [number, number]): [number, number] | undefined {
        const [x, y] = pos;
        const directions = [[64,0], [-64,0], [0,64], [0,-64]];
        return directions
            .map(([dx, dy]) => [x + dx, y + dy] as [number, number])
            .find(p => this.positions.some(([px, py]) => px === p[0] && py === p[1]));
    }

    handleSwitchPress(pos: [number, number]): void {
        if (!this.foundFirst) {
            if (this.firstSwitch && pos[0] === this.firstSwitch[0] && pos[1] === this.firstSwitch[1]) {
                this.foundFirst = true;
                this.dialogue.addDialogue(110, 50, "You found the first switch! Find the second one!");
            } else {
                this.dialogue.addDialogue(110, 50, "Wrong switch! Try again.");
            }
        } else {
            if (this.secondSwitch && pos[0] === this.secondSwitch[0] && pos[1] === this.secondSwitch[1]) {
                this.dialogue.addDialogue(110, 50, "Both switches activated! Puzzle complete!");
                this.start("scene5"); // uncomment if needed
            } else {
                this.dialogue.addDialogue(110, 50, "Wrong second switch! Start over.");
                this.foundFirst = false;
            }
        }
    }

    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
        if (e.key.toLowerCase() === "e") {
            const inRange = this.playSwitch?.highlight_states.some(h => h);
            if (inRange) {
                // Interacting with a highlighted switch
                this.dialogue.addDialogue(110, 50, this.foundFirst ? "Hmm, nothing here." : "There seems to be a switch in another place.");
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
