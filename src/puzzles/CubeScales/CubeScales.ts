import Puzzle, { PuzzleState } from "../../lib/Puzzle";
import Cube, { CubeState } from "./Cube";
import Scales, { ScalesState } from "./Scales";
import ButtonTest from "../../lib/ui/ButtonTest";

export default class CubeScalesPuzzle extends Puzzle {
    cubes: Cube[] = [];
    scales!: Scales;
    draggingCube: Cube | null = null;
    resetButton!: ButtonTest;

    setup(): void {
        this.scales = new Scales(this.scene);
        this.cubes = [];

        let cubeCount = Puzzle.difficulty === "easy" ? 3 : Puzzle.difficulty === "normal" ? 4 : 5;
        this.generateSolvableCubes(cubeCount);

        this.resetButton = this.scene.add_new.button({
            label: "Reset Button",
            font_key: "jersey",
            callback: () => {
                this.resetCubes();
                this.resetButton.hidden = true;
            }
        });
        this.resetButton.hidden = true;
        this.resetButton.y = 200;
    }  

    draw(): void {
        this.resetButton.hidden = false;
        if (this.solved()) {
            this.displayWinMessage();
        } else {
            this.scene.p5.background(255); // Clear the screen each frame
            this.drawBody();
            this.scales.draw();
            
            // Draw all cubes except the one being dragged
            for (let cube of this.cubes) {
                if (cube != this.draggingCube && cube.state != CubeState.left && cube.state != CubeState.right) {
                    cube.draw();
                }
            }
        
            // Ensure the dragged cube is drawn **on top** while dragging
            if (this.draggingCube) {
                this.draggingCube.update();
            }
            
            if(this.checkSolution()) {
                this.displayWinMessage();
            }
        }
    }

    generateSolvableCubes(cubeCount: number): Cube[] {
        let weights: number[] = [];
        let totalWeight: number;
    
        do {
            totalWeight = Math.floor(this.scene.p5.random(6, 20)) * 2; // Ensures even number
        } while (!this.canBeBalanced(totalWeight, cubeCount));
    
        let remainingWeight = totalWeight;
    
        for (let i = 0; i < cubeCount - 1; i++) {
            let maxWeight = Math.min(remainingWeight - (cubeCount - i - 1), 10);
            let weight = Math.floor(this.scene.p5.random(1, maxWeight + 1));
            weights.push(weight);
            remainingWeight -= weight;
        }
        
        weights.push(remainingWeight);
        this.shuffle(weights);
    
        this.cubes = [];
        for (let i = 0; i < cubeCount; i++) {
            let cube = new Cube(this.scene, -100 + i * 60, -50, weights[i]);
            this.cubes.push(cube);
        }
    
        console.log("Generated Cubes:", this.cubes.map(cube => cube.weight), "Target Balance:", totalWeight / 2);
        return this.cubes;
    }

    canBeBalanced(totalWeight: number, cubeCount: number): boolean {
        let targetSum = totalWeight / 2;
        let weights = Array.from({ length: cubeCount }, () => Math.floor(this.scene.p5.random(1, 10)));
    
        return this.canPartition(weights, targetSum);
    }
    
