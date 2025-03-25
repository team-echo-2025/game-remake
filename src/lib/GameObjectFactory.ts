import Page from "./Page";
import PageManager from "./PageManager";
import Scene from "./Scene";
import SoundManager, { SoundManagerProps } from "./SoundManager";
import Sprite from "./Sprite";
import Spritesheet from "./Spritesheet";
import Tilemap, { TilemapProps } from "./tilemap/Tilemap";
import ButtonTest, { ButtonTestProps } from "./ui/ButtonTest";
import DropdownMenu, { DropdownMenuProps } from "./ui/DropdownMenu";
import Slider, { SliderProps } from "./ui/Slider";
import Sound from "./Sound";
import SplashText, { SplashTextProps } from "./ui/SplashText";

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

    slider = (props: SliderProps): Slider => {
        const _slider = new Slider(props);
        console.log("slider factory call");
        _slider.scene = this.scene;
        this.scene.add(_slider);
        _slider.setup();
        return _slider;
    }
    sound = (sound_key: string): Sound =>{
        const _sound = new Sound(sound_key);
        console.log("sound factory call");
        _sound.scene = this.scene;
        this.scene.add(_sound);
        _sound.setup();
        return _sound;
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

    splashtext = (props: SplashTextProps): SplashText=>{
        const _splashtext = new SplashText(props);
        console.log("splashtext factory call");
        _splashtext.scene = this.scene;
        _splashtext.setup();
        this.scene.add(_splashtext);
        return _splashtext;
    }   
}
