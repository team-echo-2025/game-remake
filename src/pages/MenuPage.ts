import Page from "../lib/Page";
import ButtonTest from "../lib/ui/ButtonTest";

export default class MenuPage extends Page {
    play!: ButtonTest;
    setting!: ButtonTest;
    carCuz!: ButtonTest;
    KDbutton!: ButtonTest;
    constructor() {
        super("menu-page")
    }
    preload(): any {
        this.scene.loadFont('jersey', 'assets/fonts/jersey.ttf')
    }
    setup(): void {
        this.play = this.scene.add_new.button({
            label: "Play!",
            font_key: 'jersey',
            callback: () => {
                this.scene.remove(this.play);
                this.set_page("play-page");
            }
        })
        this.setting = this.scene.add_new.button({
            label: "Settings",
            font_key: 'jersey',
            callback: () => {
                this.scene.remove(this.setting);
                this.set_page("setting-page");
            }
        })
        this.carCuz = this.scene.add_new.button({
            label: "Character Customization",
            font_key: 'jersey',
            callback: () => {
                this.scene.remove(this.carCuz);
                this.set_page("setting-page");
            }
        })
    }
    draw() {
        this.play.x = 2//this.p5.mouseX - this.p5.width / 2;
        this.play.y = 2//this.p5.mouseY - this.p5.height / 2;
        this.KDbutton.x = 300
        this.KDbutton.y = 300
        // this.play.x = this.p5.mouseX - this.p5.width / 2;
        // this.play.y = this.p5.mouseY - this.p5.height / 2;

        this.play.x = 0;
        this.play.y = -100;
        this.setting.x = 0;
        this.setting.y = 0;
        this.carCuz.x = 0;
        this.carCuz.y = 100;

    }
}
