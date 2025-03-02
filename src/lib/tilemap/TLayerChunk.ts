import p5, { Graphics, Image, XML } from "p5";
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
    minx: number = 0;
    maxx: number = 0;
    miny: number = 0;
    maxy: number = 0;
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
                this.minx = Math.min(this.tilemap.minx, tilePixelX);
                this.miny = Math.min(this.tilemap.miny, tilePixelY);
                this.maxx = Math.max(this.tilemap.maxx, tilePixelX + this.tilemap.tilewidth);
                this.maxy = Math.max(this.tilemap.maxy, tilePixelY + this.tilemap.tileheight);
                let x = tile.x * this.tilemap.tilewidth;
                let y = tile.y * this.tilemap.tileheight;
                let scale = { x: 1, y: 1 };
                let translate = { x: 0, y: 0 };
                this.buffer?.push();
                if (tile.flipped_x && !tile.flipped_y) {
                    scale.x = -1;
                    translate.x = -this.tilemap.tilewidth;
                    x = -x;
                }
                if (tile.flipped_y && !tile.flipped_x) {
                    scale.y = -1;
                    translate.y = -this.tilemap.tileheight;
                    y = -y;
                }
                if (tile.flipped_x && tile.flipped_y) {
                    scale.y = -1;
                    translate.y = -this.tilemap.tileheight;
                    y = -y;
                    scale.x = -1;
                    translate.x = -this.tilemap.tilewidth;
                    x = -x;
                }
                if (tile.rotated) {
                    this.buffer?.angleMode(this.scene.p5.DEGREES);
                    this.buffer?.rotate(-90);
                    this.buffer?.translate(-this.tilemap.tilewidth + tile.x * this.tilemap.tilewidth / 2, this.tilemap.tileheight - tile.y * this.tilemap.tileheight / 2);
                    //this.buffer?.translate(-this.tilemap.tilewidth, -this.tilemap.tileheight);
                    console.log(tile.x * this.tilemap.tilewidth, tile.y * this.tilemap.tileheight, "ROTTTTTATEEEEED", x, y);
                }

                //x -= this.scene.p5.width / 2;
                //y -= this.scene.p5.height / 2;
                this.buffer?.scale(scale.x, scale.y);
                this.buffer?.translate(translate.x, translate.y);
                this.buffer!.image(tile.image, x, y);
                this.buffer?.pop(); // -1438, 55
                tile.x = x;
                tile.y = y;
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
        //buffer.translate(-this.tilemap.width / 2, -this.tilemap.height / 2);
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
