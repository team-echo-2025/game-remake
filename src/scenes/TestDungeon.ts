import GameObject from "../lib/GameObject";
import PhysicsObject from "../lib/physics/PhysicsObject";
import Rectangle from "../lib/physics/Rectangle";
import Player from "../lib/Player";
import Scene from "../lib/Scene";
import Spritesheet from "../lib/Spritesheet";
import Tilemap from "../lib/tilemap/Tilemap";
import AccessCircuit from "../puzzles/AccessCircuit/AccessCircuit";

class Door implements GameObject {
    private _x: number = 0;
    private _y: number = 0;
    zIndex?: number | undefined = 102;
    asset_key: string;
    asset!: Spritesheet;
    scene: Scene;
    physics_object!: PhysicsObject;

    get x() {
        return this._x;
    }

    set x(_x: number) {
        this._x = _x;
        this.asset.x = _x;
        this.physics_object.body.x = this.x;
    }

    get y() {
        return this._y;
    }

    set y(_y: number) {
        this._y = _y;
        this.asset.y = _y;
        this.physics_object.body.y = this.y - 10;
    }

    constructor(scene: Scene, door_key: string) {
        this.asset_key = door_key;
        this.scene = scene;
    }

    setup() {
        this.asset = this.scene.add_new.spritesheet(this.asset_key, 8, 1, 500);
        this.asset.zIndex = 99;
        this.asset.end_col = 4;
        this.physics_object = new PhysicsObject({
            width: this.asset.width + 10,
            height: this.asset.height / 2,
            mass: Infinity,
        });
        this.scene.physics.addObject(this.physics_object);
    }

    open() {
        this.asset.once(true);
        this.scene.physics.remove(this.physics_object);
    }
}

export default class TestDungeon extends Scene {
    player?: Player;
    tilemap?: Tilemap;
    door?: Door;
    access_circuit?: AccessCircuit;

    constructor() {
        super("dungeon-scene");
        this.physics.debug = true;
    }

    onStart(): void {
        this.camera.zoom = 3;
        this.player = new Player(this);
        this.player.body.x = -466;
        this.player.body.y = 31;
        this.physics.addObject(this.player);
    }

    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/PetersTileMap/Dungeon.tmx")
        this.loadImage("door", "assets/doors/prison_door.png");
        this.loadImage("puzzle", "assets/access_circuit.png");
        this.loadImage("broken-puzzle", "assets/access_circuit_broken.png");
        this.loadImage("success-puzzle", "assets/access_circuit_success.png");
    }

    setup(): void {
        this.access_circuit = new AccessCircuit(this, 'puzzle', this.player!);
        this.access_circuit.x = -321;
        this.access_circuit.y = -105;
        this.access_circuit?.setup();
        this.access_circuit.asset.zIndex = 101;

        this.tilemap = this.add_new.tilemap({
            tilemap_key: "tilemap",
        })
        const yoffset = 350;
        const xoffset = 70;
        this.bounds = new Rectangle({ x: -xoffset / 2, y: -yoffset / 2, w: this.tilemap.width * this.tilemap.tilewidth - xoffset, h: this.tilemap.height * this.tilemap.tileheight - yoffset });

        this.door = new Door(this, "door");
        this.door.setup();
        this.door.x = -415;
        this.door.y = -110;
        this.access_circuit.onCompleted = () => {
            this.door!.open();
        }
        //@ts-ignore
    }

    mousePressed(_: MouseEvent): void {
        this.access_circuit?.mousePressed();
    }

    mouseReleased(_: MouseEvent): void {
        this.access_circuit?.mouseReleased();
    }



    // We may want this to be a pause menu eventually
    keyPressed = (e: KeyboardEvent) => {
        this.access_circuit?.keyPressed(e);
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };

    onStop(): void {
        this.player = undefined;
        this.tilemap = undefined;
        this.door = undefined;
        this.access_circuit = undefined;
    }

    postDraw(): void {
        this.access_circuit?.postDraw();
    }

    draw(): void {
        this.access_circuit?.draw();
    }
}
