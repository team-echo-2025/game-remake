import { Graphics, XML } from "p5";
import GameObject from "../GameObject";
import Scene from "../Scene";
import Tileset from "./Tileset";
import TLayer from "./TLayer";

export type TilemapProps = Readonly<{
    tilemap_key: string;
    x?: number;
    y?: number;
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
    buffer!: Graphics;

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

    setup(): void {
        this.tilemap = this._scene.get_asset(this.tilemap_key);
        this._tilewidth = this.tilemap.getNum('tilewidth')
        this._tileheight = this.tilemap.getNum('tileheight')
        this._width = this.tilemap.getNum('width')
        this._height = this.tilemap.getNum('height')
        this.buffer = this._scene.p5.createGraphics(this._width * this._tilewidth, this._height * this.tileheight);
        for (let item of this.tilemap!.getChildren()) {
            const name = item.getName();
            if (name == "tileset") {
                const source = item.getString('source');
                const tileset = new Tileset({ tileset_ref: item, tileset_key: `${this.tilemap_key}/${source}`, scene: this._scene })
                tileset.setup();
                this._tilesets.push(tileset)
            } else if (name == "layer") {
                const layer = new TLayer({ layer: item, scene: this._scene, tilemap: this });
                layer.x = this._x;
                layer.y = this._y;
                this.layers.push(layer);
                layer.setup();
            }
        }
        this._tilesets.sort((item1, item2) => item1.firstgid > item2.firstgid ? 1 : item1.firstgid == item2.firstgid ? 0 : -1)
    }

    draw(): void {
        this._scene.p5.image(this.buffer, this.x - this._scene.p5.width / 2, this.y - this._scene.p5.height / 2);
    }
}
