import p5 from "p5";
import { Howl } from 'howler';
import GameObject from './GameObject';
let sound: Howl;

// Konnor Duncan
// To use this create a new MusicManager object using the

export default class MusicManager implements GameObject {
    path_name: string; // path to sound file
    event_name: string;//string used in event listener

    constructor(path_name: string, event_name: string) {
        this.path_name = path_name;
        this.event_name = event_name;
    }

    async preload(): Promise<any> {
        sound = new Howl({
            src: [this.path_name]
        });
    }


    setup(): void {
        sound.play();
        document.addEventListener(this.event_name, (e: any) => {
            console.log(e.detail)
            if (e.detail.mute) {
                sound.pause();
            } else {
                sound.play();
            }
        });
    }

    keyPressed(): void {
    }
    keyReleased(): void {
    }

    draw(): void {
    }
}
