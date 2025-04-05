import Scene from "../Scene";


type TileProps = Readonly<{
    x: number;
    y: number;
    scene: Scene;
    flipped_x?: boolean;
    flipped_y?: boolean;
    data: any;
    rotated?: boolean;
}>

export default class Tile {
    flipped_x: boolean;
    flipped_y: boolean;
    rotated: boolean;
    x: number;
    y: number;
    scene: Scene;
    data: any;

    constructor(props: TileProps) {
        this.x = props.x;
        this.y = props.y;
        this.data = props.data;
        this.scene = props.scene;
        this.flipped_x = props.flipped_x ?? false;
        this.flipped_y = props.flipped_y ?? false;
        this.rotated = props.rotated ?? false;
    }
}
