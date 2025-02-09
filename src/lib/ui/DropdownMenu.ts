import p5, { Font } from "p5";
import GameObject from "../GameObject";
import Scene from "../Scene";
import Button, {ButtonProps} from "./Button";

export type DropdownMenuProps = ButtonProps&Readonly<{
    buttons: ButtonProps[];
}>;
export default class DropdownMenu extends Button{
    private buttons: Button[] = [];
    private menuOpen: boolean = false;

    set x(x: number){
        this._x = x;
        console.log("this._x")
        this.positionChildren();
    }
    set y(y: number){
        this._y = y;
        console.log("this._y", this._y)
        this.positionChildren();
    }

    constructor(props: DropdownMenuProps){
        super(props);
        this._callback = this.toggleMenu;
        for(let i = 0; i<props.buttons.length; i++){
            const button = new Button(props.buttons[i])
            this.buttons.push(button);
            const oldCallback = button.callback;
            //this.callbacks.push(button.callback);
            const newCallback = (e: MouseEvent)=>{
                oldCallback(e);
                this.toggleMenu();
            };
            button.callback = newCallback
        }
    }

    positionChildren(): void{
        for(let i = 0; i<this.buttons.length; i++){
            const button = this.buttons[i];
            console.log(button.height);
            console.log(this._y);
            button.y = this._y + this.height +(i*button.height);//newButton._height 
            button.x = this._x - this.width/2 + button.width/2
        }
    }
    onDestroy(): void {
        for(const button of this.buttons){
            button.onDestroy();
        }
        super.onDestroy();
    }
    async preload(): Promise<any> {
        const to_load = [super.preload()]
        for (const button of this.buttons) {
            to_load.push(button.preload());
        }
        await Promise.all(to_load);
    }
    setup(): void {
        super.setup();
        for(const button of this.buttons){
            button.setup();
        }
    }
    draw(): void {
        super.draw();
        if(this.menuOpen)
            for (const button of this.buttons) {
                button.draw();
            }
    }
    toggleMenu(): void{
        this.menuOpen = !this.menuOpen;
    }
    mouseClicked(e: any): void {
        super.mouseClicked(e);
        for(const button of this.buttons){
            const clicked = button.mouseClicked(e);
        }
            
    }
}


/*
        Usage in scene
    
    
this.example_button = new Button({
    label: "Exit Dev Scene",
    scene: this,
    font_size: 50,
    callback: () => { this.start("menu-scene") }
})
this.MyDropDownMenu = new Button({
    label: "Exit Dev Scene",
    scene: this,
    font_size: 50,
    callback: () => { this.start("menu-scene") },
    buttons: [
        this.example_button, 
        
    ]
})

            

*/

