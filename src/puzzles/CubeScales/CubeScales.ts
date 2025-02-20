import Puzzle, { PuzzleState } from "../../lib/Puzzle";
import Cube from "./Cube";

export default class CubeScales extends Puzzle {
    zIndex = 1000;
    cubes: Cube[] = [];
    cubeCount!: number;
    
    setup(): void {
        this.set_cube_count();
        this.generate_cubes();  // Adjusted based on difficulty
        
        this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
        this.scene.p5.rectMode(this.scene.p5.CENTER);
    }

    draw(): void {
        this.cubes[0].draw();
        for (let cube of this.cubes) {
            cube.draw();
        }
    }

    generate_cubes(): void {
        for (let i = 0; i < this.cubeCount; ++i)
            this.cubes[i] = new Cube(this.scene, -100, 0);
    }

    set_cube_count(): void {
        switch (Puzzle.difficulty) {
            case "easy":
                this.cubeCount = 3;
                break;
            case "normal":
                this.cubeCount = 4;
                break;
            case "hard":
                this.cubeCount = 5;
                break;
            default:
                this.cubeCount = 4;
        }
    }
}
