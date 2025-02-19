import Scene from "../lib/Scene";
import ButtonTest from "../lib/ui/ButtonTest";
import AccessCircuit from "../puzzles/AccessCircuit/AccessCircuit";
import BlockSlide from "../puzzles/BlockSlide/BlockSlide";
import Puzzle from "../lib/Puzzle"

export default class PuzzleDevScene extends Scene {
    easy!: ButtonTest;
    normal!: ButtonTest;
    hard!: ButtonTest;
    aCircuit!: AccessCircuit;
    bSlide!: BlockSlide;
    aCircuitButton!: ButtonTest;
    bSlideButton!: ButtonTest;
    bSlideSolveButton!: ButtonTest;
    set_difficulty!: Puzzle;

    constructor() {
        super("puzzle-dev-scene");
        this.set_difficulty = new Puzzle(this);
    }

    onStart(): void {
        this.physics.debug = false;
        this.aCircuit = new AccessCircuit(this);
        this.bSlide = new BlockSlide(this);
        this.aCircuit.hidden = true;
        this.bSlide.hidden = true
        this.add(this.aCircuit);
        this.add(this.bSlide);
    }

    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
    }

    setup(): void {
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
                this.changeButtonVisibility();
            }
        });
        this.bSlideButton = this.add_new.button({
            label: "Block Slide",
            font_key: "jersey",
            callback: () => {
                this.bSlide.hidden = false;
                this.aCircuit.hidden = true;
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
    }

    // We may want this to be a pause menu eventually
    keyPressed = (e: KeyboardEvent) => {
        if (e.key == "Escape" && !this.aCircuit.hidden) {
            this.aCircuit.hidden = true;
            this.changeButtonVisibility();
        } else if (e.key == "Escape" && !this.bSlide.hidden) {
            this.bSlide.hidden = true;
            this.changeButtonVisibility();
        } else if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };

    setDifficulty(difficulty: string) {
        console.log(difficulty);
        this.set_difficulty.setDifficulty(difficulty);
    }

    changeButtonVisibility(): void {
        this.easy.hidden = !this.easy.hidden;
        this.normal.hidden = !this.normal.hidden;
        this.hard.hidden = !this.hard.hidden;
        this.aCircuitButton.hidden = !this.aCircuitButton.hidden;
        this.bSlideButton.hidden = !this.bSlideButton.hidden;
    }    

    onStop(): void { }
}
