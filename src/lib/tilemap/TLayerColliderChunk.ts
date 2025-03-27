import { Graphics, XML } from "p5";
import Scene from "../Scene";
import Tilemap from "./Tilemap";
import TLayerChunk from "./TLayerChunk";
import PhysicsObject from "../physics/PhysicsObject";

export default class TLayerColliderChunk extends TLayerChunk {
    bodies: PhysicsObject[] = [];

    constructor(chunk: XML, tilemap: Tilemap, scene: Scene) {
        super(chunk, tilemap, scene)
    }

    precalculate() {
        super.precalculate()
        //this.buffer?.clear();
    }

    preload(): void {
        for (const layer of this.layers) {
            layer.preload();
        }
        for (const row of this.tiles) {
            for (const tile of row) {
                if (!tile) continue;
                const obj = new PhysicsObject({
                    width: this.tilemap.tilewidth,
                    height: this.tilemap.tileheight,
                    mass: Infinity
                });
                let x = tile.x - this.tilemap.minx;
                x -= this.tilemap.width / 2;
                let y = tile.y - this.tilemap.miny;
                y -= this.tilemap.height / 2;
                obj.body.x = x + this.tilemap.tilewidth / 2;
                obj.body.y = y + this.tilemap.tileheight / 2;
                this.scene.physics.addObject(obj)
                this.bodies.push(obj);
            }
        }
    }

    load(buffer: Graphics, topmost: Graphics) {
        if (this.bodies.length != 0) {
            this.loaded = true;
            for (const layer of this.layers) {
                layer.load(buffer, topmost);
            }
            return
        }
        for (const layer of this.layers) {
            layer.load(buffer, topmost);
        }
        this.loaded = true;
    }

    unload(): void {
        for (const layer of this.layers) {
            layer.unload();
        }
        this.loaded = false;
    }
}
