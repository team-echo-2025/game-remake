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
                let x = (this.x + tile.x) * this.tilemap.tilewidth;
                let y = (this.y + tile.y) * this.tilemap.tileheight;
                this.buffer!.image(tile.image, tile.x * this.tilemap.tilewidth, tile.y * this.tilemap.tileheight);
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

    load(buffer: p5) {
        this.scene.p5.push();
        this.scene.p5.translate(-this.tilemap.width / 2, -this.tilemap.height / 2);
        this.scene.p5.translate(-this.tilemap.minx, -this.tilemap.miny)
        this.scene.p5.image(this.chunk_image!, this.x * this.tilemap.tilewidth, this.y * this.tilemap.tileheight);
        this.scene.p5.pop();
        this.loaded = true;
        for (const layer of this.layers) {
            layer.load(buffer);
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
