import { Graphics, XML } from "p5";
import GameObject from "../GameObject";
import Scene from "../Scene";
import TLayerChunk from "./TLayerChunk";
import Tilemap from "./Tilemap";
import Tile from "./Tile";

type TLayerProps = Readonly<{
    layer: XML;
    scene: Scene;
    tilemap: Tilemap;
}>;

export default class TLayer implements GameObject {
    private layer: XML;
    private scene: Scene;
    private id!: string;
    private name!: string;
    private width!: number;
    private height!: number;
    private chunks: TLayerChunk[];
    private offsetx!: number;
    private offsety!: number;
    private _x: number = 0;
    private _y: number = 0;
    private tilemap: Tilemap;
    private _tiles: Tile[];

    set x(x: number) {
        this._x = x;
    }

    get x() {
        return this._x;
    }

    set y(y: number) {
        this._y = y;
    }

    get y() {
        return this._y;
    }

    constructor(props: TLayerProps) {
        this.layer = props.layer;
        this.scene = props.scene;
        this.tilemap = props.tilemap;
        this.chunks = [];
        this._tiles = [];
    }

    preload(): any { }

    setup(): void {
        this.id = this.layer.getString("id");
        this.name = this.layer.getString("name");
        this.width = this.layer.getNum("width");
        this.height = this.layer.getNum("height");
        this.offsetx = this.layer.getNum("offsetx");
        this.offsety = this.layer.getNum("offsety");
        const children = this.layer.getChildren();
        if (children.length != 1) {
            console.log(children)
            throw new Error(`Expected only 1 child of this layer: ${this.id}`)
        }
        const data = children[0].getChildren();
        for (let child of data) {
            const chunk = new TLayerChunk(child);
            this.chunks.push(chunk);
        }
        for (let chunk of this.chunks) {
            for (let y = 0; y < chunk.height; y++) {
                for (let x = 0; x < chunk.width; x++) {
                    const i = x + y * chunk.width;
                    const tilegid = chunk.data[i];
                    if (tilegid == 0) continue;
                    let tileset;
                    for (let item of this.tilemap.tilesets) {
                        if (item.firstgid <= tilegid) {
                            tileset = item
                        }
                    }
                    const tile_data = tileset!.getTile(tilegid);
                    const tilewidth = tileset!.tilewidth;
                    const tileheight = tileset!.tileheight;
                    const tilex = x * tilewidth + chunk.x * tilewidth;
                    const tiley = y * tileheight + chunk.y * tileheight;
                    const tile = new Tile({
                        x: tilex + this.offsetx,
                        y: tiley + this.offsety,
                        scene: this.scene,
                        image: tile_data.image.get(tile_data.x, tile_data.y, tile_data.width, tile_data.height)
                    })
                    this._tiles.push(tile);
                }
            }
        }
        for (let tile of this._tiles) {
            this.tilemap.buffer.image(tile.image, Math.floor(tile.x), Math.floor(tile.y));
        }
    }

    draw(): void {
        //for (let tile of this._tiles) {
        //    this.scene.p5.image(tile.image, tile.x, tile.y);
        //}
    }
}