    canPartition(weights: number[], targetSum: number): boolean {
        let n = weights.length;
        let dp = Array(n + 1).fill(false).map(() => Array(targetSum + 1).fill(false));
        
        for (let i = 0; i <= n; i++) dp[i][0] = true;
    
        for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= targetSum; j++) {
                if (weights[i - 1] <= j) {
                    dp[i][j] = dp[i - 1][j] || dp[i - 1][j - weights[i - 1]];
                } else {
                    dp[i][j] = dp[i - 1][j];
                }
            }
        }
        return dp[n][targetSum];
    }
    
    shuffle(array: number[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(this.scene.p5.random(0, i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    drawBody() {
        let rectWidth = this.scene.p5.width / 3;
        let rectHeight = this.scene.p5.height / 2;

        let rectX = 0;
        let rectY = 0;

        this.scene.p5.fill(0);
        this.scene.p5.rect(rectX, rectY, rectWidth, rectHeight);

        this.scene.p5.fill(255);
        this.scene.p5.textAlign(this.scene.p5.CENTER, this.scene.p5.CENTER);
        this.scene.p5.textSize(16);
        this.scene.p5.text("Balance the scales.\nDrag cubes to the scales to apply weight.\nDrag cubes out of the scales and back to\ntheir original position to remove them.", 0, -200);
    }

    mousePressed(): void {
        if (this.solved()) {
            this.scene.start(this.scene.name);
            return;
        }

        for (let cube of this.cubes) {
            if (this.isMouseOver(cube)) {
                this.draggingCube = cube;
                this.draggingCube.dragging = true;
                this.draggingCube.state = CubeState.dragged;
                break;
            }
        }
    }    
    
    mouseDragged(): void {
        if (this.draggingCube!.dragging) {
            this.draggingCube!.x = this.scene.p5.mouseX - this.scene.p5.width / 2;
            this.draggingCube!.y = this.scene.p5.mouseY - this.scene.p5.height / 2;
        }
        this.draw();
    }    
    
    mouseReleased(): void {
        if (this.draggingCube) {
            if (this.isOnLeftScale(this.draggingCube)) {
                this.draggingCube.x = -80;
                this.draggingCube.y = 50;
                this.draggingCube.state = CubeState.left;
            } else if (this.isOnRightScale(this.draggingCube)) {
                this.draggingCube.x = 80;
                this.draggingCube.y = 50;
                this.draggingCube.state = CubeState.right;
            } else {
                this.draggingCube.x = this.draggingCube.initialX;
                this.draggingCube.y = this.draggingCube.initialY;
                this.draggingCube.state = CubeState.unmoved;
            }
            this.draggingCube.dragging = false;
            this.scales.updateWeights(this.cubes);
            if (this.checkSolution()) this.state = PuzzleState.completed;
            this.draggingCube = null;
        }
    }
    

    isMouseOver(cube: Cube): boolean {
        let d = this.scene.p5.dist(cube.x, cube.y, this.scene.p5.mouseX - this.scene.p5.width / 2, this.scene.p5.mouseY - this.scene.p5.height / 2);
        return d < 20;
    }

    isOnLeftScale(cube: Cube): boolean {
        return this.scene.p5.mouseX < this.scene.p5.width / 2 - 50;
    }

    isOnRightScale(cube: Cube): boolean {
        return this.scene.p5.mouseX > this.scene.p5.width / 2 + 50;
    }

    resetCubes(): void {
        for (let cube of this.cubes) {
            cube.x = cube.initialX;
            cube.y = cube.initialY;
            cube.state = CubeState.unmoved;
        }
        this.scales.updateWeights(this.cubes);
    }

    checkSolution(): boolean {
        if (this.scales.state == ScalesState.balanced && this.scales.leftWeight != 0) {
            return true;
        } else {
            return false;
        }
    }

    keyPressed = (e: KeyboardEvent) => {
        if (e.key == "Escape") {
            this.resetButton.hidden = true;
        }
    };

    displayWinMessage(): void {
        this.resetButton.hidden = true;
        let p5 = this.scene.p5;
    
        p5.fill(0, 0, 0, 150);
        p5.rect(0, 0, p5.width, p5.height);
    
        let boxWidth = p5.width / 3;
        let boxHeight = p5.height / 6;
        p5.fill(255);
        p5.stroke(0);
        p5.rect(0, 0, boxWidth, boxHeight, 10);
    
        p5.fill(0);
        p5.noStroke();
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(32);
        p5.text("You Win!", 0, -boxHeight / 8);
        p5.textSize(16);
        p5.text("Click to continue.", 0, boxHeight / 4);
    }
}
