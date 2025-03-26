import { Image, XML } from "p5";
import GameObject from "../GameObject";
import Scene from "../Scene";

export type TilesetProps = Readonly<{
    tileset_key: string;
    tileset_ref: XML;
    scene: Scene;
}>

export default class Tileset implements GameObject {
    private scene: Scene;
    private tileset_key: string;
    private tileset!: XML;
    private image!: Image;
    private image_width!: number;
    private image_height!: number;
    private name!: string;
    private _tilewidth!: number;
    private _tileheight!: number;
    private tilecount!: number;
    private columns!: number;
    private _firstgid: number;
    private source: string;

    get firstgid() {
        return this._firstgid;
    }

    get tilewidth() {
        return this._tilewidth;
    }

    get tileheight() {
        return this._tileheight;
    }

    getTile(_gid: number) {
        const gid = _gid & 0x1FFFFFFF;
        if (gid == 0) {
            return { image: this.image, x: 0, y: 0, width: this._tilewidth, height: this._tileheight };
        }
        if (gid < this._firstgid || gid >= this._firstgid + this.tilecount) {
            throw new Error(`GID ${gid} is not in this tileset`);
        }

        const localId = gid - this._firstgid;
        const tileX = (localId % this.columns) * this._tilewidth;
        const tileY = Math.floor(localId / this.columns) * this._tileheight;

        return { image: this.image, x: tileX, y: tileY, width: this._tilewidth, height: this._tileheight };
    }

    constructor(props: TilesetProps) {
        this.tileset_key = props.tileset_key;
        this.scene = props.scene;
        this._firstgid = props.tileset_ref.getNum("firstgid");
        this.source = props.tileset_ref.getString("source");
    }

    preload(): any { }

    setup(): void {
        this.tileset = this.scene?.get_asset(this.tileset_key!);
        this.name = this.tileset!.getString("name");
        this._tilewidth = this.tileset!.getNum("tilewidth");
        this._tileheight = this.tileset!.getNum("tileheight");
        this.tilecount = this.tileset!.getNum("tilecount");
        this.columns = this.tileset!.getNum("columns");
        const children = this.tileset.getChildren();
        if (children.length != 1) {
            throw new Error("Expected tileset xml to only contain 1 image.");
        }
        for (let child of children) {
            const name = child.getName();
            if (name == "image") {
                const source = child.getString("source")
                this.image = this.scene.get_asset(`${this.tileset_key}/${source}`);
                this.image_width = child.getNum("width")
                this.image_height = child.getNum("height")
            }
        }
    }

    draw(): void { }
}
