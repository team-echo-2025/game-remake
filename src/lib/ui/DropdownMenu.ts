import ButtonTest, { ButtonTestProps } from "./ButtonTest";

export type DropdownMenuProps = ButtonTestProps & Readonly<{
    buttons: ButtonTestProps[];
}>;
export default class DropdownMenu extends ButtonTest {
    private buttons: ButtonTest[] = [];
    private button_props: ButtonTestProps[];
    public menuOpen: boolean = false;

    set x(x: number) {
        this._x = x;
        this.positionChildren();
    }
    set y(y: number) {
        this._y = y;
        this.positionChildren();
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }

    constructor(props: DropdownMenuProps) {
        super(props);
        this._callback = this.toggleMenu;
        this.menuOpen = false;
        this.button_props = props.buttons;
        this._x = 0;
        this._y = 0;
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
            this.scene.remove(button);
        }
        this.menuOpen = false;
        super.onDestroy();
    }
    setup(): void {
        super.setup();
        this.buttons = [];
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
        this.positionChildren();
    }
    toggleMenu(): void {
        this.menuOpen = !this.menuOpen;
        for (let button of this.buttons) {
            button.hidden = !this.menuOpen;
        }
    }
    disableMenu(): void{
        this.menuOpen = false;
        for (let button of this.buttons) {
            button.hidden = true;
        }
    }
    mouseClicked(e: any): void {
        if (this.hidden) return;
        const x = this._scene.p5.mouseX + this.scene.camera.x - this._scene.p5.width / 2;
        const y = this._scene.p5.mouseY + this.scene.camera.y - this._scene.p5.height / 2;
        const min_x = this._x - this._width / 2;
        const max_x = this._x + this._width / 2;
        const min_y = this._y - this._height / 2;
        const max_y = this._y + this._height / 2;
        if (x > min_x && x < max_x && y > min_y && y < max_y) {
            this._callback?.(e);
        }
        else{
            for(let button of this.buttons){
                button.mouseClicked(e);
            }
            this.disableMenu();
        }
    }
    protected _draw(): void {
        this._scene.p5.push();
        const min = .9
        const current = this.clamp(this.lerp(1, min, this.t), min, 1);
        this._scene.p5.rectMode(this._scene.p5.CENTER);
        this._scene.p5.textAlign(this._scene.p5.CENTER, this._scene.p5.CENTER);
        this._scene.p5.textFont(this.font);
        this._scene.p5.textSize(this.font_size);
        this._scene.p5.fill(255);
        this.scene.p5.translate(this.x, this.y);
        if(this.mouseDown)
            this.scene.p5.scale(current);
        this._scene.p5.rect(0, 0, this._width, this._height, 10);
        this._scene.p5.fill(0);
        this._scene.p5.text(this._label, 0, 0 - this.font_size / 6);
        if(this.mouseDown)
        {
            this.t+=2;
        }
        this._scene.p5.pop();
    }
    postDraw(): void {
        this._draw();
    }
}

