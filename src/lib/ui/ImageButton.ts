import Button, { ButtonTestProps } from "./ButtonTest";

export default class ImageButton extends Button {
    constructor(props: ButtonTestProps) {
        super({ ...props });
    }

    async preload(): Promise<any> {
    }

    setup(): void {
    }

    draw(): void {
    }
}
