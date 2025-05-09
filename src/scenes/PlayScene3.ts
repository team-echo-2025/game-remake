import { Graphics } from "p5";
import PhysicsObject from "../lib/physics/PhysicsObject";
import RigidBody from "../lib/physics/RigidBody";
import Player from "../lib/Player";
import Puzzle, { PuzzleState } from "../lib/Puzzle";
import Scene from "../lib/Scene";
import Spritesheet from "../lib/Spritesheet";
import Tilemap from "../lib/tilemap/Tilemap";
import { Vector2D } from "../lib/types/Physics";
import AccessCircuit from "../puzzles/AccessCircuit/AccessCircuit";
import BlockSlide from "../puzzles/BlockSlide/BlockSlide";
import DrawPuzzle from "../puzzles/DrawPuzzle/DrawPuzzle";
import Breakaway from "../puzzles/Breakaway/Breakaway";
import LightsOn from "../puzzles/LightsOn/LightsOn";
import CubeScalesPuzzle from "../puzzles/CubeScales/CubeScales";
import PathPuzzle from "../puzzles/PathPuzzle/PathPuzzle";
import BoxCollider from "../lib/physics/BoxCollider";
import Dialogue from "../lib/ui/Dialogue";
import Tasks, { Task } from "../lib/Tasks"

// Add Sound and SoundManager imports for background music and puzzle sounds
import Sound from "../lib/Sound";
import SoundManager, { SoundManagerProps } from "../lib/SoundManager";

export default class Dungeon2 extends Scene {
    zIndex?: number | undefined = 200;
    player?: Player;
    tilemap?: Tilemap;
    animating: boolean = false;
    dark_backdrop!: Graphics;
    access_circuit1?: AccessCircuit;
    block_slide?: BlockSlide;
    draw_puzzle?: DrawPuzzle;
    breakaway?: Breakaway;
    cube_scales?: CubeScalesPuzzle;
    lights_on?: LightsOn;
    background?: Graphics;
    bodyOfPhysics?: PhysicsObject;
    portal?: Spritesheet;
    puzzles: Puzzle[] = [];
    dialogue!: Dialogue;
    tasks!: Tasks;

    // Background music fields (sound-related changes)
    public background_music?: Sound;
    public backgroundMusicManager?: SoundManager;

    // Puzzle sound fields (sound-related changes)
    public clack_sound?: Sound;
    public rotate_sound?: Sound;
    public click_sound?: Sound;
    public snap_sound?: Sound;
    public lightSwitch_sound?: Sound;
    public swish_sound?: Sound;
    public puzzleSfxManager?: SoundManager;
    private solved: boolean = false;
    private puzzle_tasks?: Task[];


    constructor() {
        super("playscene-3");
        this.physics.debug = false;
    }

    onStart(args?: Readonly<{ starting_pos: Vector2D }>): void {
        this.camera.zoom = 4;
        this.player = new Player(this);
        this.player.body.x = args?.starting_pos?.x ?? 0;
        this.player.body.y = args?.starting_pos?.y ?? 348;
        this.physics.addObject(this.player);
    }

    preload(): any {
        this.loadImage("drawPuzzle", "assets/puzzleImages/drawPuzzleBase.png");
        this.loadImage("breakaway", "assets/puzzleImages/breakawayBase.png");
        this.loadImage("blockslide", "assets/puzzleImages/blockSlideBase.png");
        this.loadImage("scales", "assets/puzzleImages/scalesBase.png");
        this.loadImage("drawPuzzle-highlight", "assets/puzzleImages/drawPuzzleBase-highlight.png");
        this.loadImage("breakaway-highlight", "assets/puzzleImages/breakawayBase-highlight.png");
        this.loadImage("blockslide-highlight", "assets/puzzleImages/blockSlideBase-highlight.png");
        this.loadImage("scales-highlight", "assets/puzzleImages/scalesBase-highlight.png");
        this.loadImage("drawPuzzle-success", "assets/puzzleImages/drawPuzzleBase-success.png");
        this.loadImage("breakaway-success", "assets/puzzleImages/breakawayBase-success.png");
        this.loadImage("blockslide-success", "assets/puzzleImages/blockSlideBase-success.png");
        this.loadImage("scales-success", "assets/puzzleImages/scalesBase-success.png");
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/PetersTileMap/Dungeon Floor 1.tmx");
        this.loadImage("portal", "assets/tilemaps/LaythsTileMap/portal-sheet.png");

        // Initialize background music in preload
        // Note: The background music file should be located at "assets/backgorund7.mp3"
        this.loadSound("background7", "assets/backgorund7.mp3");

        // NEW: Preload the puzzle sound assets
        this.loadSound("clack", "assets/TInterfaceSounds/clack-85854.mp3");
        this.loadSound("rotate", "assets/TInterfaceSounds/click-234708.mp3");
        this.loadSound("click", "assets/TInterfaceSounds/mouse-click-290204.mp3");
        this.loadSound("snap", "assets/TInterfaceSounds/snap-264680.mp3");
        this.loadSound("lightSwitch", "assets/TInterfaceSounds/light-switch.mp3");
        this.loadSound("swish", "assets/TInterfaceSounds/swish-sound-94707.mp3");
        this.loadSound("draw", "assets/TInterfaceSounds/draw.mp3");
    }

