import Sound from "../lib/Sound";
import SoundManager, { SoundManagerProps } from "../lib/SoundManager";
import BoxCollider from "../lib/physics/BoxCollider";
import PhysicsObject from "../lib/physics/PhysicsObject";
import RigidBody from "../lib/physics/RigidBody";
import Player from "../lib/Player";
import Scene from "../lib/Scene";
import Tilemap from "../lib/tilemap/Tilemap";
import { Vector2D } from "../lib/types/Physics";
import Dialogue from "../lib/ui/Dialogue";

type StartArgs = Readonly<{
    starting_pos: Vector2D
}>

export default class Dungeon1 extends Scene {
    player?: Player;
    tilemap?: Tilemap;
    dialogue!: Dialogue;
    background_music?: Sound;
    backgroundMusicManager?: SoundManager;

    constructor() {
        super("playscene-2");
        this.physics.debug = false;
    }

    onStart(args?: StartArgs): void {
        this.camera.zoom = 3;
        this.player = new Player(this);
        this.player.body.x = args?.starting_pos?.x ?? -1767;
        this.player.body.y = args?.starting_pos?.y ?? 863;
        this.physics.addObject(this.player);
    }

    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadFont("jersey", "assets/fonts/cour.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/PetersTileMap/Dungeon.tmx")
        this.loadImage("door", "assets/doors/prison_door.png");
        this.loadImage("puzzle", "assets/puzzleImages/access_circuit.png");
        this.loadImage("broken-puzzle", "assets/puzzleImages/access_circuit_broken.png");
        this.loadImage("success-puzzle", "assets/puzzleImages/access_circuit_success.png");
        // Load the background music file
        this.loadSound("background5", "assets/background5.mp3");
    }

    setup(): void {
        // this.physics.debug = true;
        this.tilemap = this.add_new.tilemap({
            tilemap_key: "tilemap",
        })
        this.bounds = new BoxCollider({ x: this.tilemap.x, y: this.tilemap.y, w: this.tilemap.width, h: this.tilemap.height });
        const object = new PhysicsObject({
            width: 100,
            height: 100,
            mass: Infinity
        });
        object.body.x = -104;
        object.body.y = -725;
        object.overlaps = true;
        object.onCollide = (other: RigidBody) => {
            if (other == this.player?.body) {
                this.start('iceMaze', {
                    starting_pos: { x: -215, y: -215 }
                });
            }
        };

        const enter_portal = new PhysicsObject({
            width: 50,
            height: 300,
            mass: Infinity
        });
        enter_portal.body.x = -1810;
        enter_portal.body.y = 863;
        enter_portal.overlaps = true;
        enter_portal.onCollide = (other: RigidBody) => {
            if (other == this.player?.body) {
                this.start("play-scene", {
                    starting_pos: { x: 319, y: -300 }
                });
            }
        };

        this.physics.addObject(object);
        this.physics.addObject(enter_portal);

        this.dialogue = new Dialogue(this, this.player!);
        this.dialogue.addDialogue(-1572, 870, "I heard there's a graveyard far north",100,100);
        this.dialogue.addDialogue(-1546, 725, "There's a city to the east",500,45);
        this.dialogue.addDialogue(-1203, 497, "Is that an ice maze to the northeast??",45,500);
        this.dialogue.addDialogue(-1572, 557, "Fahoo forays, dahoo dorays",100,100);
        this.dialogue.addDialogue(-1572, 307, "Welcome Christmas! Come this way",100,100);
        this.dialogue.addDialogue(-1441, 0, "Fahoo forays, dahoo dorays",110,110);
        this.dialogue.addDialogue(-1476, -281, "Welcome Christmas, Christmas Day",100,100);
        this.dialogue.addDialogue(-1526, -586, "Finally, you're here",500,45);
        this.dialogue.addDialogue(-943, -152, "Seriously, can you move any faster?",100,100);
        this.dialogue.addDialogue(-234, -507, "Good you're here. I hope you get lost in the maze",100,100);
        this.dialogue.setup();
        // Initialize the background music using Sound and SoundManager
        this.background_music = this.add_new.sound("background5");
        // Enable continuous looping
        this.background_music.loop();

        // Create a SoundManager with group set to "SFX" so that volume preloads from local storage
        const sfxProps: SoundManagerProps = {
            group: "SFX",
            sounds: [this.background_music]
        };
        this.backgroundMusicManager = this.add_new.soundmanager(sfxProps);
        this.backgroundMusicManager.play();
    }

    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "b") {
            this.player!.teleporting = !this.player?.teleporting;
        }
        if (e.key === "Escape") {
            this.start("menu-scene");
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
        this.dialogue.draw();
    }

}