import p5 from 'p5';
import SceneManager from './lib/SceneManager';
import MenuScene from './scenes/MenuScene';
import PlayScene from './scenes/PlayScene';
import LoadingScene from './scenes/LoadingScene';

const sketch = (p: p5) => {
    const scene_manager = new SceneManager(p, [MenuScene, PlayScene], LoadingScene);
    p.preload = () => {
        scene_manager.preload();
    };

    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight, 'webgl');
        p.ortho();
        p.smooth()
        scene_manager.setup();
    };

    p.keyPressed = (e: KeyboardEvent) => {
        scene_manager.keyPressed(e);
    };

    p.keyReleased = (e: KeyboardEvent) => {
        scene_manager.keyReleased(e);
    };

    p.mouseClicked = (e: MouseEvent) => {
        scene_manager.mouseClicked(e);
    };

    p.draw = () => {
        p.background(255);
        scene_manager.draw();
    };
};

new p5(sketch, document.getElementById('p5-canvas') as HTMLElement);
