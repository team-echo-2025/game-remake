import { Howl } from 'howler';
import GameObject from './GameObject';


export default class Sound implements GameObject{
    private path_name: string;
    public sound!: Howl;
    public muted: boolean;
    
    constructor(path_name: string) {
        this.path_name = path_name;
        const muted = localStorage.getItem("muted");
        if (muted && muted==="true") this.muted = true;
        else this.muted = false;
    }
    async preload(): Promise<any> {
        await new Promise((res) => {
            this.sound = new Howl({
                src: [this.path_name],
                onload: () => { res(true)}
            });
        });
    }
    setup(): void {
    }
    draw(): void {
    }
    toggleMute(): boolean{
        return this.muted = !this.muted;
    }
    onDestroy(): void {
        this.sound.stop();
        this.sound.unload();
    }
    updateVolume(flt: number){//volume should be between 0.0 and 1.0
        this.sound.volume(flt);
    }
    // functions to be called in scene \/
    mute(): void{
        this.sound.mute(this.toggleMute());
    }
    play(): void{
        if(this.sound.playing()) return;
        this.sound.play();
    }
    loop(): void{
        this.sound.loop();
    }
    stop(): void{
        this.sound.stop();
    }
}
