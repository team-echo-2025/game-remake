import { Graphics } from "p5";
import PhysicsObject from "../lib/physics/PhysicsObject";
import Rectangle from "../lib/physics/Rectangle";
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

type StartArgs = Readonly<{
    starting_pos: Vector2D
}>

export default class Dungeon2 extends Scene {
    zIndex?: number | undefined = 1050;
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
    portal?: Spritesheet;
    puzzles: (BlockSlide | DrawPuzzle | Breakaway | CubeScalesPuzzle | LightsOn)[] = [];
    constructor() {
        super("playscene-3");
        this.physics.debug = false;
    }

    onStart(args?: StartArgs): void {
        this.camera.zoom = 4;
        this.player = new Player(this);
        this.player.body.x = args?.starting_pos?.x ?? 0;
        this.player.body.y = args?.starting_pos?.y ?? 348;
        this.physics.addObject(this.player);

        this.puzzles.push(
            new BlockSlide(this, 'puzzle', this.player!),
            new DrawPuzzle(this, 'puzzle', this.player!),
            new Breakaway(this, 'puzzle', this.player!),
            new CubeScalesPuzzle(this, 'puzzle', this.player!)
            // new LightsOn(this, 'puzzle', this.player!)
        );
        
    }

    preload(): any {
        this.loadImage("puzzle", "assets/puzzleImages/access_circuit.png");
        this.loadImage("broken-puzzle", "assets/puzzleImages/access_circuit_broken.png");
        this.loadImage("success-puzzle", "assets/puzzleImages/access_circuit_success.png");
        this.loadImage("highlighted-puzzle", "assets/puzzleImages/access_circuit_highlighted.png");
        this.loadImage("drawPuzzle", "assets/puzzleImages/drawPuzzleBase.png");
        this.loadImage("breakaway", "assets/puzzleImages/breakawayBase.png");
        this.loadImage("blockslide", "assets/puzzleImages/blockSlideBase.png");
        this.loadImage("scales", "assets/puzzleImages/scalesBase.png");
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/PetersTileMap/Dungeon Floor 1.tmx");
        this.loadImage("portal", "assets/tilemaps/LaythsTileMap/portal-sheet.png");
        // this.loadSound("button_sfx", "assets/TInterfaceSounds/light-switch.mp3");
        // this.loadSound("circuit_correct_sfx", "assets/TInterfaceSounds/greanpatchT.mp3");
        // this.loadSound("circuit_incorrect_sfx", "assets/TInterfaceSounds/all-processorsT.mp3");
        // this.loadSound("circuit_xposition_sfx", "assets/TInterfaceSounds/iciclesT.mp3");
    }

