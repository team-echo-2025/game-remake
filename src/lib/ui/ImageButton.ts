import p5 from "p5";
import ButtonTest, { ButtonTestProps } from "./ButtonTest";
export type ImageButtonProps = ButtonTestProps & Readonly < {
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
        this.asset = this.scene.get_asset(this.imageKey); //returns asset
    }

    postDraw(): void {
        this.scene.p5.image(this.asset, this.x - this.asset.width / 2, this.y - this.asset.height / 2);
    }
}
