import Scene from "../lib/Scene";
import ButtonTest from "../lib/ui/ButtonTest";
import AccessCircuit from "../puzzles/AccessCircuit/AccessCircuit";
import BlockSlide from "../puzzles/BlockSlide/BlockSlide";
import LightsOn from "../puzzles/LightsOn/LightsOn";
import CubeScales from "../puzzles/CubeScales/CubeScales";
import Puzzle from "../lib/Puzzle"
import Player from "../lib/Player";

export default class PuzzleDevScene extends Scene {
    easy!: ButtonTest;
    normal!: ButtonTest;
    hard!: ButtonTest;
    aCircuit!: AccessCircuit;
    bSlide!: BlockSlide;
    cScales!: CubeScales;
    lightsOn!: LightsOn;
    aCircuitButton!: ButtonTest;
    bSlideButton!: ButtonTest;
    lightsOnButton!: ButtonTest;
    cScalesButton!: ButtonTest;
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
        this.cScales = new CubeScales(this);
        this.bSlide.hidden = true;
        this.lightsOn.hidden = true;
        this.cScales.hidden = true;
        this.add(this.aCircuit);
        this.add(this.bSlide);
        this.add(this.lightsOn);
    }

    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadImage("puzzle", "assets/access_circuit.png");
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/LaythsTileMap/world-1.tmx")
        this.loadImage("door", "assets/doors/prison_door.png");
        this.loadImage("puzzle", "assets/access_circuit.png");
        this.loadImage("broken-puzzle", "assets/access_circuit_broken.png");
        this.loadImage("success-puzzle", "assets/access_circuit_success.png");
        this.loadSound("background_music", "assets/background_music.mp3");
        this.loadSound("button_sfx", "assets/TInterfaceSounds/light-switch.mp3");
        this.loadSound("circuit_correct_sfx", "assets/TInterfaceSounds/greanpatchT.mp3");
        this.loadSound("circuit_incorrect_sfx", "assets/TInterfaceSounds/all-processorsT.mp3");
        this.loadSound("circuit_xposition_sfx", "assets/TInterfaceSounds/iciclesT.mp3");
    }

    setup(): void {
        this.aCircuit = new AccessCircuit(this, 'puzzle', this.player);
        this.aCircuit.hidden = true;
        this.aCircuit?.setup();
        this.add(this.aCircuit);
        this.cScales.setup();
        this.add(this.cScales);
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
                this.cScales.hidden = true;
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
                this.cScales.hidden = true;
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
                this.cScales.hidden = true;
                this.changeButtonVisibility();
            }
        });
        this.lightsOnButton.y = 200;

        this.cScalesButton = this.add_new.button({
            label: "Cube Scales",
            font_key: "jersey",
            callback: () => {
                this.bSlide.hidden = true;
                this.aCircuit.hidden = true;
                this.lightsOn.hidden = true;
                this.cScales.hidden = false;
                this.changeButtonVisibility();
            }
        });
        this.cScalesButton.y = -100;
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
        } else if (e.key == "Escape" && !this.cScales.hidden) {
            this.cScales.hidden = true;
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
        this.cScalesButton.hidden = !this.cScalesButton.hidden;
    }

    onStop(): void { }

    postDraw(): void {
        this.aCircuit?.postDraw();
    }

    draw(): void {
        this.aCircuit?.draw();
    }
}