    cubicBezierNew(
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ): (x: number) => number {
        // Pre-calculate polynomial coefficients
        const cx = 3 * x1;
        const bx = 3 * (x2 - x1) - cx;
        const ax = 1 - cx - bx;

        const cy = 3 * y1;
        const by = 3 * (y2 - y1) - cy;
        const ay = 1 - cy - by;

        // Calculate x for a given t
        function sampleCurveX(t: number): number {
            return ((ax * t + bx) * t + cx) * t;
        }

        // Calculate y for a given t
        function sampleCurveY(t: number): number {
            return ((ay * t + by) * t + cy) * t;
        }

        // Calculate the derivative of x with respect to t
        function sampleCurveDerivativeX(t: number): number {
            return (3 * ax * t + 2 * bx) * t + cx;
        }

        // Given an x value, find parameter t using Newton-Raphson iteration
        function solveCurveX(x: number, epsilon = 1e-6): number {
            let t = x;
            for (let i = 0; i < 8; i++) {
                const xEstimate = sampleCurveX(t) - x;
                if (Math.abs(xEstimate) < epsilon) return t;
                const dEstimate = sampleCurveDerivativeX(t);
                if (Math.abs(dEstimate) < epsilon) break;
                t = t - xEstimate / dEstimate;
            }
            // Fallback to binary search if Newton-Raphson fails
            let t0 = 0;
            let t1 = 1;
            t = x;
            while (t0 < t1) {
                const xEstimate = sampleCurveX(t);
                if (Math.abs(xEstimate - x) < epsilon) return t;
                if (x > xEstimate) {
                    t0 = t;
                } else {
                    t1 = t;
                }
                t = (t0 + t1) / 2;
            }
            return t;
        }

        // Return the easing function mapping an input time fraction (x) to the eased output (y)
        return (x: number): number => {
            const t = solveCurveX(x);
            return sampleCurveY(t);
        };
    }

