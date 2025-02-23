import { Image } from "p5";
import Sprite from "./Sprite";
import { Vector2D } from "./types/Physics";

export default class Spritesheet extends Sprite {
    private _frame: Vector2D = { x: 0, y: 0 };
    private _frame_width: number = 0;
    private _frame_height: number = 0;
    private _row_count: number = 0;
    private _col_count: number = 0;
    private _frame_asset!: Image;
    private _duration: number;
    private _start: number = 0;
    private _start_row: number = 0;
    private _start_col: number = 0;
    private _end_col: number = 1;
    private _playing: boolean = false;
    private _once: boolean = false;
    private _stay: boolean = false;

    get height() {
        return this._frame_height;
    }

    get width() {
        return this._frame_width;
    }


    set start_col(_start_col: number) {
        this._start_col = _start_col;
        this.update_frame();
    }

    set end_col(_end_col: number) {
        this._end_col = _end_col;
        this.update_frame();
    }

    set start_row(_start_row: number) {
        this._start_row = _start_row;
        this.update_frame();
    }

    constructor(asset_key: string, col_count: number, row_count: number, duration?: number) {
        super(asset_key);
        this._row_count = row_count;
        this._col_count = col_count;
        this._duration = duration ?? 1000;
        this._frame = { x: this._start_col, y: this._start_row }
    }

    setup(): void {
        super.setup();
        this._frame_width = this.asset.width / this._col_count;
        this._frame_height = this.asset.height / this._row_count;
        this.update_frame();
    }

    set_frame(vec: Vector2D) {
        this._frame = vec;
        this.update_frame();
    }

    update_frame(): void {
        this._frame_asset = this.asset.get(this._frame.x * this._frame_width, this._frame.y * this._frame_height, this._frame_width, this._frame_height);
    }

    play(): void {
        this._playing = true;
        this._once = false;
    }

    stop(): void {
        this._playing = false;
    }

    once(stay: boolean = false): void {
        this._playing = false;
        this._once = true;
        this._stay = stay;
    }

    draw(): void {
        if (this._once && this.scene.p5.millis() - this._start > this._duration / this._end_col) {
            this._start = this.scene.p5.millis();
            this._frame.x = (this._frame.x + 1);
            this._frame.x += 1;
            if (this._frame.x >= this._end_col) {
                this._once = false;
                if (!this._stay) {
                    this._frame.x = this._start_col;
                }
            }
            this.update_frame();
            console.log(this._frame_asset)
        }
        if (this._playing && this.scene.p5.millis() - this._start > this._duration / this._end_col) {
            this._start = this.scene.p5.millis();
            this._frame.x = (this._frame.x + 1) % (this._end_col + 1) + this._start_col; // round-robin
            this.update_frame();
        }
        this.scene.p5.image(this._frame_asset, this.x - this._frame_asset.width / 2, this.y - this._frame_asset.height / 2);
    }
}
