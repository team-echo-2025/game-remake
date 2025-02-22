import { Framebuffer, Graphics, XML } from "p5";
import GameObject from "../GameObject";
import Scene from "../Scene";
import TLayerChunk from "./TLayerChunk";
import Tilemap from "./Tilemap";
import Tile from "./Tile";
import { Vector2D } from "../types/Physics";
import PhysicsObject from "../physics/PhysicsObject";
import Rectangle from "../physics/Rectangle";
import TLayerColliderChunk from "./TLayerColliderChunk";

type TLayerProps = Readonly<{
    layer: XML;
    scene: Scene;
    tilemap: Tilemap;
    z_index: number;
}>;

export default class TLayer implements GameObject {
    private layer: XML;
    private scene: Scene;
    private id!: string;
    private name!: string;
    private width!: number;
    private height!: number;
    private chunks: TLayerChunk[][];
    private offsetx!: number;
    private offsety!: number;
    private _x: number = 0;
    private _y: number = 0;
    private tilemap: Tilemap;
    private is_collider: boolean = false;
    zIndex: number = 0;
    minx: number = 0;
    maxx: number = 0;
    miny: number = 0;
    maxy: number = 0;
    buffer!: Framebuffer;
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
        this.zIndex = props.z_index;
    }

    setup_chunks(data: XML[]) {
        this.chunks.push([]);
        let row = 0;
        let y = 0;
        for (let child of data) {
            let chunk;
            if (this.is_collider) {
                chunk = new TLayerColliderChunk(child, this.tilemap, this.scene);
            } else {
                chunk = new TLayerChunk(child, this.tilemap, this.scene);
            }
            if (chunk.y != y && chunk.y % chunk.height == 0) {
                this.chunks.push([]);
                row++;
                y = chunk.y;
            }
            this.chunks[row].push(chunk);
        }

    }

    setup_properties(data: XML[]) {
        for (const child of data) {
            const name = child.getName();
            console.log(name)
            if (name == "property") {
                const property_name = child.getString('name');
                if (property_name == "collider") {
                    this.is_collider = true;
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
        this.minx = 0;
        this.maxx = 0;
        this.miny = 0;
        this.maxy = 0;
        console.log('setup layer')
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
        for (let row of this.chunks) {
            for (let chunk of row) {
                if (chunk.x < this.minx) {
                    this.minx = chunk.x;
                }
                if (chunk.x > this.maxx) {
                    this.maxx = chunk.x;
                }
                if (chunk.y < this.miny) {
                    this.miny = chunk.y;
                }
                if (chunk.y > this.maxy) {
                    this.maxy = chunk.y;
                }
                for (let y = 0; y < chunk.height; y++) {
                    chunk.tiles.push([]);
                    for (let x = 0; x < chunk.width; x++) {
                        const i = x + y * chunk.width;
                        const tilegid = chunk.data[i];
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
                            image: tile_data.image.get(tile_data.x, tile_data.y, tile_data.width, tile_data.height)
                        })
                        chunk.tiles[y].push(tile)
                    }
                }
                chunk.prerender();
            }
        }
        console.log(this.zIndex);
        this.width = this.maxx - this.minx;
        this.height = this.maxy - this.miny;
    }

    prerender(): void {
        //this.buffer = this.scene.p5.createFramebuffer({
        //    width: this.tilemap.width * this.tilemap.tilewidth,
        //    height: this.tilemap.height * this.tilemap.tileheight,
        //})!;
        this.tilemap.buffer.begin()
        this.scene.p5.push();
        this.scene.p5.rectMode('corner');
        let layer_width = this.tilemap.width;
        let layer_height = this.tilemap.height;
        for (const row of this.chunks) {
            for (const chunk of row) {
                let x = this.x + (chunk.x - this.tilemap.minx) * (this.tilemap.tilewidth);
                x -= this.tilemap.tilewidth * layer_width / 2;
                let y = this.y + (chunk.y - this.tilemap.miny) * (this.tilemap.tileheight);
                y -= this.tilemap.tileheight * layer_height / 2;
                if (this.is_collider && chunk instanceof TLayerColliderChunk) {
                    for (const obj of chunk.bodies) {
                        obj.physics_object.body.x = x + obj.offset.x;
                        obj.physics_object.body.y = y + obj.offset.y;
                    }
                } else {
                    this.scene.p5.image(chunk.buffer, x, y);
                }
            }
        }
        this.scene.p5.pop();
        this.tilemap.buffer.end()
    }
    draw(): void { }
}
