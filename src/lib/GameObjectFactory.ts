import Page from "./Page";
import PageManager from "./PageManager";
import Scene from "./Scene";
import Sprite from "./Sprite";
import Spritesheet from "./Spritesheet";
import Tilemap, { TilemapProps } from "./tilemap/Tilemap";
import ButtonTest, { ButtonTestProps } from "./ui/ButtonTest";
import DropdownMenu, { DropdownMenuProps } from "./ui/DropdownMenu";

export default class GameObjectFactory {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    sprite = (key: string) => {
        const _sprite = new Sprite(key);
        _sprite.scene = this.scene;
        _sprite.setup();
        this.scene.add(_sprite);
        return _sprite;
    }

    spritesheet = (asset_key: string, col_count: number, row_count: number, duration?: number) => {
        const _sprite = new Spritesheet(asset_key, col_count, row_count, duration);
        _sprite.scene = this.scene;
        _sprite.setup();
        this.scene.add(_sprite);
        return _sprite;
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
        this.scene.add(manager);
        manager.setup();
        return manager;
    }

    dropdown_menu = (props: DropdownMenuProps): DropdownMenu => {
        const _dropdown = new DropdownMenu(props);
        _dropdown.scene = this.scene;
        this.scene.add(_dropdown);
        _dropdown.setup();
        return _dropdown;
    }

    tilemap = (props: TilemapProps): Tilemap => {
        const _tilemap = new Tilemap(props);
        _tilemap.scene = this.scene;
        this.scene.add(_tilemap);
        _tilemap.setup();
        return _tilemap;
    }
}
