import { XML } from "p5";
import Tile from "./Tile";
import Scene from "../Scene";
import Tilemap from "./Tilemap";
import { Vector2D } from "../types/Physics";

export default class TLayerChunk {
    data: number[];
    x: number;
    y: number;
    width: number;
    height: number;
    tiles: (Tile | null)[][] = [];
    scene: Scene;
    tilemap: Tilemap;
    topmost: boolean;
    debug: boolean = true;
    minx: number = 0;
    maxx: number = 0;
    miny: number = 0;
    maxy: number = 0;

    constructor(chunk: XML, tilemap: Tilemap, scene: Scene, topmost?: boolean) {
        this.data = chunk.getContent().split(',').map(item => parseInt(item));
        this.x = chunk.getNum("x")
        this.y = chunk.getNum("y")
        this.width = chunk.getNum("width")
        this.height = chunk.getNum("height")
        this.scene = scene;
        this.tilemap = tilemap;
        this.topmost = topmost ?? false;
    }
    precalculate() {
        for (const row of this.tiles) {
            for (const tile of row) {
                if (!tile) continue;
                const tilePixelX = (this.x + tile.x) * this.tilemap.tilewidth;
                const tilePixelY = (this.y + tile.y) * this.tilemap.tileheight;
                this.minx = Math.min(this.tilemap.minx, tilePixelX);
                this.miny = Math.min(this.tilemap.miny, tilePixelY);
                this.maxx = Math.max(this.tilemap.maxx, tilePixelX + this.tilemap.tilewidth);
                this.maxy = Math.max(this.tilemap.maxy, tilePixelY + this.tilemap.tileheight);
                let x = (this.x + tile.x) * this.tilemap.tilewidth;
                let y = (this.y + tile.y) * this.tilemap.tileheight;
                tile.x = x;
                tile.y = y;
            }
        }
    }
    prerender() {
        if (this.topmost) {
            this.tilemap.player_buffer.begin();
        } else {
            this.tilemap.buffer.begin();
        }
        this.scene.p5.push();
        for (const row of this.tiles) {
            for (const tile of row) {
                if (!tile) continue;
                let x = tile.x - this.tilemap.minx;
                x -= this.tilemap.width / 2;
                let y = tile.y - this.tilemap.miny;
                y -= this.tilemap.height / 2;
                this.scene.p5.image(tile.image, x, y);
            }
        }
        this.scene.p5.pop();
        if (this.topmost) {
            this.tilemap.player_buffer.end();
        } else {
            this.tilemap.buffer.end();
        }
    }
}
