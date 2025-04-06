import p5, { Font } from "p5";
import BoxCollider from "../../lib/physics/BoxCollider";
import PhysicsObject from "../../lib/physics/PhysicsObject";
import Scene from "../../lib/Scene";
import Tilemap from "../../lib/tilemap/Tilemap";
import PlayerDriver from "./lib/PlayerDriver";
import RigidBody from "../../lib/physics/RigidBody";

export class KrabbyPatty extends PhysicsObject {
    zIndex?: number | undefined = 49;
    asset!: p5.Image;
    asset_key: string;
    scene: Scene;
    player: PlayerDriver;
    offestY: number = 0;
    constructor(props: { asset_key: string, scene: Scene, player: PlayerDriver, x?: number, y?: number }) {
        super({ width: 15, height: 15, mass: Infinity });
        this.body.overlaps = true
        this.asset_key = props.asset_key;
        this.scene = props.scene;
        this.body.x = props.x ?? 0;
        this.body.y = props.y ?? 0;
        this.player = props.player;
        let collided = false;
        this.onCollide = (other: RigidBody) => {
            if (!collided && other == this.player.body) {
                collided = true;
                this.player.collectPatty(this);
            }
        };
    }
    setup(): void {
        this.asset = this.scene.get_asset(this.asset_key);
    }
    draw(): void {
        this.scene.p5.push();
        this.scene.p5.translate(this.body.x - this.body.halfWidth, this.body.y - this.body.halfHeight);
        this.scene.p5.image(this.asset, 0, this.offestY, this.body.halfWidth * 2, this.body.halfHeight * 2);
        this.scene.p5.pop();
    }
    update(_: number, scene: Scene): void {
        const pulseSpeed = 0.01;  // Adjust for speed of pulsing
        const pulseAmount = 5;
        this.offestY = Math.sin(scene.p5.millis() * pulseSpeed) * pulseAmount
    }
}

export default class DriveToSurvive extends Scene {
    private tilemap?: Tilemap;
    private player?: PlayerDriver;
    private font?: Font;

    constructor() {
        super("drive-to-survive");
        //this.physics.debug = true;
    }

    onStart(): void {
        this.player = new PlayerDriver(this);
        this.camera.zoom = 2;
        this.player.body.x = 174;
        this.player.body.y = -142;
        this.physics.friction = 0;

        this.physics.addObject(new KrabbyPatty({ x: 165, y: -55, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 262.0540644436044, y: -143.87885831929404, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 386.87327359977735, y: 181.51202165497887, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 678.4521378887966, y: 82.3476714992724, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 346.5637030920261, y: -780.9265033461522, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 347.97899546420285, y: -485.38602015295993, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 159.117151292671, y: -1027.6926928581506, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 178.6487682266204, y: -1103.4500208018708, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 350.8575967199872, y: -1413.6216941342302, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 346.89193664900563, y: -1715.0872758091912, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 374.6153752247851, y: -1910.0739761965922, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 550.346995841409, y: -2098.6718034649257, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 325.59363754389597, y: -2117.806420241448, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 750.5135952590613, y: -2124.8208326454337, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 538.4220393658463, y: -2266.123279257456, asset_key: "krabby-patty", scene: this, player: this.player }));
    }

    preload(): any {
        this.loadFont('jersey', 'assets/fonts/jersey.ttf')
        this.loadTilemap("map", "assets/tilemaps/racing/BoatMap.tmx");
        this.loadImage("monitor", "assets/tilemaps/racing/monitor-frame.png");
        this.loadImage("monitor-overlay", "assets/tilemaps/racing/monitor-overlay.png");
        this.loadImage("krabby-patty", "assets/tilemaps/racing/krabby-patty.png");
    }

    setup(): void {
        const monitor = this.add_new.sprite('monitor');
        monitor.fixed = true;
        monitor.width = this.p5.width;
        monitor.height = this.p5.height;
        monitor.zIndex = 200;
        monitor.x = -monitor.width / 2;
        monitor.y = -monitor.height / 2;

        const monitor_overlay = this.add_new.sprite('monitor-overlay');
        monitor_overlay.fixed = true;
        monitor_overlay.width = this.p5.width;
        monitor_overlay.height = this.p5.height;
        monitor_overlay.zIndex = 199;
        monitor_overlay.x = -monitor_overlay.width / 2;
        monitor_overlay.y = -monitor_overlay.height / 2;

        this.font = this.get_asset("jersey");

        this.tilemap = this.add_new.tilemap({
            tilemap_key: "map",
        });

        this.bounds = new BoxCollider({
            x: this.tilemap.x,
            y: this.tilemap.y,
            w: this.tilemap.width,
            h: this.tilemap.height,
        })
    }

    keyPressed(e: KeyboardEvent): void {
        if (e.key === "Escape") {
            this.start("menu-scene");
        }
    }

    onStop(): void {
        this.tilemap = undefined;
        this.player = undefined;
        this.font = undefined;
    }

    mouseClicked(_: MouseEvent): void {
        try {
            navigator.clipboard.writeText(`this.physics.addObject(new KrabbyPatty({ x: ${this.mouseX}, y: ${this.mouseY}, asset_key: "krabby-patty", scene: this, player: this.player }));`);
        } catch (e: any) { }
    }

    postDraw(): void {
        const text = "You collected " + this.player?.collectedPatties + " patties.";
        this.p5.push();
        this.p5.rectMode(this.p5.CORNER);
        this.p5.textFont(this.font!);
        this.p5.fill(0);
        const width = this.p5.textWidth(text);
        const padding = 10;
        this.p5.translate(-this.p5.width / 2 + this.p5.width * .1, -this.p5.height / 2 + this.p5.height * .1);
        this.p5.rect(0, 0, width + padding, 60);
        this.p5.fill(255);
        this.p5.text(text, padding / 2, 30);
        this.p5.pop();
    }
}
