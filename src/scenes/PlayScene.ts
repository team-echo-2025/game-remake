import Player from "../lib/Player";
import Scene from "../lib/Scene";
import AccessCircuit from "../puzzles/AccessCircuit/AccessCircuit";
import BlockSlide from "../puzzles/BlockSlide/BlockSlide";
import Tilemap from "../lib/tilemap/Tilemap";
import ButtonTest from "../lib/ui/ButtonTest";

export default class PlayScene extends Scene {
    player?: Player;
    tilemap?: Tilemap;
    aCircuit!: AccessCircuit;
    bSlide!: BlockSlide;
    aCircuitButton!: ButtonTest;
    bSlideButton!: ButtonTest;

    constructor() {
        super("play-scene");
    }

    onStart(): void {
        //this.physics.debug = true;
        this.player = new Player(this);
        this.physics.addObject(this.player);
        this.aCircuit = new AccessCircuit(this);
        this.bSlide = new BlockSlide(this);
        this.aCircuit.hidden = true;
        this.bSlide.hidden = true;
        this.add(this.aCircuit);
        this.add(this.bSlide);
    }

    preload(): any {
        this.loadFont("jersey", "assets/fonts/jersey.ttf");
        this.loadTilemap("tilemap", "assets/tilemaps/first-tilemap/outside.tmx")
    }

    setup(): void {
        this.aCircuitButton = this.add_new.button({
            label: "Access Circuit",
            font_key: "jersey",
            callback: () => {
                this.aCircuit.hidden = false;
            }
        });
        this.bSlideButton = this.add_new.button({
            label: "Block Slide",
            font_key: "jersey",
            callback: () => {
                this.bSlide.hidden = false;
            }
        });
        this.bSlideButton.y = 100;
        this.tilemap = this.add_new.tilemap({
            tilemap_key: "tilemap",
        })
    }

    // We may want this to be a pause menu eventually
    keyPressed = (e: KeyboardEvent) => {
        if (e.key == "Escape" && !this.aCircuit.hidden) {
            this.aCircuit.hidden = true;
        } else if (e.key === "Escape") {
            this.start("menu-scene");
        }
    };

    mouseClicked(_: MouseEvent): void {
        if (this.player?.shooting) return;
        const obj = this.physics.raycast();
        if (obj) {
            this.physics.remove(obj);
        }
    }

    memorySizeOf(obj: any) {
        var bytes = 0;

        function sizeOf(obj: any) {
            if (obj !== null && obj !== undefined) {
                switch (typeof obj) {
                    case "number":
                        bytes += 8;
                        break;
                    case "string":
                        bytes += obj.length * 2;
                        break;
                    case "boolean":
                        bytes += 4;
                        break;
                    case "object":
                        var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                        if (objClass === "Object" || objClass === "Array") {
                            for (var key in obj) {
                                if (!obj.hasOwnProperty(key)) continue;
                                sizeOf(obj[key]);
                            }
                        } else bytes += obj.toString().length * 2;
                        break;
                }
            }
            return bytes;
        }

        function formatByteSize(bytes: any) {
            if (bytes < 1024) return bytes + " bytes";
            else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KiB";
            else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MiB";
            else return (bytes / 1073741824).toFixed(3) + " GiB";
        }

        return formatByteSize(sizeOf(obj));
    }

    onStop(): void {
        this.player = undefined;
        this.tilemap = undefined;
    }
}
