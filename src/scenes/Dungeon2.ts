import { Graphics } from "p5";
import PhysicsObject from "../lib/physics/PhysicsObject";
import Rectangle from "../lib/physics/Rectangle";
import RigidBody from "../lib/physics/RigidBody";
import Player from "../lib/Player";
import { PuzzleState } from "../lib/Puzzle";
import Scene from "../lib/Scene";
import Spritesheet from "../lib/Spritesheet";
import Tilemap from "../lib/tilemap/Tilemap";
import { Vector2D } from "../lib/types/Physics";
import AccessCircuit from "../puzzles/AccessCircuit/AccessCircuit";

type StartArgs = Readonly<{
    starting_pos: Vector2D
}>

export default class Dungeon2 extends Scene {
    player?: Player;
    tilemap?: Tilemap;
    animating: boolean = false;
    access_circuit1?: AccessCircuit;
    access_circuit2?: AccessCircuit;
    access_circuit3?: AccessCircuit;
    access_circuit4?: AccessCircuit;
    background?: Graphics;
    portal?: Spritesheet;

    constructor() {
        super("dungeon-2");
        this.physics.debug = false;
    }

    onStart(args?: StartArgs): void {
        this.camera.zoom = 4;
        this.player = new Player(this);
        this.player.body.x = args?.starting_pos ? args.starting_pos.x : 0;
        this.player.body.y = args?.starting_pos ? args.starting_pos.y : 348;
        this.physics.addObject(this.player);
    }

    preload(): any {
        this.loadImage("puzzle", "assets/access_circuit.png");
        this.loadImage("broken-puzzle", "assets/access_circuit_broken.png");
        this.loadImage("success-puzzle", "assets/access_circuit_success.png");
        this.loadImage("highlighted-puzzle", "assets/access_circuit_highlighted.png");
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/PetersTileMap/Dungeon Floor 1.tmx");
        this.loadImage("portal", "assets/tilemaps/LaythsTileMap/portal-sheet.png");
        this.loadSound("button_sfx", "assets/TInterfaceSounds/light-switch.mp3");
        this.loadSound("circuit_correct_sfx", "assets/TInterfaceSounds/greanpatchT.mp3");
        this.loadSound("circuit_incorrect_sfx", "assets/TInterfaceSounds/all-processorsT.mp3");
        this.loadSound("circuit_xposition_sfx", "assets/TInterfaceSounds/iciclesT.mp3");
    }

    setup(): void {
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

        this.access_circuit1 = new AccessCircuit(this, 'puzzle', this.player!);
        this.access_circuit1.x = -435;
        this.access_circuit1.y = 213;
        this.access_circuit1?.setup();
        this.access_circuit1.asset.zIndex = 101;
        this.access_circuit1.onCompleted = () => {
            this.check_completed();
        }

        this.access_circuit2 = new AccessCircuit(this, 'puzzle', this.player!);
        this.access_circuit2.x = -24;
        this.access_circuit2.y = -310;
        this.access_circuit2?.setup();
        this.access_circuit2.asset.zIndex = 101;
        this.access_circuit2.onCompleted = () => {
            this.check_completed();
        }

        this.access_circuit3 = new AccessCircuit(this, 'puzzle', this.player!);
        this.access_circuit3.x = 425;
        this.access_circuit3.y = -15;
        this.access_circuit3?.setup();
        this.access_circuit3.asset.zIndex = 101;
        this.access_circuit3.onCompleted = () => {
            this.check_completed();
        }

        this.access_circuit4 = new AccessCircuit(this, 'puzzle', this.player!);
        this.access_circuit4.x = 200;
        this.access_circuit4.y = 150;
        this.access_circuit4?.setup();
        this.access_circuit4.asset.zIndex = 101;
        this.access_circuit4.onCompleted = () => {
            this.check_completed();
        }

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
                this.start('dungeon-1', {
                    starting_pos: { x: -103, y: -636 }
                });
            }
        }
        this.physics.addObject(object);
    }

    check_completed = () => {
        if (this.access_circuit1?.state == PuzzleState.completed &&
            this.access_circuit2?.state == PuzzleState.completed &&
            this.access_circuit3?.state == PuzzleState.completed &&
            this.access_circuit4?.state == PuzzleState.completed) {
            this.player!.body.x = 0;
            this.player!.body.y = 0;
            this.portal?.once(true);
        }
    }

    // We may want this to be a pause menu eventually
    keyPressed = (e: KeyboardEvent) => {
        this.access_circuit1?.keyPressed(e);
        this.access_circuit2?.keyPressed(e);
        this.access_circuit3?.keyPressed(e);
        this.access_circuit4?.keyPressed(e);
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };

    mousePressed(_: MouseEvent): void {
        this.access_circuit1?.mousePressed();
        this.access_circuit2?.mousePressed();
        this.access_circuit3?.mousePressed();
        this.access_circuit4?.mousePressed();
    }

    mouseReleased(_: MouseEvent): void {
        this.access_circuit1?.mouseReleased();
        this.access_circuit2?.mouseReleased();
        this.access_circuit3?.mouseReleased();
        this.access_circuit4?.mouseReleased();
    }

    onStop(): void {
        this.player = undefined;
        this.tilemap = undefined;
        this.access_circuit1 = undefined;
        this.access_circuit2 = undefined;
        this.access_circuit3 = undefined;
        this.access_circuit4 = undefined;
        this.portal = undefined;
        this.background = undefined;
    }

    postDraw(): void {
        this.access_circuit1?.postDraw();
        this.access_circuit2?.postDraw();
        this.access_circuit3?.postDraw();
        this.access_circuit4?.postDraw();
    }

    draw(): void {
        this.access_circuit1?.draw();
        this.access_circuit2?.draw();
        this.access_circuit3?.draw();
        this.access_circuit4?.draw();
    }
}
