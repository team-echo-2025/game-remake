import { Framebuffer, Graphics, XML } from "p5";
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

export default class Tilemap implements GameObject {
    zIndex?: number = -100;
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
        let i = -50;
        for (let item of this.tilemap!.getChildren()) {
            const name = item.getName();
            if (name == "tileset") {
                const source = item.getString('source');
                const tileset = new Tileset({ tileset_ref: item, tileset_key: `${this.tilemap_key}/${source}`, scene: this._scene })
                tileset.setup();
                this._tilesets.push(tileset)
            } else if (name == "layer") {
                i--;
                const layer = new TLayer({ layer: item, scene: this._scene, tilemap: this, z_index: i });
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

        this._width = this.maxx - this.minx + this.chunk_size;
        this._height = this.maxy - this.miny + this.chunk_size;
        console.log(this._width, this._height, this.maxx, this.minx);

        this.buffer = this._scene.p5.createFramebuffer({
            width: this._width * this._tilewidth,
            height: this._height * this._tileheight,
            stencil: false,
            depth: false,
        })!;
        this.buffer.begin();
        this._scene.p5.rect(0, 0, this.width * this.tilewidth, this.height * this.tileheight);
        this.buffer.end();

        for (const layer of this.layers) {
            layer.prerender();
            this._scene.add(layer);
        }
    }

    draw(): void { }
}
