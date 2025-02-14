import { XML } from "p5";

export default class TLayerChunk {
    data: number[];
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(chunk: XML) {
        this.data = chunk.getContent().split(',').map(item => parseInt(item));
        this.x = chunk.getNum("x")
        this.y = chunk.getNum("y")
        this.width = chunk.getNum("width")
        this.height = chunk.getNum("height")
    }
}
