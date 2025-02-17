import p5 from 'p5';
import SceneManager from './lib/SceneManager';
import MenuScene from './scenes/MenuScene';
import PlayScene from './scenes/PlayScene';
import LoadingScene from './scenes/LoadingScene';
import KDDevScene from './scenes/KDDevScene';

const sketch = (p: p5) => {

    const scene_manager = new SceneManager(p, [MenuScene, PlayScene, KDDevScene], LoadingScene);

    p.preload = () => {
        scene_manager.preload();  // Ensure other scene preloads are also executed
    };

    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);  // Use WebGL renderer
        p.ortho();  // Set orthographic projection
        p.smooth();
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

    p.mousePressed = (e: MouseEvent) => {
        scene_manager.mousePressed(e);
    };

    p.mouseReleased = (e: MouseEvent) => {
        scene_manager.mouseReleased(e);
    };

    p.draw = () => {

        // Draw the current scene
        scene_manager.draw();
    };
};

new p5(sketch, document.getElementById('p5-canvas') as HTMLElement);