    cubicBezier(p0: Vector2D, p1: Vector2D, p2: Vector2D, p3: Vector2D, t: number) {
        const x = Math.pow(1 - t, 3) * p0.x +
            3 * Math.pow(1 - t, 2) * t * p1.x +
            3 * (1 - t) * t * t * p2.x +
            Math.pow(t, 3) * p3.x;
        const y = Math.pow(1 - t, 3) * p0.y +
            3 * Math.pow(1 - t, 2) * t * p1.y +
            3 * (1 - t) * Math.pow(t, 2) * p2.y +
            Math.pow(t, 3) * p3.y;
        return { x, y };
    }
    cubicBezierValue(p0: number, p1: number, p2: number, p3: number, t: number) {
        return (1 - t) ** 3 * p0 +
            3 * (1 - t) ** 2 * t * p1 +
            3 * (1 - t) * t ** 2 * p2 +
            t ** 3 * p3;
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

        this.tilemap = this.add_new.tilemap({
            tilemap_key: "tilemap",
        })
        this.bounds = new Rectangle({ x: this.tilemap.x, y: this.tilemap.y, w: this.tilemap.width, h: this.tilemap.height });
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
        portal_body.overlaps = true;
        portal_body.body.x = portal.x;
        portal_body.body.y = portal.y;
        portal_body.onCollide = (other: RigidBody) => {
            if (other == this.player?.body) {
            }
        }
        this.background = this.p5.createGraphics(this.p5.width, this.p5.height);
        this.portal = portal;
        this.physics.addObject(portal_body);
        // /////////////////////////////////////////////////////////
        // const access_circuit = new AccessCircuit(this, "puzzle", this.player!);
        // access_circuit.setup();
        // access_circuit.zIndex = 101;
        // this.add(access_circuit);
        // access_circuit.x = 100;
        // access_circuit.y = 100;
        this.puzzles[0].x = -435; //BlockSlide
        this.puzzles[0].y = 213; //BlockSlide
        this.puzzles[1].x = -24; // DrawPuzzle 
        this.puzzles[1].y = -310; // DrawPuzzle 
        this.puzzles[2].x = 425; // Breakaway 
        this.puzzles[2].y = -15; // Breakaway 
        this.puzzles[3].x = 200; // CubeScales
        this.puzzles[3].y = 150; // CubeScales
        //create puzzle , position , push to array post setup
        // Setup each puzzle
        this.puzzles.forEach(puzzle => {
            puzzle.setup();
            puzzle.hidden = true;
            puzzle.asset.zIndex = 101;
            puzzle.onCompleted = () => {
                this.check_completed();
            };
        });
        
/////////////////////////////////////////////////////////////////////
        // this.access_circuit1 = new AccessCircuit(this, 'puzzle', this.player!);
        // this.access_circuit1.x = -435;
        // this.access_circuit1.y = 213;
        // this.access_circuit1?.setup();
        // this.access_circuit1.asset.zIndex = 101;
        // this.access_circuit1.onCompleted = () => {
        //     this.check_completed();
        // }

        // this.access_circuit2 = new AccessCircuit(this, 'puzzle', this.player!);
        // this.access_circuit2.x = -24;
        // this.access_circuit2.y = -310;
        // this.access_circuit2?.setup();
        // this.access_circuit2.asset.zIndex = 101;
        // this.access_circuit2.onCompleted = () => {
        //     this.check_completed();
        // }

        // this.access_circuit3 = new AccessCircuit(this, 'puzzle', this.player!);
        // this.access_circuit3.x = 425;
        // this.access_circuit3.y = -15;
        // this.access_circuit3?.setup();
        // this.access_circuit3.asset.zIndex = 101;
        // this.access_circuit3.onCompleted = () => {
        //     this.check_completed();
        // }

        // this.access_circuit4 = new AccessCircuit(this, 'puzzle', this.player!);
        // this.access_circuit4.x = 200;
        // this.access_circuit4.y = 150;
        // this.access_circuit4?.setup();
        // this.access_circuit4.asset.zIndex = 101;
        // this.access_circuit4.onCompleted = () => {
        //     this.check_completed();
        // }

        const object = new PhysicsObject({
            width: 100,
            height: 50,
            mass: Infinity
        })
        object.body.x = 0;
        object.body.y = 400;
        object.overlaps = true;
        object.onCollide = (other: RigidBody) => {
            if (other == this.player?.body) {
                this.start('playscene-2', {
                    starting_pos: { x: -103, y: -636 }
                });
            }
        }
        this.physics.addObject(object);
    }

    check_completed = () => {
        if (this.puzzles.every(puzzle => puzzle.state === PuzzleState.completed)) {
            this.player!.body.x = 0;
            this.player!.body.y = 0;
            this.portal?.once(true);
        }
    }

    // We may want this to be a pause menu eventually
    keyPressed = (e: KeyboardEvent) => {
        this.puzzles.forEach(puzzle => puzzle.keyPressed(e));
        if (e.key === "Escape") {
            const containsHidden = this.puzzles.some(puzzle => !puzzle.hidden);
            if(containsHidden){
                this.puzzles.forEach(puzzle => puzzle.hidden = true);
                //@ts-ignore
                this.player?.disabled = false;
            }
            else{
                this.start("menu-scene");
            }
        }
        
    };

    mousePressed(e: MouseEvent): void {
        this.puzzles.forEach(puzzle => puzzle.mousePressed());
    }

    mouseReleased(e: MouseEvent): void {
        this.puzzles.forEach(puzzle => puzzle.mouseReleased && puzzle.mouseReleased(e));
    }

    onStop(): void {
        this.player = undefined;
        this.tilemap = undefined;
        // this.access_circuit1 = undefined;
        // this.access_circuit2 = undefined;
        // this.access_circuit3 = undefined;
        // this.access_circuit4 = undefined;
        this.puzzles.forEach(puzzle => undefined);
        this.portal = undefined;
        this.background = undefined;
    }

    postDraw(): void {
        this.puzzles.forEach(puzzle => !puzzle.hidden && puzzle.postDraw());
    }

    draw(): void {
        this.puzzles.forEach(puzzle => !puzzle.hidden && puzzle.draw());
        this.p5.push();
        // this.p5.image(this.dark_backdrop, -this.p5.width / 2 + this.player!.body.x, -this.p5.height / 2 + this.player!.body.y);
        this.p5.pop();
    }
}
