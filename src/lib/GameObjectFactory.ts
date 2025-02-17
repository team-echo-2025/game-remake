import Page from "./Page";
import PageManager from "./PageManager";
import Scene from "./Scene";
import Tilemap, { TilemapProps } from "./tilemap/Tilemap";
import ButtonTest, { ButtonTestProps } from "./ui/ButtonTest";
import DropdownMenu, { DropdownMenuProps } from "./ui/DropdownMenu";
import PhysicsObject, { PhysicsObjectProps } from "./PhysicsObject";

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

    physics_object = (props: PhysicsObjectProps): PhysicsObject => {
        const _physicsObject = new PhysicsObject(props);
        _physicsObject.scene = this.scene;
        this.scene.add(_physicsObject);
        _physicsObject.setup();
        return _physicsObject;
    }
}
