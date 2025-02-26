import { Howl } from 'howler';
import GameObject from './GameObject';
import Scene from './Scene';


export default class Sound implements GameObject{
    private sound_key: string;
    private _scene!: Scene;
    public sound!: Howl;
    public muted: boolean;

    set scene(s: Scene) {
        this._scene = s;
    }
    
    get scene() {
        return this._scene;
    }
    
    constructor(sound_key: string) {
        this.sound_key = sound_key;
        const muted = localStorage.getItem("muted");
        if (muted && muted==="true") this.muted = true;
        else this.muted = false;
    }

    async preload(): Promise<any> {

    }

    setup(): void {
        console.log(this._scene,this.sound_key);
        if(this.scene.get_asset(this.sound_key)==undefined){
            console.error(`Howler "${this.sound_key}" not found.`)
        }
        this.sound = this.scene.get_asset(this.sound_key);
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
        this.sound.loop(true)
    }
    stop(): void{
        this.sound.stop();
    }
}
