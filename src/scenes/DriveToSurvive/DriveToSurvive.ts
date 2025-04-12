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
    private start_timestamp!: number;

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

        this.physics.addObject(new KrabbyPatty({ x: -25.090814270381657, y: -2151.1439197898167, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -37.632195442136435, y: -2389.8881241951117, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -41.45120144408395, y: -2720.635858611019, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -241.12708927086146, y: -2737.278779303976, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -285.4699905288678, y: -2948.865567879785, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -731.0034686974511, y: -2961.1967765087716, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1493.8309559950112, y: -2948.424783543144, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2014.6771356620222, y: -2924.5, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2300.8544950540754, y: -2990, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2794.458073908555, y: -2941.7137501527986, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2947, y: -2757.980882724111, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2933.5, y: -2554.859577919909, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2623, y: -2508.8959427896634, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2356.5, y: -2514.8313855453225, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2337.405722502309, y: -2096.504203838356, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2341.362014935849, y: -1540.5419615033397, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2327.379875184753, y: -1219.2442641872224, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2110.9868335589626, y: -1141.9590738000254, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2002.8417965424183, y: -1060.7657221109541, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1898.8391993960108, y: -951.2443530209973, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1718.206533254875, y: -884.8558350332827, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1186.2901209357424, y: -939.2203204811748, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -733.6555737665165, y: -880.4138378686262, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -734.3119171994421, y: -625.921523453308, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -756.0920196148962, y: -335.0770325726056, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1023.8318652014813, y: -363.22976228870965, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1251.242072869776, y: -279.8563086990019, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1523.9824960927747, y: -297.3752595556366, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1550.4571556366204, y: -139.03877822509043, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1703.9054660492923, y: 63.60625392770419, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1863.2682694034463, y: 249.48910885741645, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2260.3775933461193, y: 251.3491119080411, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2756.6281717751067, y: 308.2696868848989, asset_key: "krabby-patty", scene: this, player: this.player }));

        this.physics.addObject(new KrabbyPatty({ x: -2792, y: 484.67716916586437, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2776, y: 864.5112794454749, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2765, y: 1282.6121320052741, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2942, y: 1240.6177437311896, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -3080.5, y: 1277.4950280463813, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2762.5, y: 1826.6132812601577, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2766, y: 1526.8703075969374, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2396.5, y: 1313.0388528757333, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2061.3058893458647, y: 1245.2093121043206, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1568.1861529891428, y: 1310.132329009939, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1597.7917812329367, y: 1521.3644148304106, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1578.4187270405355, y: 1934.58000888059, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1579.6902940130162, y: 2118.623416522636, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1833.6115307577393, y: 2093.4900566824826, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1860.1104212671269, y: 1856.740747025397, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2307.9888056498003, y: 1837.1577884865865, asset_key: "krabby-patty", scene: this, player: this.player }));

        this.physics.addObject(new KrabbyPatty({ x: -2782.5, y: 2073.5125051622745, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2780, y: 2494.7382687125323, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2773.5, y: 2768.212765441485, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2567, y: 2800.462697077518, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2464, y: 3001.072588891357, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2356.745326434914, y: 2492.320826889668, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -2183.7788378954906, y: 2329.896433275388, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1732.8070392826405, y: 2330.8250459142428, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1272.695481528592, y: 1932.828513923303, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -1136.6661452124097, y: 2158.504751203393, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -358.04215311587484, y: 2170.3821415265334, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -274.76196135523264, y: 2394.175957566565, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: -147.05190616371203, y: 2600.9855000923612, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 430.3290219229218, y: 2610.5545677696246, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 1038.9598775418945, y: 2654.9327275995615, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 1607.8568099007316, y: 2605.5518542399645, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 2337.819788770688, y: 2514.947271979643, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 2144.4447352886637, y: 2418.148610769488, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 2321.965124240601, y: 2172.501920281097, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 2145.584425623141, y: 1917.4456814594491, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 2525.624468776484, y: 1908.4951358772314, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 1964.1825403318358, y: 1718.2362810281766, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 2331.237374441019, y: 1487.3839259479494, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 2721.721599631133, y: 1499.6534361465635, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 2754.7322055788622, y: 1077.3499298297927, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 2322.7059076974415, y: 977.8743226763133, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 1943.2963928189633, y: 921.3746337158711, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 2136.2807113184626, y: 643.2697288858071, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 2527.573954298918, y: 668.9107445575542, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 2335.60930615721, y: 636.783330371335, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 2333.916126824126, y: 17.503727599214244, asset_key: "krabby-patty", scene: this, player: this.player }));
        this.physics.addObject(new KrabbyPatty({ x: 2337.6534521555486, y: -588.7149719773224, asset_key: "krabby-patty", scene: this, player: this.player }));
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
        this.start_timestamp = this.p5.millis();
    }

    keyPressed(e: KeyboardEvent): void {
        if (e.key === "Escape") {
            this.start("playscene-2", { starting_pos: { x: -630, y: 330 } });
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
        if (this.p5.millis() - this.start_timestamp > 30_000) {
            this.start("playscene-2", { starting_pos: { x: -630, y: 330 } });
            return
        }
        const text2 = "You have " + Math.round(30 - (this.p5.millis() - this.start_timestamp) / 1000) + " seconds left.";
        this.p5.push();
        this.p5.rectMode(this.p5.CORNER);
        this.p5.textFont(this.font!);
        this.p5.fill(0);
        const width2 = this.p5.textWidth(text2);
        const padding2 = 10;
        this.p5.translate(this.p5.width / 2 - width2 - this.p5.width * .1 - padding2, -this.p5.height / 2 + this.p5.height * .1);
        this.p5.rect(0, 0, width2 + padding2, 60);
        this.p5.fill(255);
        this.p5.text(text2, padding2 / 2, 30);
        this.p5.pop();
    }
}
