import Page from "./Page";
import PageManager from "./PageManager";
import Scene from "./Scene";
import Tilemap, { TilemapProps } from "./tilemap/Tilemap";
import ButtonTest, { ButtonTestProps } from "./ui/ButtonTest";
import DropdownMenu, { DropdownMenuProps } from "./ui/DropdownMenu";

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

    page_manager = (pages: Page[]): PageManager => {
        const manager = new PageManager(pages, this.scene);
        this.scene.add(manager)
        manager.setup();
        return manager;
    }

    dropdown_menu = (props: DropdownMenuProps): DropdownMenu => {
        const _button = new DropdownMenu(props);
        _button.scene = this.scene;
        this.scene.add(_button);
        _button.setup();
        return _button;
    }

    tilemap = (props: TilemapProps): Tilemap => {
        const _tilemap = new Tilemap(props);
        _tilemap.scene = this.scene;
        this.scene.add(_tilemap);
        _tilemap.setup();
        return _tilemap;
    }
}
