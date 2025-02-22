import { XML } from "p5";
import Scene from "../Scene";
import Tilemap from "./Tilemap";
import TLayerChunk from "./TLayerChunk";
import PhysicsObject from "../physics/PhysicsObject";
import { Vector2D } from "../types/Physics";

export default class TLayerColliderChunk extends TLayerChunk {
    bodies: { physics_object: PhysicsObject, offset: Vector2D }[] = [];
    constructor(chunk: XML, tilemap: Tilemap, scene: Scene) {
        super(chunk, tilemap, scene)
    }
    prerender() {
        for (const row of this.tiles) {
            for (const tile of row) {
                if (!tile) continue;
                const x = tile.x * this.tilemap.tilewidth - this.width * this.tilemap.tilewidth / 2;
                const y = tile.y * this.tilemap.tileheight - this.height * this.tilemap.tileheight / 2;
                const obj = new PhysicsObject({
                    width: tile.image.width + 1,
                    height: tile.image.height + 1,
                    mass: Infinity
                });
                obj.body.x = x;
                obj.body.y = y;
                this.scene.physics.addObject(obj)
                this.bodies.push({ physics_object: obj, offset: { x: tile.x * this.tilemap.tilewidth + tile.image.width / 2, y: tile.y * this.tilemap.tileheight + tile.image.height / 2 } });
            }
        }
        console.log(this.bodies.length, " physic obvjects");
    }
}
