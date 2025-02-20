import Page from "./Page";
import PageManager from "./PageManager";
import Scene from "./Scene";
import SoundManager, { SoundManagerProps } from "./SoundManager";
import Tilemap, { TilemapProps } from "./tilemap/Tilemap";
import ButtonTest, { ButtonTestProps } from "./ui/ButtonTest";
import DropdownMenu, { DropdownMenuProps } from "./ui/DropdownMenu";
import Slider, { SliderProps } from "./ui/Slider";

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
        console.log(this.scene)
        _tilemap.scene = this.scene;
        this.scene.add(_tilemap);
        _tilemap.setup();
        return _tilemap;
    }

    slider = (props: SliderProps): Slider => {
        const _slider = new Slider(props);
        console.log("slider factory call");
        _slider.scene = this.scene;
        this.scene.add(_slider);
        _slider.setup();
        return _slider;
    }
    soundmanager = (props: SoundManagerProps): SoundManager =>{
        const _soundmanager = new SoundManager(props);
        console.log("soundmanager factory call");
        _soundmanager.scene = this.scene;
        _soundmanager.sounds = props.sounds; 
        this.scene.add(_soundmanager);
        _soundmanager.setup();
        return _soundmanager;
    }
}
