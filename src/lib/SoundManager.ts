import GameObject from "./GameObject";
import Sound from "./Sound";
import Scene from "./Scene";

export type SoundManagerProps =  Readonly<{
    group: string
    sounds: Sound[]
}>;

export default class SoundManager implements GameObject{
    private group: string;
    private sounds: Sound[] = [];
    private _scene!: Scene;

    set scene(s: Scene) {
        this._scene = s;
    }
    
    get scene() {
        return this._scene;
    }

    constructor(props: SoundManagerProps){
        this.group = props.group
        this.sounds = props.sounds
    }
    updateVolume(){
        var str = localStorage.getItem(this.group)||"1.0";
        var flt  = +(str) + 0.0;
        for(const sound of this.sounds){
            sound.updateVolume(flt)
        }
    }
    add(new_sound: Sound){
        this.sounds.push(new_sound);
    }
    setup(): void {
    }
    draw(): void {
    }
    async preload(): Promise<any>{
        const to_load = []
        for (const obj of this.sounds) {
            to_load.push(obj.preload());
        }
        if(to_load.length)  await Promise.all(to_load);
        return
    }
    onDestroy(): void {
        for(const sound of this.sounds){
            sound.onDestroy
        }
    }

    // below functions all call the function of the same name on each stored sound
    mute(): void{
        for(const sound of this.sounds){
            sound.mute();
        }
    }
    play(): void{
        for(const sound of this.sounds){
            sound.play();
        }
        
    }
    loop(): void{
        for(const sound of this.sounds){
            sound.loop();
        }
    }
    stop(): void{
        for(const sound of this.sounds){
            sound.stop()
        }
    }
}