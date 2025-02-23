import { Framebuffer, XML } from "p5";
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
    prerender() {
        let layer_width = this.tilemap.width;
        let layer_height = this.tilemap.height;
        if (this.topmost) {
            this.tilemap.player_buffer.begin();
        } else {
            this.tilemap.buffer.begin();
        }
        this.scene.p5.push();
        for (const row of this.tiles) {
            for (const tile of row) {
                if (!tile) continue;
                let x = tile.x * this.tilemap.tilewidth - this.width * this.tilemap.tilewidth / 2;
                x += (this.x - this.tilemap.minx) * (this.tilemap.tilewidth)
                x -= this.tilemap.tilewidth * layer_width / 2;
                let y = tile.y * this.tilemap.tileheight - this.height * this.tilemap.tileheight / 2;
                y += (this.y - this.tilemap.miny) * (this.tilemap.tileheight);
                y -= this.tilemap.tileheight * layer_height / 2;
                this.scene.p5.image(tile.image, x + 16 * 48 / 2, y + 16 * 48 / 2);
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
