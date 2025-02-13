import GameObject from "./GameObject";
import Scene from "./Scene";

export default class Tilemap implements GameObject {
    private scene: Scene;
    private map!: Object;
    private tileset!: Object;
    constructor(scene: Scene) {
        this.scene = scene;
    }
    async preload(): Promise<any> {
        this.scene.loadJSON("tilemap", 'assets/tilemaps/map.tmj')
        this.scene.loadJSON("tileset", "assets/tilemaps/outside.tsj")
    }
    setup(): void {
        this.map = this.scene.get_asset("tilemap");
        this.tileset = this.scene.get_asset("tileset");
        console.log(this.map, "map");
        console.log(this.tileset, "tileset");
    }
    draw(): void {
    }
}
