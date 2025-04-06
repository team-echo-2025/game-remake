import p5 from "p5";
import ButtonTest, { ButtonTestProps } from "./ButtonTest";
export type ImageButtonProps = ButtonTestProps & Readonly<{
    imageKey: string;
}>
export default class ImageButton extends ButtonTest {
    imageKey!: string;
    asset!: p5.Image;

    constructor(props: ImageButtonProps) {
        super({ ...props });
        this.imageKey = props.imageKey;
    }

    setup(): void {
        super.setup()
        this.asset = this.scene.get_asset(this.imageKey); //returns asset
        this._height = this.asset.height;
    }
    protected _draw() {
        this._scene.p5.push();
        const min = .9
        const current = this.clamp(this.lerp(1, min, this.t), min, 1);
        this._scene.p5.rectMode(this._scene.p5.CENTER);
        this._scene.p5.textAlign(this._scene.p5.CENTER, this._scene.p5.CENTER);
        this._scene.p5.textFont(this.font);
        this._scene.p5.textSize(this.font_size);
        this._scene.p5.fill(255);
        this.scene.p5.translate(this.x, this.y);
        if (this.mouseDown)
            this.scene.p5.scale(current);
        // this._scene.p5.rect(0, 0, this._width, this._height, 10);
        this.scene.p5.image(this.asset, 0 - this.width / 2 - 10, 0 - this.asset.height / 2, this.width + 20, this.asset.height);
        this._scene.p5.fill(255);
        this._scene.p5.text(this._label, 0, 0 - this.font_size / 6);
        if (this.mouseDown) {
            this.t += 2;
        }
        this._scene.p5.pop();
    }

    postDraw(): void {
        super.postDraw();
    }
}
