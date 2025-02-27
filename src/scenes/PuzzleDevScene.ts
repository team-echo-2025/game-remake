import Scene from "../lib/Scene";
import ButtonTest from "../lib/ui/ButtonTest";
import AccessCircuit from "../puzzles/AccessCircuit/AccessCircuit";
import BlockSlide from "../puzzles/BlockSlide/BlockSlide";
import LightsOn from "../puzzles/LightsOn/LightsOn";
import Puzzle from "../lib/Puzzle"
import Player from "../lib/Player";

export default class PuzzleDevScene extends Scene {
    easy!: ButtonTest;
    normal!: ButtonTest;
    hard!: ButtonTest;
    aCircuit!: AccessCircuit;
    bSlide!: BlockSlide;
    lightsOn!: LightsOn;
    aCircuitButton!: ButtonTest;
    bSlideButton!: ButtonTest;
    lightsOnButton!: ButtonTest;
    bSlideSolveButton!: ButtonTest;
    set_difficulty!: Puzzle;
    player!: Player;

    constructor() {
        super("puzzle-dev-scene");
        this.set_difficulty = new Puzzle(this);
    }

    onStart(): void {
        this.player = new Player(this)
        this.add(this.player);
        this.physics.debug = false;
        this.bSlide = new BlockSlide(this);
        this.lightsOn = new LightsOn(this);

        this.bSlide.hidden = true;
        this.lightsOn.hidden = true;

        this.add(this.bSlide);
        this.add(this.lightsOn);
    }

    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadImage("puzzle", "assets/access_circuit.png");
    }

    setup(): void {
        this.aCircuit = new AccessCircuit(this, 'puzzle', this.player);
        this.aCircuit.hidden = true;
        this.aCircuit?.setup();
        // difficulty settings
        this.easy = this.add_new.button({
            label: "Easy",
            font_key: 'jersey',
            callback: () => {
                this.setDifficulty("easy");
            }
        })
        this.easy.y = -100;
        this.easy.x = -200;

        this.normal = this.add_new.button({
            label: "Normal",
            font_key: 'jersey',
            callback: () => {
                this.setDifficulty("normal");
            }
        })
        this.normal.x = -200;

        this.hard = this.add_new.button({
            label: "Hard",
            font_key: 'jersey',
            callback: () => {
                this.setDifficulty("hard");
            }
        })
        this.hard.y = 100;
        this.hard.x = -200;

        // puzzles
        this.aCircuitButton = this.add_new.button({
            label: "Access Circuit",
            font_key: "jersey",
            callback: () => {
                this.aCircuit.hidden = false;
                this.bSlide.hidden = true;
                this.lightsOn.hidden = true;
                this.changeButtonVisibility();
            }
        });

        this.bSlideButton = this.add_new.button({
            label: "Block Slide",
            font_key: "jersey",
            callback: () => {
                this.bSlide.hidden = false;
                this.aCircuit.hidden = true;
                this.lightsOn.hidden = true;
                this.bSlideSolveButton.hidden = false;
                this.changeButtonVisibility();
            }
        });
        this.bSlideButton.y = 100;

        this.bSlideSolveButton = this.add_new.button({
            label: "Auto-Solve",
            font_key: "jersey",
            callback: () => {
                this.bSlideSolveButton.hidden = true;
                this.bSlide.solvePuzzle();
            }
        })
        this.bSlideSolveButton.x = 300;
        this.bSlideSolveButton.hidden = true; // No need to see this unless bSlide is open

        // Lights On button
        this.lightsOnButton = this.add_new.button({
            label: "Lights On",
            font_key: "jersey",
            callback: () => {
                this.lightsOn.hidden = false;
                this.aCircuit.hidden = true;
                this.bSlide.hidden = true;
                this.changeButtonVisibility();
            }
        });
        this.lightsOnButton.y = 200;
    }

    keyPressed = (e: KeyboardEvent) => {
        if (e.key == "Escape" && !this.aCircuit.hidden) {
            this.aCircuit.hidden = true;
            this.changeButtonVisibility();
        } else if (e.key == "Escape" && !this.bSlide.hidden) {
            this.bSlide.hidden = true;
            this.changeButtonVisibility();
        } else if (e.key == "Escape" && !this.lightsOn.hidden) {
            this.lightsOn.hidden = true;
            this.changeButtonVisibility();
        } else if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };

    setDifficulty(difficulty: string) {
        console.log(`Changing difficulty to: ${difficulty}`);

        this.set_difficulty.setDifficulty(difficulty);  // Ensure global difficulty is updated

        // Update difficulty for all puzzles (even if hidden)
        this.aCircuit.setDifficulty(difficulty);
        this.bSlide.setDifficulty(difficulty);
        this.lightsOn.setDifficulty(difficulty);
    }

    changeButtonVisibility(): void {
        this.easy.hidden = !this.easy.hidden;
        this.normal.hidden = !this.normal.hidden;
        this.hard.hidden = !this.hard.hidden;
        this.aCircuitButton.hidden = !this.aCircuitButton.hidden;
        this.bSlideButton.hidden = !this.bSlideButton.hidden;
        this.lightsOnButton.hidden = !this.lightsOnButton.hidden;
    }

    onStop(): void { }

    postDraw(): void {
        this.aCircuit?.postDraw();
    }

    draw(): void {
        this.aCircuit?.draw();
    }
}
