import { Framebuffer, XML } from "p5";
import GameObject from "../GameObject";
import Scene from "../Scene";
import Tileset from "./Tileset";
import TLayer from "./TLayer";
import { Vector2D } from "../types/Physics";

export type TilemapProps = Readonly<{
    tilemap_key: string;
    x?: number;
    y?: number;
    chunk_size?: number;
    loaded_chunks?: number;
}>

class TilemapBuffer implements GameObject {
    zIndex?: number = -100;
    x: number;
    y: number;
    width: number;
    height: number;
    buffer: Framebuffer;
    scene: Scene;
    constructor(x: number, y: number, width: number, height: number, buffer: Framebuffer, scene: Scene) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.buffer = buffer;
        this.scene = scene;
    }
    draw(): void {
        const x = this.x - this.width / 2
        const y = this.y - this.height / 2;
        this.scene.p5.image(this.buffer, x, y);
    }
}

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
    buffer!: Framebuffer;
    player_buffer!: Framebuffer;
    minx: number = 0;
    maxx: number = 0;
    miny: number = 0;
    maxy: number = 0;
    loaded_chunks: number = 0;
    chunk_offset: Vector2D = { x: 0, y: 0 };
    chunk_size: number = 16;

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
        this.loaded_chunks = props.loaded_chunks ?? 3;
        this.chunk_size = props.chunk_size ?? this.chunk_size;
    }

    async preload(): Promise<any> { }

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
        console.log(this.minx, this.maxx)

        this.buffer = this._scene.p5.createFramebuffer({
            width: this._width,
            height: this._height,
            stencil: false,
            depth: false,
        })!;
        this.player_buffer = this._scene.p5.createFramebuffer({
            width: this._width,
            height: this._height,
            stencil: false,
            depth: false,
        })!;

        for (const layer of this.layers) {
            layer.prerender();
        }
        const tilemap_buffer = new TilemapBuffer(this.x, this.y, this.width, this.height, this.buffer, this._scene);
        this._scene.add(tilemap_buffer);
        const player_buffer = new TilemapBuffer(this.x, this.y, this.width, this.height, this.player_buffer, this._scene);
        this.player_buffer.begin();
        player_buffer.zIndex = 100;
        this._scene.add(player_buffer);
        this._scene.p5.push();
        this._scene.p5.rectMode("corner");
        this._scene.p5.noFill();
        this._scene.p5.stroke(255, 0, 0);
        this._scene.p5.rect(this.x - this._width / 2, this.y - this._height / 2, this._width, this._height);
        this._scene.p5.pop();
        this.player_buffer.end();
    }
}
