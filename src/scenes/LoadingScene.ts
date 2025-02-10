import Scene from "../lib/Scene";
import ButtonTest from "../lib/ui/ButtonTest";

export default class LoadingScene extends Scene {
    loading_button!: ButtonTest;
    constructor() {
        super('loading-scene');
    }
    preload(): any {
        this.loadFont('jersey', 'assets/fonts/jersey.ttf')
    }
    setup(): void {
        this.loading_button = this.add_new.button({
            label: "Loading...",
            font_key: 'jersey',
        })
    }
}
