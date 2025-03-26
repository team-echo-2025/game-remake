import { Graphics, Image, XML } from "p5";
import Tile from "./Tile";
import Scene from "../Scene";
import Tilemap from "./Tilemap";

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
    minx?: number;
    maxx?: number;
    miny?: number;
    maxy?: number;
    layers: TLayerChunk[] = [];
    chunk_image?: Image;
    loaded: boolean = false;
    buffer?: Graphics;

    constructor(chunk: XML, tilemap: Tilemap, scene: Scene, topmost?: boolean) {
        this.data = chunk.getContent().split(',').map(item => parseInt(item));
        this.x = chunk.getNum("x")
        this.y = chunk.getNum("y")
        this.width = chunk.getNum("width")
        this.height = chunk.getNum("height")
        this.scene = scene;
        this.tilemap = tilemap;
        this.topmost = topmost ?? false;
        this.buffer = scene.p5.createGraphics(this.width * tilemap.tilewidth, this.height * tilemap.tileheight);
    }

    precalculate() {
        for (const row of this.tiles) {
            for (const tile of row) {
                if (!tile) continue;
                const tilePixelX = (this.x + tile.x) * this.tilemap.tilewidth;
                const tilePixelY = (this.y + tile.y) * this.tilemap.tileheight;
                if (!this.minx) {
                    this.minx = tilePixelX;
                }
                if (!this.maxx) {
                    this.maxx = tilePixelX + this.tilemap.tilewidth;
                }
                if (!this.miny) {
                    this.miny = tilePixelY;
                }
                if (!this.maxy) {
                    this.maxy = tilePixelY + this.tilemap.tileheight;
                }

                this.minx = Math.min(this.minx, tilePixelX);
                this.miny = Math.min(this.miny, tilePixelY);
                this.maxx = Math.max(this.maxx, tilePixelX + this.tilemap.tilewidth);
                this.maxy = Math.max(this.maxy, tilePixelY + this.tilemap.tileheight);

                this.tilemap.minx = Math.min(this.tilemap.minx, tilePixelX);
                this.tilemap.miny = Math.min(this.tilemap.miny, tilePixelY);
                this.tilemap.maxx = Math.max(this.tilemap.maxx, tilePixelX + this.tilemap.tilewidth);
                this.tilemap.maxy = Math.max(this.tilemap.maxy, tilePixelY + this.tilemap.tileheight);
                let x = tile.x * this.tilemap.tilewidth;
                let y = tile.y * this.tilemap.tileheight;
                this.buffer?.push();
                this.buffer?.translate(x, y);
                if (tile.rotated) {
                    this.buffer?.translate(this.tilemap.tilewidth / 2, this.tilemap.tileheight / 2);
                    this.buffer?.rotate(this.scene.p5.HALF_PI); // 90° rotation
                    this.buffer?.translate(-this.tilemap.tilewidth / 2, -this.tilemap.tileheight / 2);
                    this.buffer?.translate(this.tilemap.tilewidth, 0);
                    this.buffer?.scale(-1, 1);
                }
                if (tile.flipped_x) {
                    this.buffer?.translate(this.tilemap.tilewidth, 0);
                    this.buffer?.scale(-1, 1);
                }
                if (tile.flipped_y) {
                    this.buffer?.translate(0, this.tilemap.tileheight);
                    this.buffer?.scale(1, -1);
                }

                this.buffer!.image(tile.image, 0, 0);
                this.buffer?.pop();

                tile.x = (this.x + tile.x) * this.tilemap.tilewidth;
                tile.y = (this.y + tile.y) * this.tilemap.tileheight;
            }
        }
    }

    preload() {
        for (const layer of this.layers) {
            layer.preload();
        }
        this.chunk_image = this.buffer!.get();
        this.buffer!.remove();
        this.buffer = undefined;
    }

    load(_buffer: Graphics, topmost: Graphics) {
        let buffer;
        if (this.topmost) {
            buffer = topmost;
        } else {
            buffer = _buffer;
        }
        buffer.push();
        buffer.translate(-this.tilemap.minx, -this.tilemap.miny);
        buffer.image(this.chunk_image!, this.x * this.tilemap.tilewidth, this.y * this.tilemap.tileheight);
        buffer.pop();
        this.loaded = true;
        for (const layer of this.layers) {
            layer.load(_buffer, topmost);
        }
    }

    merge_chunk(chunk: TLayerChunk) {
        this.layers.push(chunk);
    }

    unload() {
        for (const layer of this.layers) {
            layer.unload();
        }
        this.loaded = false;
    }
}
