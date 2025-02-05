import Button, { ButtonProps } from "./Button";

export default class ImageButton extends Button {
    constructor(props: ButtonProps) {
        super({ ...props });
    }

    async preload(): Promise<any> {
    }

    setup(): void {
    }

    draw(): void {
    }
}
