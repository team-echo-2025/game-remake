import { Graphics, Image, XML } from "p5";
import GameObject from "../GameObject";
import Scene from "../Scene";
import Tileset from "./Tileset";
import TLayer from "./TLayer";
import TLayerChunk from "./TLayerChunk";
import { Vector2D } from "../types/Physics";

export type TilemapProps = Readonly<{
    tilemap_key: string;
    x?: number;
    y?: number;
    chunk_size?: number;
    loaded_chunks?: number;
}>

export default class Tilemap implements GameObject {
    private _scene!: Scene;
    private tilemap_key: string;
    private tilemap!: XML;
    private _tilesets!: Tileset[];
    private layers!: TLayer[];
    private _width!: number;
    private _height!: number;
    private _tilewidth!: number;
    private _tileheight!: number;
    private _x: number;
    private _y: number;
    minx: number = 0;
    maxx: number = 0;
    miny: number = 0;
    maxy: number = 0;
    chunks: Map<string, TLayerChunk> = new Map();
    cam_chunksx!: number;
    cam_chunksy!: number;
    buffer!: Graphics;
    buffer_image!: Image;
    player_buffer!: Graphics;
    player_buffer_image!: Image;

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get width() {
        return this._width;
    }

    set width(width: number) {
        this._width = width;
    }

    get height() {
        return this._height;
    }

    set height(height: number) {
        this._height = height;
    }

    get tilewidth() {
        return this._tilewidth;
    }

    get tileheight() {
        return this._tileheight;
    }

    get tilesets() {
        return this._tilesets;
    }

    set scene(scene: Scene) {
        this._scene = scene;
    }

    constructor(props: TilemapProps) {
        this.tilemap_key = props.tilemap_key;
        this._x = props.x ?? 0;
        this._y = props.y ?? 0;
        this._tilesets = [];
        this.layers = [];
    }

    async preload(): Promise<any> { }

    key_for = (vec: Vector2D) => {
        return `${vec.x}:${vec.y}`;
    }

    setup(): void {
        this.tilemap = this._scene.get_asset(this.tilemap_key);
        this._tilewidth = this.tilemap.getNum('tilewidth')
        this._tileheight = this.tilemap.getNum('tileheight')
        this._width = this.tilemap.getNum('width')
        this._height = this.tilemap.getNum('height')
        for (let item of this.tilemap!.getChildren()) {
            const name = item.getName();
            if (name == "tileset") {
                const source = item.getString('source');
                const tileset = new Tileset({ tileset_ref: item, tileset_key: `${this.tilemap_key}/${source}`, scene: this._scene })
                tileset.setup();
                this._tilesets.push(tileset)
            }
        }
        for (let item of this.tilemap!.getChildren()) {
            const name = item.getName();
            if (name == "layer") {
                const layer = new TLayer({ layer: item, scene: this._scene, tilemap: this });
                layer.x = this._x;
                layer.y = this._y;
                this.layers.push(layer);
                layer.setup_layer();
            }
        }
        this._tilesets.sort((item1, item2) => item1.firstgid > item2.firstgid ? 1 : item1.firstgid == item2.firstgid ? 0 : -1)

        for (const layer of this.layers) {
            if (layer.minx < this.minx) {
                this.minx = layer.minx;
            }
            if (layer.maxx > this.maxx) {
                this.maxx = layer.maxx;
            }
            if (layer.miny < this.miny) {
                this.miny = layer.miny;
            }
            if (layer.maxy > this.maxy) {
                this.maxy = layer.maxy;
            }
        }

        this._width = this.maxx - this.minx;
        this._height = this.maxy - this.miny;

        this._scene.p5.push();
        this._scene.p5.rectMode("corner");
        this._scene.p5.noFill();
        this._scene.p5.stroke(255, 0, 0);
        this._scene.p5.rect(this.x - this._width / 2, this.y - this._height / 2, this._width, this._height);
        this._scene.p5.pop();

        for (const [_, chunk] of this.chunks) {
            chunk.preload();
        }

        console.log(this.chunks);
        //this.load_chunks();
        this.buffer = this._scene.p5.createGraphics(this._width, this._height);
        this.player_buffer = this._scene.p5.createGraphics(this._width, this._height);
    }

    postSetup(): void {
        this.cam_chunksx = Math.ceil(this._scene.camera.bounds.halfWidth * 2 / (16 * this.tilewidth));
        this.cam_chunksy = Math.ceil(this._scene.camera.bounds.halfHeight * 2 / (16 * this.tilewidth));
        for (const [_, chunk] of this.chunks) {
            if (chunk.topmost) {
                chunk.load(this.buffer, this.player_buffer);
            } else {
                chunk.load(this.buffer, this.player_buffer);
            }
        }
        this.buffer_image = this.buffer.get();
        this.buffer.remove();
        this.player_buffer_image = this.player_buffer.get();
        this.player_buffer.remove();
        this._scene.set_asset("buffer_image", this.buffer_image);
        this._scene.set_asset("player_buffer_image", this.player_buffer_image);
        const _ = this._scene.add_new.sprite("buffer_image");
        const player_sprite = this._scene.add_new.sprite("player_buffer_image");
        player_sprite.zIndex = 100
    }

    get_camera_index = (): Vector2D => {
        const CHUNK_PIXEL_WIDTH = 16 * this.tilewidth;  // 16×32
        const CHUNK_PIXEL_HEIGHT = 16 * this.tileheight; // 16×32
        const cam_chunkx = Math.floor((this._scene.camera.x) / CHUNK_PIXEL_WIDTH);
        const cam_chunky = Math.floor((this._scene.camera.y) / CHUNK_PIXEL_HEIGHT);
        return { x: cam_chunkx, y: cam_chunky };
    }
}
