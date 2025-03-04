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
    private _end_row: number = 0;
    private _end_col: number = 1;

    private _playing: boolean = false;
    private _once: boolean = false;
    private _stay: boolean = false;
    private _frame_offset: number = 0;
    display_width?: number;
    display_height?: number;

    get height() {
        return this._frame_height;
    }

    get width() {
        return this._frame_width;
    }

    set start_col(_start_col: number) {
        this._start_col = _start_col;
        this._frame_offset = 0;
        this.update_frame();
    }

    set end_col(_end_col: number) {
        this._end_col = _end_col;
        this.update_frame();
    }

    set start_row(_start_row: number) {
        this._start_row = _start_row;
        this._frame_offset = 0;
        this.update_frame();
    }

    set end_row(_end_row: number) {
        this._end_row = _end_row;
        this.update_frame();
    }

    constructor(asset_key: string, col_count: number, row_count: number, duration?: number) {
        super(asset_key);
        this._row_count = row_count;
        this._col_count = col_count;
        this._duration = duration ? duration : 1000;
        this._frame = { x: this._start_col, y: this._start_row }
    }

    setup(): void {
        super.setup();
        this._frame_width = this.asset.width / this._col_count;
        this._frame_height = this.asset.height / this._row_count;
        this.update_frame();
    }

    set_frame(index: number) {
        this._frame_offset = index;
        this.update_frame();
    }

    update_frame(): void {
        this._frame_asset = this.asset.get(
            this._frame.x * this._frame_width,
            this._frame.y * this._frame_height,
            this._frame_width,
            this._frame_height
        );
    }

    play(): void {
        this._playing = true;
        this._once = false;
        this._start = this.scene.p5.millis();
    }

    stop(): void {
        this._playing = false;
        this._once = false;
        this._start = this.scene.p5.millis();
    }

    once(stay: boolean = false): void {
        this._playing = false;
        this._once = true;
        this._stay = stay;
        this._frame_offset = 0;
    }

    draw(): void {
        const p5 = this.scene.p5;
        const startIndex = this._start_row * this._col_count + this._start_col;
        const endIndex = this._end_row * this._col_count + this._end_col;
        const totalFrames = endIndex - startIndex + 1;

        if (p5.millis() - this._start > this._duration / totalFrames) {
            this._start = p5.millis();
            if (this._once) {
                if (this._frame_offset < totalFrames - 1) {
                    this._frame_offset++;
                } else {
                    if (!this._stay) {
                        this._frame_offset = 0;
                    }
                    this._once = false;
                }
            } else if (this._playing) {
                this._frame_offset = (this._frame_offset + 1) % totalFrames;
            }

            const currentIndex = startIndex + this._frame_offset;
            this._frame.y = Math.floor(currentIndex / this._col_count);
            this._frame.x = currentIndex % this._col_count;
            this.update_frame();
        }
        p5.image(
            this._frame_asset,
            this.x - this._frame_asset.width / 2,
            this.y - this._frame_asset.height / 2,
            this.display_width ? this.display_width : this._frame_asset.width,
            this.display_height ? this.display_height : this._frame_asset.height
        );
    }
}
