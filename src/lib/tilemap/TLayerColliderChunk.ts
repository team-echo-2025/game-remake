import p5, { Framebuffer, Graphics, XML } from "p5";
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
        this.buffer?.clear();
    }

    preload(): void {
        for (const layer of this.layers) {
            layer.preload();
        }
        for (const row of this.tiles) {
            for (const tile of row) {
                if (!tile) continue;
                const obj = new PhysicsObject({
                    width: tile.image.width,
                    height: tile.image.height,
                    mass: Infinity
                });
                let x = tile.x - this.tilemap.minx;
                x -= this.tilemap.width / 2;
                let y = tile.y - this.tilemap.miny;
                y -= this.tilemap.height / 2;
                obj.body.x = x + tile.image.width / 2;
                obj.body.y = y + tile.image.height / 2;
                this.scene.physics.addObject(obj)
                this.bodies.push(obj);
            }
        }
    }

    load(buffer: p5) {
        if (this.bodies.length != 0) {
            this.loaded = true;
            for (const layer of this.layers) {
                layer.load(buffer);
            }
            return
        }
        for (const layer of this.layers) {
            layer.load(buffer);
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
