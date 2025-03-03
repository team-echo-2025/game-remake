import { Image } from "p5";
import Scene from "../Scene";


type TileProps = Readonly<{
    x: number;
    y: number;
    image: Image;
    scene: Scene;
    flipped_x?: boolean;
    flipped_y?: boolean;
    rotated?: boolean;
}>

export default class Tile {
    flipped_x: boolean;
    flipped_y: boolean;
    rotated: boolean;
    x: number;
    y: number;
    image: Image;
    scene: Scene;

    constructor(props: TileProps) {
        this.x = props.x;
        this.y = props.y;
        this.image = props.image;
        this.scene = props.scene;
        this.flipped_x = props.flipped_x ?? false;
        this.flipped_y = props.flipped_y ?? false;
        this.rotated = props.rotated ?? false;
    }
}
