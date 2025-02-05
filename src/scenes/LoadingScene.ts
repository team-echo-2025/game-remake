import Scene from "../lib/Scene";
import Button from "../lib/ui/Button";

export default class LoadingScene extends Scene {
    loading_button: Button;
    constructor() {
        super('loading-scene');
        this.loading_button = new Button({
            label: "Loading...",
            scene: this,
        })
    }
    onStart(): void {
        this.add(this.loading_button);
    }
}
