import ButtonTest, { ButtonTestProps } from "./ButtonTest";

export type DropdownMenuProps = ButtonTestProps & Readonly<{
    buttons: ButtonTestProps[];
}>;
export default class DropdownMenu extends ButtonTest {
    private buttons: ButtonTest[] = [];
    private button_props: ButtonTestProps[];
    private menuOpen: boolean = false;

    set x(x: number) {
        this._x = x;
        this.positionChildren();
    }
    set y(y: number) {
        this._y = y;
        this.positionChildren();
    }

    constructor(props: DropdownMenuProps) {
        super(props);
        this._callback = this.toggleMenu;
        this.menuOpen = false;
        this.button_props = props.buttons;
    }

    positionChildren(): void {
        for (let i = 0; i < this.buttons.length; i++) {
            const button = this.buttons[i];
            button.y = this._y + this.height + (i * button.height);//newButton._height 
            button.x = this._x - this.width / 2 + button.width / 2
        }
    }
    onDestroy(): void {
        for (const button of this.buttons) {
            button.onDestroy();
        }
        this.menuOpen = false;
        super.onDestroy();
    }
    setup(): void {
        super.setup();
        console.log("IN SETUP");
        for (let i = 0; i < this.button_props.length; i++) {
            const button = this.scene.add_new.button(this.button_props[i])
            button.hidden = true;
            this.buttons.push(button);
            const oldCallback = button.callback;
            const newCallback = (e: MouseEvent) => {
                this.toggleMenu()
                oldCallback(e);
            };
            button.callback = newCallback
        }
        this.positionChildren()
    }
    toggleMenu(): void {
        this.menuOpen = !this.menuOpen;
        for (let button of this.buttons) {
            button.hidden = !this.menuOpen;
        }
    }
}
