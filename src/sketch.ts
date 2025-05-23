import p5 from 'p5';
import SceneManager from './lib/SceneManager';
import PlayScene from './scenes/PlayScene';
import LoadingScene from './scenes/LoadingScene';
import KDDevScene from './scenes/KDDevScene';
import PhysicsTestScene from "./scenes/PhysicsTestScene";
import Dungeon1 from './scenes/PlayScene2';
import Dungeon2 from './scenes/PlayScene3';
import iceMaze from "./scenes/IceMaze";
import PhysicsTestScene2 from './scenes/PhysicsTestScene2';
import PlayScene4 from './scenes/PlayScene4';
import MenuScene from './scenes/MenuScene';
import LoserScene from './scenes/LoserScene';
import NonLoser from './scenes/NonLoserScene';
import BoatToFloat from './scenes/BoatToFloat/BoatToFloat';

let scene_manager: SceneManager;
const sketch = (p: p5) => {
    p.preload = () => {
        scene_manager = new SceneManager(p, [MenuScene, PlayScene, KDDevScene, PhysicsTestScene, Dungeon1, Dungeon2, iceMaze, BoatToFloat, PhysicsTestScene2, PlayScene4, LoserScene, NonLoser], LoadingScene,);
        scene_manager.preload();
    };

    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
        p.ortho();
        p.noSmooth();
        scene_manager.setup();
    };

    p.keyPressed = (e: KeyboardEvent) => {
        scene_manager?.keyPressed(e);
    };

    p.keyReleased = (e: KeyboardEvent) => {
        scene_manager?.keyReleased(e);
    };

    p.mouseClicked = (e: MouseEvent) => {
        scene_manager?.mouseClicked(e);
    };

    p.mousePressed = (e: MouseEvent) => {
        scene_manager?.mousePressed(e);
    };

    p.mouseReleased = (e: MouseEvent) => {
        scene_manager?.mouseReleased(e);
    };

    p.draw = () => {
        p.clear();
        scene_manager?.draw();
    };
};

new p5(sketch, document.getElementById('p5-canvas') as HTMLElement);
