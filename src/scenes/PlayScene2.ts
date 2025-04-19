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
import InteractiveComputer from "./BoatToFloat/lib/interactiveComputer";
import CrossyRoad from "../puzzles/CrossyRoad/CrossyRoad";
import Key from "../puzzles/CrossyRoad/Key";
import Lock from "../puzzles/CrossyRoad/Lock";
import Tasks, { Task } from "../lib/Tasks";
import Switches from "../puzzles/GameSwitch/Switches";

type StartArgs = Readonly<{
    starting_pos: Vector2D;
    completed_BTF: boolean;
}>

export default class Dungeon1 extends Scene {
    player?: Player;
    tilemap?: Tilemap;
    dialogue?: Dialogue;
    background_music?: Sound;
    backgroundMusicManager?: SoundManager;
    switches?: Switches;
    computer?: InteractiveComputer;
    crossyRoad?: CrossyRoad;
    key2?: Key;
    key3?: Key;

    lock1?: Lock;
    lock2?: Lock;
    lock3?: Lock;

    solved: boolean = false;
    tasks?: Tasks;

    task1?: Task;
    task2?: Task;
    task3?: Task;

    constructor() {
        super("playscene-2");
        this.physics.debug = false;
    }

    completed_BTF: boolean = false;

    onStart(args?: StartArgs): void {
        this.task1 = new Task(this, "Cross the sewers.");
        this.task2 = new Task(this, "Fill the hole.");
        this.task3 = new Task(this, "Find the last key.");
        this.camera.zoom = 3;
        this.completed_BTF = args?.completed_BTF ?? this.completed_BTF;
        this.player = new Player(this);
        this.player.body.x = args?.starting_pos?.x ?? -1132;
        this.player.body.y = args?.starting_pos?.y ?? 880;
        this.physics.addObject(this.player);
        this.computer = new InteractiveComputer(this, 'computer', this.player!)
        this.crossyRoad = new CrossyRoad(this, this.player);
        this.crossyRoad.onCompleted = () => {
            this.camera.follow();
            this.camera.x = this.lock3!.x;
            this.camera.y = this.lock3!.y;
            this.player!.disabled = true;
            this.lock3?.unlock();
            this.lock3!.onComplete = () => {
                this.task1?.completeTask("Cross the sewers.");
                this.camera.follow(this.player!.body);
                this.player!.disabled = false;
            }
        }
        this.switches = new Switches(this, this.player);
        

        this.key2 = new Key(this);
        this.key2.x = -414;
        this.key2.y = 460;
        let collided = false;
        this.key2.onCollide = (other: RigidBody) => {
            if (!collided && other == this.player!.body) {
                collided = true;
                this.camera.follow();
                this.camera.x = this.lock2!.x;
                this.camera.y = this.lock2!.y;
                this.player!.disabled = true;
                this.player?.collectKey(this.key2!);
                this.lock2?.unlock();
                this.lock2!.onComplete = () => {
                    this.task2?.completeTask("Fill the hole");
                    this.camera.follow(this.player!.body);
                    this.player!.disabled = false;
                }
            }
        }
        this.physics.addObject(this.key2);

        this.key3 = new Key(this);
        let collided2 = false;
        this.key3.onCollide = (other: RigidBody) => {
            if (!collided2 && other == this.player!.body) {
                collided2 = true;
                this.camera.follow();
                this.camera.x = this.lock1!.x;
                this.camera.y = this.lock1!.y;
                this.player!.disabled = true;
                this.player?.collectKey(this.key3!);
                this.lock1?.unlock();
                this.lock1!.onComplete = () => {
                    this.task3?.completeTask("Find the last key.");
                    this.camera.follow(this.player!.body);
                    this.player!.disabled = false;
                }
            }
        }
        this.physics.addObject(this.key3);
        this.key3.x = -202;
        this.key3.y = 460;

        const lock_z = 49;
        const lock_y = -700;
        this.lock1 = new Lock(this);
        this.lock1.x = 485;
        this.lock1.y = lock_y;
        this.lock1.zIndex = lock_z;

        this.lock2 = new Lock(this);
        this.lock2.x = this.lock1.x + 25;
        this.lock2.y = lock_y;
        this.lock2.zIndex = lock_z;

        this.lock3 = new Lock(this);
        this.lock3.x = this.lock2.x + 25;
        this.lock3.y = lock_y;
        this.lock3.zIndex = lock_z;

        if (!this.solved) {
            this.tasks = new Tasks(this, this.task1, this.task2, this.task3);
            this.add(this.tasks);
        } else {
            this.tasks = new Tasks(this);
            this.add(this.tasks);
        }
    }

    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadFont("jersey", "assets/fonts/cour.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/PetersTileMap/Dungeon.tmx")
        this.loadImage("door", "assets/doors/prison_door.png");
        this.loadImage("puzzle", "assets/puzzleImages/access_circuit.png");
        this.loadImage("computer", "assets/puzzleImages/retroIBM.png");
        this.loadImage("computer-highlight", "assets/puzzleImages/retroIBM-Highlighted.png");
        this.loadImage("broken-puzzle", "assets/puzzleImages/access_circuit_broken.png");
        this.loadImage("success-puzzle", "assets/puzzleImages/access_circuit_success.png");
        // Load the background music file
        this.loadSound("background5", "assets/background5.mp3");
        this.crossyRoad?.preload();
        this.switches?.preload();
    }

    setup(): void {
        this.crossyRoad?.setup();
        if (this.crossyRoad)
            this.add(this.crossyRoad);
        this.switches?.setup();
        if(this.switches)
            this.add(this.switches);
        // this.physics.debug = true;
        this.tilemap = this.add_new.tilemap({
            tilemap_key: "tilemap",
        })

        this.bounds = new BoxCollider({ x: this.tilemap.x, y: this.tilemap.y, w: this.tilemap.width, h: this.tilemap.height });
        const object = new PhysicsObject({
            width: 50,
            height: 35,
            mass: Infinity
        });
        object.body.x = 514;
        object.body.y = -700;
        object.overlaps = true;
        object.onCollide = (other: RigidBody) => {
            if (other == this.player?.body && this.solved) {
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
        enter_portal.body.x = -1182;
        enter_portal.body.y = 863;
        enter_portal.overlaps = true;
        enter_portal.onCollide = (other: RigidBody) => {
            if (other == this.player?.body) {
                this.start("play-scene", {
                    starting_pos: { x: 319, y: -300 },
                });
            }
        };
        this.physics.addObject(object);
        this.physics.addObject(enter_portal);
        

        if (!this.computer) { return }
        this.computer.x = -36;
        this.computer.y = 300;
        this.computer.setup();
        this.computer.asset.zIndex = 49;
        this.computer.disable = this.completed_BTF;

        this.dialogue = new Dialogue(this, this.player!);
        this.dialogue.addDialogue(-1572, 870, "I heard there's a graveyard far north", 100, 100);
        this.dialogue.addDialogue(-1546, 725, "There's a city to the east", 500, 45);
        this.dialogue.addDialogue(-1203, 497, "Is that an ice maze to the northeast??", 45, 500);
        this.dialogue.addDialogue(-1572, 557, "Fahoo forays, dahoo dorays", 100, 100);
        this.dialogue.addDialogue(-1572, 307, "Welcome Christmas! Come this way", 100, 100);
        this.dialogue.addDialogue(-1441, 0, "Fahoo forays, dahoo dorays", 110, 110);
        this.dialogue.addDialogue(-1476, -281, "Welcome Christmas, Christmas Day", 100, 100);
        this.dialogue.addDialogue(-1526, -586, "Finally, you're here", 500, 45);
        this.dialogue.addDialogue(-943, -152, "Seriously, can you move any faster?", 100, 100);
        this.dialogue.addDialogue(-234, -507, "Good you're here. I hope you get lost in the maze", 100, 100);
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

        if (this.solved) {
            this.lock1?.unlock();
            this.lock2?.unlock();
            this.lock3?.unlock();
            this.player?.collectKey(this.key2!);
            this.player?.collectKey(this.key3!);
            this.crossyRoad?.forceSolve();
        }
        //this.start("Switches")
    }

    keyPressed = (e: KeyboardEvent) => {
        if (e.key === "b") {
            this.player!.teleporting = !this.player?.teleporting;
        }
        if (e.key === "Escape") {
            if (!this.scene_manager.paused) {
                this.scene_manager.page_manager?.set_page("pause-page");
            }
        }
        if (e.key === "e" && this.computer?.highlight == true) {
            this.start("boat-to-float")
        }
    };
    checkSolved = () => {
        if (this.solved) return true;
        if (this.player?.keys == 3) {
            this.solved = true;
            return true;
        }
        return false;
    }

    onStop(): void {
        this.tilemap = undefined;
        this.player = undefined;
        this.dialogue = undefined;
        this.backgroundMusicManager = undefined;
        this.computer = undefined;
        this.switches = undefined;
        this.crossyRoad = undefined;
        this.key2 = undefined;
        this.key3 = undefined;

        if (this.background_music) {
            this.background_music.stop();
        }

        this.background_music = undefined
    }

    postDraw() {
        if (this.player && this.scene_manager.paused) this.player.disabled = true;
        else if (this.player && !this.scene_manager.paused) {
            this.player.disabled = false;
        }
    }

    draw(): void {
        this.checkSolved();
    }
    reset() {
        this.solved = false;
        this.completed_BTF = false;
    }
}
