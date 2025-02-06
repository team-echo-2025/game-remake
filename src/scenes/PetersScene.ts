import Scene from "../lib/Scene"

export default class PetersScene extends Scene {
    constructor() {
        super("Test these Scenes");
    }
    setup(): void {
        this.start("Test these Scenes");
    }
    draw(): void {
        this.p5.square(20, 20 , 20, 20);
    }

}