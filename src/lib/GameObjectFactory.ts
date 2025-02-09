import Scene from "./Scene";
import ButtonTest, { ButtonTestProps } from "./ui/ButtonTest";

export default class GameObjectFactory {
    private scene: Scene;
    constructor(scene: Scene) {
        this.scene = scene;
    }

    button = (props: ButtonTestProps): ButtonTest => {
        const _button = new ButtonTest(props);
        _button.scene = this.scene;
        this.scene.add(_button);
        _button.setup();
        return _button;
    }
}
