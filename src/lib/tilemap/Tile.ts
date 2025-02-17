import { Image } from "p5";
import Scene from "../Scene";


type TileProps = Readonly<{
    x: number;
    y: number;
    image: Image;
    scene: Scene;
}>

export default class Tile {
    x: number;
    y: number;
    image: Image;
    scene: Scene;

    constructor(props: TileProps) {
        this.x = props.x;
        this.y = props.y;
        this.image = props.image;
        this.scene = props.scene;
    }
}
