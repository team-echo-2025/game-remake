import { RGB } from "p5";
import GameObject from "../../lib/GameObject";

export default class Ball implements GameObject {
    color: RGB;
    constructor(color: RGB) {
        this.color = color;
    }
    draw(): void { }
    preload(): any { }
    setup(): void { }
} 
