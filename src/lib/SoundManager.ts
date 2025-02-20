import GameObject from "./GameObject";
import Sound from "./Sound";
import Scene from "./Scene";

export type SoundManagerProps =  Readonly<{
    group: string
    sounds: Sound[]
}>;

export default class SoundManager implements GameObject{
    private group!: string;
    private _sounds: Sound[] = [];
    private _scene!: Scene;
    private localState: Record<string, string>={
        volume: localStorage.getItem(this.group) || "1.0"
    };

    set scene(s: Scene) {
        this._scene = s;
    }
    
    get scene() {
        return this._scene;
    }

    set sounds(s: Sound[]) {
        this._sounds = s;
    }
    
    get sounds() {
        return this._sounds;
    }
    constructor(props: SoundManagerProps){
        this.group = props.group
        //this.sounds = props.sounds
    }
    setupVolume(){
        var str = localStorage.getItem(this.group)??"1.0"//+(localStorage.getItem(this.group)??"1.0");
        for(const sound of this.sounds){
            sound.updateVolume(+(str))
        }
    }
    updateVolume(volume:string){
        console.log("SoundManger::updateVolume()");
        var volume = localStorage.setItem(this.group, volume+"")??"1.0";
        for(const sound of this.sounds){
            sound.updateVolume(+(volume))
        }
    }
    // add(new_sound: Sound){
    //     this.sounds.push(new_sound);
    // }
    setup(): void {
        this.setupVolume();
    }
    draw(): void {
        // if(this.volume != this.localState.volume){//easy cast string to number
        //     console.log("updating volume from draw");
        //     this.updateVolume();
        // }
    }
    async preload(): Promise<any> {
        
        // const to_load = []
        // for (const obj of this.sounds) {
        //     to_load.push(obj.preload());
        // }
        // if(to_load.length)  await Promise.all(to_load);
    }
    onDestroy(): void {
        for(const sound of this.sounds){
            sound.onDestroy
        }
    }

    // below functions all call the function of the same name on each stored sound
    mute(): void{
        //this.updateVolume();
        for(const sound_ of this.sounds){
            sound_.mute();
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