    setup(): void {
        const puzzle_1 = Puzzle.difficulty == "easy" ? new LightsOn(this, "blockslide", this.player!) : new BlockSlide(this, 'blockslide', this.player!);
        if (puzzle_1 instanceof LightsOn) {
            this.lights_on = puzzle_1;
        }
        puzzle_1.x = -435 - 22;
        puzzle_1.y = 213 - 32;
        puzzle_1.setup();
        this.puzzles.push(puzzle_1);

        const draw_puzzle = new DrawPuzzle(this, 'drawPuzzle', this.player!);
        draw_puzzle.x = -24 - 22;
        draw_puzzle.y = -310 - 32;
        draw_puzzle.setup();
        this.puzzles.push(draw_puzzle);

        const breakaway = new Breakaway(this, 'breakaway', this.player!);
        breakaway.x = 425 - 32;
        breakaway.y = -15 - 32;
        breakaway.setup();
        this.puzzles.push(breakaway);

        const path_puzzle = new PathPuzzle(this, 'scales', this.player!);
        path_puzzle.x = 200 - 22;
        path_puzzle.y = 150 - 32;
        path_puzzle.setup();
        this.puzzles.push(path_puzzle);

        this.add(puzzle_1);
        this.add(draw_puzzle);
        this.add(breakaway);
        this.add(path_puzzle);
        this.puzzle_tasks = this.puzzles.map(() => { return new Task(this) });
        this.tasks = new Tasks(this, ...this.puzzle_tasks);
        this.add(this.tasks);

        this.setupBackdrop();
        this.tilemap = this.add_new.tilemap({
            tilemap_key: "tilemap",
        })
        this.bounds = new BoxCollider({ x: this.tilemap.x, y: this.tilemap.y, w: this.tilemap.width, h: this.tilemap.height });

        const portal = this.add_new.spritesheet("portal", 4, 3, 1000);
        portal.zIndex = 49;
        portal.end_row = 2;
        portal.end_col = 1;
        portal.x = -16;
        portal.y = -1;
        const portal_body = new PhysicsObject({
            width: 100,
            height: 100,
            mass: Infinity
        });
        portal.onComplete = () => {
            this.camera.follow(this.player?.body);
        }
        portal_body.overlaps = true;
        portal_body.body.x = portal.x;
        portal_body.body.y = portal.y;
        let portal_opened = false;
        portal_body.onCollide = (other: RigidBody) => {
            if (!portal_opened && other == this.player?.body && this.isCompleted()) {
                portal_opened = true;
                this.start('playscene-4');
                //this.scene_manager.page_manager?.set_page("non-loser");
                //go to new scene or display UI for win  idc im probs gotta say something deragatory
            }
        }
        this.background = this.p5.createGraphics(this.p5.width, this.p5.height);
        this.portal = portal;
        this.physics.addObject(portal_body);
        // Setup each puzzle
        this.puzzles.forEach((puzzle: Puzzle, index: number) => {
            puzzle.onCompleted = () => {
                this.puzzle_tasks![index].completeTask();
                this.check_completed();
            };
            puzzle.onOpen = () => {
                this.dialogue.killAll();
            };
        });
        const object = new PhysicsObject({
            width: 100,
            height: 50,
            mass: Infinity
        });
        object.body.x = 0;
        object.body.y = 400;
        object.overlaps = true;
        object.onCollide = (other: RigidBody) => {
            if (other == this.player?.body) {
                this.start('iceMaze', {
                    starting_pos: { x: 215, y: 200 }
                });
            }
        }
        this.physics.addObject(object);

        this.dialogue = new Dialogue(this, this.player!);
        this.dialogue.addDialogue(0, 348, "There's puzzles around that need solved to escape");
        this.dialogue.addDialogue(-262, -188, "HURRY UP!!", 50, 50);
        this.dialogue.addDialogue(189, 14, "You are going super slow", 35, 35);
        this.dialogue.addDialogue(-312, 303, "Why are you wasting time reading this? GET GOING", 35, 35);
        this.dialogue.addDialogue(359, 243, "My grandma is faster than you", 35, 35);
        this.dialogue.setup();
        // -----------------------
        // Sound-related changes for background music:
        // Initialize background music.
        // The background music file "assets/backgorund7.mp3" is loaded in preload.
        // Enable gapless looping by accessing the underlying audio element.
        this.background_music = this.add_new.sound("background7")!;
        this.background_music.loop();
        const audioEl = (this.background_music as any).audio as HTMLAudioElement | undefined;
        if (audioEl) {
            audioEl.addEventListener("ended", () => {
                audioEl.currentTime = 0;
                audioEl.play();
            });
        }
        // Wrap the background music in a SoundManager with the grouping variable set to "SFX"
        const bgmProps: SoundManagerProps = {
            group: "SFX",
            sounds: [this.background_music]
        };
        this.backgroundMusicManager = this.add_new.soundmanager(bgmProps);
        this.backgroundMusicManager.play();
        // -----------------------

        // -----------------------
        // Sound-related changes for puzzle sounds:
        // Initialize puzzle sound assets and wrap them in a SoundManager with group "SFX"
        this.clack_sound = this.add_new.sound("clack")!;
        this.rotate_sound = this.add_new.sound("rotate")!;
        this.click_sound = this.add_new.sound("click")!;
        this.snap_sound = this.add_new.sound("snap")!;
        this.lightSwitch_sound = this.add_new.sound("lightSwitch")!;
        this.swish_sound = this.add_new.sound("swish")!;

        const puzzleSfxProps: SoundManagerProps = {
            group: "SFX",
            sounds: [this.clack_sound, this.rotate_sound, this.click_sound, this.snap_sound, this.lightSwitch_sound, this.swish_sound]
        };
        this.puzzleSfxManager = this.add_new.soundmanager(puzzleSfxProps);
    }
    setupBackdrop() {
        this.dark_backdrop = this.p5.createGraphics(this.p5.width, this.p5.height);
        this.dark_backdrop.background(0, 1, 12);
        this.dark_backdrop.erase();
        this.dark_backdrop.translate(this.p5.width / 2, this.p5.height / 2);
        this.dark_backdrop.noStroke();
        this.dark_backdrop.fill(0);
        this.dark_backdrop.circle(0, 0, 50);
        const ease = this.cubicBezierNew(0, .83, .1, .98);
        const ease2 = this.cubicBezierNew(.61, .67, .78, .98);
        for (let i = 0; i < 150; i++) {
            const amount = ease(i / 150);
            this.dark_backdrop.fill(0, (50 - ease2((i) / 150) * 50) + 10 - amount * 10 - 5);
            this.dark_backdrop.circle(0, 0, 50 + i);
        }
        this.dark_backdrop.noErase();

    }

    isCompleted(): boolean {
        return (this.puzzles.every(puzzle => puzzle.state === PuzzleState.completed))
    }

    check_completed = () => {
        if (this.isCompleted()) {
            this.solved = true;
            this.camera.follow();
            this.camera.x = 0;
            this.camera.y = 0;
            this.portal?.once(true);
        }
    }

    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "e" || e.key === 'E') {
            this.dialogue.killAll();
        }
        if (e.key === "Escape") {
            if (!this.scene_manager.paused && this.puzzles.every(puzzle => puzzle.hide_page)) {
                this.player!.disabled = true;
                this.scene_manager.page_manager?.set_page("pause-page");
            }
        }
    };

    onStop(): void {
        this.player = undefined;
        this.tilemap = undefined;
        this.puzzles = [];
        this.portal = undefined;
        this.background = undefined;
        if (this.background_music) {
            this.background_music.stop();
        }
    }

    draw(): void {
        this.p5.push();
        if(this.lights_on?.state !== PuzzleState.completed && !this.solved){   
            this.p5.image(this.dark_backdrop, -this.p5.width / 2 + this.player!.body.x, -this.p5.height / 2 + this.player!.body.y);
        }
        this.p5.pop();
        this.dialogue.draw();
        if (!this.scene_manager.paused && this.puzzles.every(puzzle => puzzle.hide_page) && this.player) {
            this.player.disabled = false;
        }
    }

    reset(): void {
        this.solved = false;
    }
}
