import { XML } from "p5";
import Scene from "../Scene";
import TLayerChunk from "./TLayerChunk";
import Tilemap from "./Tilemap";
import Tile from "./Tile";
import { Vector2D } from "../types/Physics";
import TLayerColliderChunk from "./TLayerColliderChunk";
const FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
const FLIPPED_VERTICALLY_FLAG = 0x40000000;
const ROTATED_HEXAGONAL_FLAG = 0x20000000;
type TLayerProps = Readonly<{
    layer: XML;
    scene: Scene;
    tilemap: Tilemap;
}>;

export default class TLayer {
    private layer: XML;
    private scene: Scene;
    private id!: string;
    private name!: string;
    private chunks: TLayerChunk[];
    private offsetx!: number;
    private offsety!: number;
    private _x: number = 0;
    private _y: number = 0;
    private tilemap: Tilemap;
    private is_collider: boolean = false;
    private top_layer: boolean = false;
    width!: number;
    height!: number;
    minx: number = 0;
    maxx: number = 0;
    miny: number = 0;
    maxy: number = 0;
    start_offset: Vector2D = { x: 0, y: 0 };


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
    }

    setup_chunks(data: XML[]) {
        this.chunks = [];

        for (let child of data) {
            let chunk = this.is_collider
                ? new TLayerColliderChunk(child, this.tilemap, this.scene)
                : new TLayerChunk(child, this.tilemap, this.scene, this.top_layer);

            this.chunks.push(chunk);
        }
    }

    setup_properties(data: XML[]) {
        for (const child of data) {
            const name = child.getName();
            if (name == "property") {
                const property_name = child.getString('name');
                if (property_name == "collider") {
                    this.is_collider = true;
                } else if (property_name == "topmost") {
                    this.top_layer = true;
                }

            }
        }
    }

    setup_layer(): void {
        this.id = this.layer.getString("id");
        this.name = this.layer.getString("name");
        this.offsetx = this.layer.getNum("offsetx");
        this.offsety = this.layer.getNum("offsety");
        const children = this.layer.getChildren();
        for (const child of children) {
            const name = child.getName();
            if (name == 'properties') {
                this.setup_properties(child.getChildren());
            }
        }
        for (const child of children) {
            const name = child.getName();
            if (name == 'data') {
                this.setup_chunks(child.getChildren())
            }
        }
        for (let chunk of this.chunks) {
            for (let y = 0; y < chunk.height; y++) {
                chunk.tiles.push([]);
                for (let x = 0; x < chunk.width; x++) {
                    const i = x + y * chunk.width;
                    const tilegid = chunk.data[i] & 0x1FFFFFFF;
                    let flipped_x = chunk.data[i] & FLIPPED_HORIZONTALLY_FLAG;
                    let flipped_y = chunk.data[i] & FLIPPED_VERTICALLY_FLAG;
                    const rotated = chunk.data[i] & ROTATED_HEXAGONAL_FLAG;

                    if (tilegid == 0) {
                        chunk.tiles[y].push(null);
                        continue;
                    };
                    let tileset;
                    for (let item of this.tilemap.tilesets) {
                        if (item.firstgid <= tilegid) {
                            tileset = item
                        }
                    }
                    const tile_data = tileset!.getTile(tilegid);
                    const tile = new Tile({
                        x: x,
                        y: y,
                        scene: this.scene,
                        data: tile_data,
                        flipped_y: flipped_y != 0,
                        flipped_x: flipped_x != 0,
                        rotated: rotated != 0,
                    })
                    chunk.tiles[y].push(tile)
                }
            }
        }

        for (const chunk of this.chunks) {
            chunk.precalculate();
            const found = this.tilemap.chunks.get(this.tilemap.key_for({ x: chunk.x, y: chunk.y }))
            if (found) {
                found.merge_chunk(chunk);
            } else {
                this.tilemap.chunks.set(this.tilemap.key_for({ x: chunk.x, y: chunk.y }), chunk);
            }
        }
        this.width = this.maxx - this.minx;
        this.height = this.maxy - this.miny;
    }
}
