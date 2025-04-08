import PhysicsObject from "../lib/physics/PhysicsObject";
import RigidBody from "../lib/physics/RigidBody";
import Player from "../lib/Player";
import Scene from "../lib/Scene";
import Tilemap from "../lib/tilemap/Tilemap";
import { Vector2D } from "../lib/types/Physics";
import PageManager from "../lib/PageManager";
import IcemazePage from "../pages/icemazePage";
import Sound from "../lib/Sound";
import SoundManager, { SoundManagerProps } from "../lib/SoundManager";
import BoxCollider from "../lib/physics/BoxCollider";

type StartArgs = Readonly<{
    starting_pos: Vector2D;
}>;

export default class IceMaze extends Scene {
    pManager: PageManager;
    player?: Player;
    tilemap?: Tilemap;
    background_music?: Sound;
    backgroundMusicManager?: SoundManager;

    constructor() {
        super("iceMaze");
        this.physics.debug = false;
        this.pManager = new PageManager([new IcemazePage()], this)
    }

    onStart(args?: StartArgs): void {
        this.camera.zoom = 6;

        this.add(this.pManager);
        this.pManager.set_page("icemazePage");
        this.pManager.postDraw();

        // Create the player
        this.player = new Player(this);
        this.player.body.x = args?.starting_pos?.x ?? -215;
        this.player.body.y = args?.starting_pos?.y ?? -215;
        this.physics.friction = 0;
        this.physics.addObject(this.player);
    }

    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/PetersTileMap/iceMaze.tmx");
        // Load the background music file
        this.loadSound("background5", "assets/background5.mp3");
    }

    setup(): void {
        this.tilemap = this.add_new.tilemap({ tilemap_key: "tilemap" });
        if (this.player)
            this.player.body.friction = 0;
        this.bounds = new BoxCollider
            ({
                x: this.tilemap.x,
                y: this.tilemap.y,
                w: this.tilemap.width,
                h: this.tilemap.height,
            });

        // Initialize and loop the background music using Sound and SoundManager.
        this.background_music = this.add_new.sound("background5");
        this.background_music.loop(); // Enable continuous playback

        // Wrap the background music in a SoundManager with group set to "SFX"
        const bgmProps: SoundManagerProps = {
            group: "SFX",
            sounds: [this.background_music]
        };
        this.backgroundMusicManager = this.add_new.soundmanager(bgmProps);
        this.backgroundMusicManager.play();

        // Maze transition objects remain unchanged.
        const mazeBeginning = new PhysicsObject({
            width: 25,
            height: 25,
            mass: Infinity
        });
        mazeBeginning.body.x = -250;
        mazeBeginning.body.y = -215;
        mazeBeginning.overlaps = true;
        mazeBeginning.onCollide = (other: RigidBody) => {
            if (other == this.player?.body) {
                this.start('playscene-2', { starting_pos: { x: -103, y: -636 } });
            }
        };
        this.physics.addObject(mazeBeginning);

        const mazeEnding = new PhysicsObject({
            width: 100,
            height: 50,
            mass: Infinity
        });
        mazeEnding.body.x = 215;
        mazeEnding.body.y = 250;
        mazeEnding.overlaps = true;
        mazeEnding.onCollide = (other: RigidBody) => {
            if (other == this.player?.body) {
                this.start('playscene-3', { starting_pos: { x: 0, y: 348 } });
            }
        };
        this.physics.addObject(mazeEnding);
    }

    keyPressed = (e: KeyboardEvent) => {
        if (e.key === 'r') {
            if (!this.player || !this.player.body) return;
            this.player.body.x = -215;
            this.player.body.y = -215;
        }

        if (e.key === "Escape") {
            this.pManager?.keyPressed(e);
        }
    };

    onStop(): void {
        this.tilemap = undefined;
        this.player = undefined;
        if (this.background_music) {
            this.background_music.stop();
        }
    }

    draw(): void {
        if (!this.player || !this.player.body) return;
        if (!(this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0)) {
            this.player.disabled = true;
        }
        if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
            this.player.disabled = false;
        }
    }

    postDraw(): void { }
}
