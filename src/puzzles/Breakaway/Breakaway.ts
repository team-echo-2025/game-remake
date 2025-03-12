import Puzzle, { PuzzleState } from "../../lib/Puzzle";
import Scene from "../../lib/Scene";
import { Vector, Color } from "p5";

export default class Breakaway extends Puzzle {
    puzzlePieces: any[] = [];
    selectedPieceIndex: number | null = null;
    dragOffset: Vector = new Vector(0, 0);
    gameResult: string = "";

    cols = Puzzle.difficulty === "easy" ? 3 : Puzzle.difficulty === "normal" ? 4 : 5;
    rows = Puzzle.difficulty === "easy" ? 3 : Puzzle.difficulty === "normal" ? 4 : 5;
    pieceThreshold = 20;
    rotationThreshold = 30;
    rotationStep = 90;
    rotationAnimStep = 5;
    trayXMin = -500;
    trayXMax = -100;
    trayYMin = 200;
    trayYMax = -100;
    boardWidth = 300;
    boardHeight = 300;
    boardX!: number;
    boardY!: number;

    constructor(scene: Scene) {
        super(scene);
    }

    setup(): void {
        this.boardX = 0;
        this.boardY = -100;
        this.createPuzzle1();
        this.scatterPieces();
    }

    createPuzzle1(): void {
        this.puzzlePieces = [];
        let pieceW = this.boardWidth / this.cols;
        let pieceH = this.boardHeight / this.rows;
        let perturbAmt = pieceW * 0.2;
    
        let intersections: Vector[][] = [];
    
        for (let i = 0; i <= this.cols; i++) {
            intersections[i] = [];
            for (let j = 0; j <= this.rows; j++) {
                let x = this.boardX + i * pieceW;
                let y = this.boardY + j * pieceH;
    
                x += this.scene.p5.random(-perturbAmt, perturbAmt);
                y += this.scene.p5.random(-perturbAmt, perturbAmt);
    
                intersections[i][j] = this.scene.p5.createVector(x, y);
            }
        }
    
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                let tl = intersections[i][j];
                let tr = intersections[i + 1][j];
                let br = intersections[i + 1][j + 1];
                let bl = intersections[i][j + 1];
    
                let color = this.scene.p5.color(
                    this.scene.p5.random(50, 255),
                    this.scene.p5.random(50, 255),
                    this.scene.p5.random(50, 255)
                );
    
                let piece = {
                    localVerts: [
                        { x: 0, y: 0 },
                        { x: tr.x - tl.x, y: tr.y - tl.y },
                        { x: br.x - tl.x, y: br.y - tl.y },
                        { x: bl.x - tl.x, y: bl.y - tl.y }
                    ],
                    idealPos: tl.copy(),
                    pos: tl.copy(),
                    color: color,
                    rot: 0,
                    targetRot: 0,
                    idealRot: 0,
                    dragging: false,
                    rotating: false
                };
    
                this.puzzlePieces.push(piece);
            }
        }
    }    

    scatterPieces(): void {
        for (let piece of this.puzzlePieces) {
            piece.pos = this.scene.p5.createVector(
                this.scene.p5.random(this.trayXMin, this.trayXMax),
                this.scene.p5.random(this.trayYMin, this.trayYMax)
            );
            piece.rot = Math.floor(this.scene.p5.random(0, 4)) * this.rotationStep;
            piece.targetRot = piece.rot;
        }
    }

    checkSolution(): boolean {
        let allCorrect = this.puzzlePieces.every(piece => {
            let d = this.scene.p5.dist(piece.pos.x, piece.pos.y, piece.idealPos.x, piece.idealPos.y);
            let r = this.angleDiff(piece.rot, piece.idealRot);
            return d < this.pieceThreshold && r < this.rotationThreshold;
        });

        return allCorrect ? true : false;
    }

    postDraw(): void {
        if (this.solved()) {
            this.displayWinMessage();
        } else {
            this.drawBody();
            this.drawDottedOutlines();

            for (let i = 0; i < this.puzzlePieces.length; i++) {
                let piece = this.puzzlePieces[i];

                let diff = (piece.targetRot - piece.rot + 360) % 360;
                if (diff > 180) {
                    let negDiff = 360 - diff;
                    piece.rot = negDiff < this.rotationAnimStep ? piece.targetRot : (piece.rot - this.rotationAnimStep + 360) % 360;
                } else {
                    piece.rot = diff < this.rotationAnimStep ? piece.targetRot : (piece.rot + this.rotationAnimStep) % 360;
                }

                if (piece.rot === piece.targetRot) piece.rotating = false;

                if (piece.dragging) {
                    piece.pos.x = this.scene.p5.mouseX - this.scene.p5.width / 2 - this.dragOffset.x;
                    piece.pos.y = this.scene.p5.mouseY - this.scene.p5.height / 2 - this.dragOffset.y;
                }
        
                this.drawPiece(piece, i === this.selectedPieceIndex);
            }

            this.scene.p5.fill(255);
            this.scene.p5.textAlign(this.scene.p5.CENTER, this.scene.p5.CENTER);
            this.scene.p5.textSize(50);
            this.scene.p5.text("Breakaway", 0, -250);
            this.scene.p5.textSize(16);
            this.scene.p5.text("Rotation:\nPress U (or u) to rotate clockwise\nPress D (or d) to rotate counterclockwise", 0, -175);

            if (this.checkSolution()) this.state = PuzzleState.completed;
        }
    }

    drawBody(): void {
        let rectWidth = this.scene.p5.width / 1.1;
        let rectHeight = this.scene.p5.height / 1.1;

        let rectX = 0;
        let rectY = 0;

        this.scene.p5.fill(0);
        this.scene.p5.rect(rectX, rectY, rectWidth, rectHeight);
    }    

    drawPiece(piece: any, highlight: boolean): void {
        this.scene.p5.push();
        this.scene.p5.translate(piece.pos.x, piece.pos.y);
        this.scene.p5.rotate(this.scene.p5.radians(piece.rot));

        if (highlight) {
            this.scene.p5.stroke(255, 0, 0);
            this.scene.p5.strokeWeight(3);
        } else {
            this.scene.p5.noStroke();
        }

        this.scene.p5.fill(piece.color);
        this.scene.p5.beginShape();
        for (let v of piece.localVerts) {
            this.scene.p5.vertex(v.x, v.y);
        }
        this.scene.p5.endShape(this.scene.p5.CLOSE);
        this.scene.p5.pop();
    }

    drawDottedOutlines(): void {
        for (let piece of this.puzzlePieces) {
            let d = this.scene.p5.dist(piece.pos.x, piece.pos.y, piece.idealPos.x, piece.idealPos.y);
            let angleErr = this.angleDiff(piece.rot, piece.idealRot);
            let outlineCol = (d < this.pieceThreshold && angleErr < this.rotationThreshold)
                ? this.scene.p5.color(0, 255, 0)
                : this.scene.p5.color(255, 0, 0);
            
            this.drawOutline(piece.localVerts, piece.idealPos.x, piece.idealPos.y, piece.idealRot, outlineCol);
        }
    }

    drawOutline(vertices: any[], offsetX: number, offsetY: number, outlineRot: number, col: Color): void {
        let p5 = this.scene.p5;
        p5.push();
        p5.translate(offsetX, offsetY);
        p5.rotate(p5.radians(outlineRot));
    
        p5.stroke(col);
        p5.strokeWeight(2);
        p5.noFill();
    
        let dashLength = 10;
        let gapLength = 5;
    
        for (let i = 0; i < vertices.length; i++) {
            let v1 = vertices[i];
            let v2 = vertices[(i + 1) % vertices.length];
    
            let dist = p5.dist(v1.x, v1.y, v2.x, v2.y);
            let numDashes = Math.floor(dist / (dashLength + gapLength));
    
            for (let j = 0; j < numDashes; j++) {
                let t1 = j / numDashes;
                let t2 = (j + 0.5) / numDashes;
    
                let x1 = p5.lerp(v1.x, v2.x, t1);
                let y1 = p5.lerp(v1.y, v2.y, t1);
                let x2 = p5.lerp(v1.x, v2.x, t2);
                let y2 = p5.lerp(v1.y, v2.y, t2);
    
                p5.line(x1, y1, x2, y2);
            }
        }
    
        p5.pop();
    }

    mousePressed(e: MouseEvent): void {
        let mousePos = this.scene.p5.createVector(
            this.scene.p5.mouseX - this.scene.p5.width / 2,
            this.scene.p5.mouseY - this.scene.p5.height / 2
        );
    
        for (let i = this.puzzlePieces.length - 1; i >= 0; i--) {
            let piece = this.puzzlePieces[i];
            let globalVerts = this.getGlobalVerts(piece);
    
            if (this.pointInPolygon(mousePos, globalVerts)) {
                console.log(`Selected piece ${i}`);
                this.selectedPieceIndex = i;
                piece.dragging = true;
                this.dragOffset = this.scene.p5.createVector(mousePos.x - piece.pos.x, mousePos.y - piece.pos.y);
                return;
            }
        }

        if (this.solved()) {
            this.scene.start(this.scene.name);
            return;
        }
    }    

    mouseDragged(): void {
        if (this.selectedPieceIndex !== null) {
            let piece = this.puzzlePieces[this.selectedPieceIndex];

            let mousePos = this.scene.p5.createVector(
                this.scene.p5.mouseX - this.scene.p5.width / 2,
                this.scene.p5.mouseY - this.scene.p5.height / 2
            );

            piece.pos.x = mousePos.x - this.dragOffset.x;
            piece.pos.y = mousePos.y - this.dragOffset.y;
        }
    }

    mouseReleased(): void {
        if (this.selectedPieceIndex !== null) {
            let piece = this.puzzlePieces[this.selectedPieceIndex];
            piece.dragging = false;
            this.selectedPieceIndex = null;
        }
    }    

    keyPressed(e: KeyboardEvent): void {
        if (this.selectedPieceIndex !== null) {
            let piece = this.puzzlePieces[this.selectedPieceIndex];
    
            if (piece.rotating) return;

            if (e.key === "u" || e.key === "U") {
                piece.targetRot = (piece.targetRot + this.rotationStep) % 360;
            } else if (e.key === "d" || e.key === "D") {
                piece.targetRot = (piece.targetRot - this.rotationStep + 360) % 360;
            }
            piece.rotating = true;
        }
    }

    angleDiff(a: number, b: number): number {
        let diff = Math.abs(a - b) % 360;
        return diff > 180 ? 360 - diff : diff;
    }

    getGlobalVerts(piece: any): Vector[] {
        let verts: Vector[] = [];
        let angle = this.scene.p5.radians(piece.rot);
        
        for (let v of piece.localVerts) {
            let rx = v.x * Math.cos(angle) - v.y * Math.sin(angle);
            let ry = v.x * Math.sin(angle) + v.y * Math.cos(angle);
            verts.push(this.scene.p5.createVector(rx + piece.pos.x, ry + piece.pos.y));
        }
    
        return verts;
    }

    pointInPolygon(pt: Vector, polygon: Vector[]): boolean {
        let inside = false;
    
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            let xi = polygon[i].x, yi = polygon[i].y;
            let xj = polygon[j].x, yj = polygon[j].y;
            
            let intersect = ((yi > pt.y) !== (yj > pt.y)) &&
                            (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi);
            
            if (intersect) inside = !inside;
        }
        
        return inside;
    }

    displayWinMessage(): void {
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

    setDifficulty(difficulty: string): void {
        Puzzle.difficulty = difficulty;
    
        this.cols = Puzzle.difficulty === "easy" ? 3 : Puzzle.difficulty === "normal" ? 4 : 5;
        this.rows = Puzzle.difficulty === "easy" ? 3 : Puzzle.difficulty === "normal" ? 4 : 5;
    
        this.puzzlePieces = [];
    
        this.selectedPieceIndex = null;
        this.gameResult = "";
    
        this.setup();
    }
}
