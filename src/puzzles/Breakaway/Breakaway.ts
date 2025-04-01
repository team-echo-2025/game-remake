import PhysicsObject from "../../lib/physics/PhysicsObject";
import RigidBody from "../../lib/physics/RigidBody";
import Player from "../../lib/Player";
import Puzzle, { PuzzleState } from "../../lib/Puzzle";
import Scene from "../../lib/Scene";
import { Vector } from "p5";
import Sprite from "../../lib/Sprite";

// Added Sound and SoundManager imports for breakaway sound effects
import Sound from "../../lib/Sound";
import SoundManager, { SoundManagerProps } from "../../lib/SoundManager";

export default class Breakaway extends Puzzle {
    puzzlePieces: any[] = [];
    selectedPieceIndex: number | null = null;
    dragOffset: Vector = new Vector(0, 0);
    gameResult: string = "";

    cols = Puzzle.difficulty === "easy" ? 3 : Puzzle.difficulty === "normal" ? 4 : 5;
    rows = this.cols;
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
    boardX = 0;
    boardY = -100;

    //Game references
    physics_object!: PhysicsObject;
    highlight: boolean = false;
    asset_key: string;
    asset!: Sprite;
    player: Player;
    private collider_timeout: any;
    x: number = 0;
    y: number = 0;

    // Added properties for sound effects
    private click_sfx!: Sound;
    private rotate_sfx!: Sound;
    private snap_sfx!: Sound;

    constructor(scene: Scene, puzzle_asset_key: string, player: Player) {
        super(scene);
        this.asset_key = puzzle_asset_key;
        this.hidden = true;
        this.player = player;
    }

    force_solve() {
        this.state = PuzzleState.completed;
        this.hidden = true;
        this.player.disabled = false;
        this.asset.change_asset('breakaway-success');
        this.scene.physics.remove(this.physics_object);
    }

    force_fail() {
        this.state = PuzzleState.failed;
        this.hidden = true;
        this.player.disabled = false;
        this.asset.change_asset('broken-puzzle');
        this.scene.physics.remove(this.physics_object);
    }
    
    preload(): any {
        // Preload sound effects using the scene's loadSound method
        this.scene.loadSound("click", "assets/TInterfaceSounds/click-234708.mp3");
        this.scene.loadSound("rotate", "assets/TInterfaceSounds/mouse-click-290204.mp3");
        this.scene.loadSound("snap", "assets/TInterfaceSounds/snap-264680.mp3");
    }
    
    setup(): void {
        //putting into game itself
        this.physics_object = new PhysicsObject({
            width: 100,
            height: 100,
            mass: Infinity
        });
        this.physics_object.overlaps = true;
        this.physics_object.body.x = this.x;
        this.physics_object.body.y = this.y;
        this.scene.physics.addObject(this.physics_object);
        this.physics_object.onCollide = (other: RigidBody) => {
            if (other == this.player.body) {
                clearTimeout(this.collider_timeout);
                if (!this.highlight) {
                    this.highlight = true;
                    this.asset.change_asset("breakaway-highlight");
                }
                this.collider_timeout = setTimeout(() => {
                    this.highlight = false;
                    this.asset.change_asset("breakaway");
                }, 100);
            }
        }
        this.asset = this.scene.add_new.sprite(this.asset_key);
        this.asset.x = this.x;
        this.asset.y = this.y;
        this.asset.width = 32;
        this.asset.height = 48;
        //puzzle setup
        this.createPuzzle();
        this.scatterPieces();

        // Initialize sound effects using the scene's add_new method
        this.click_sfx = this.scene.add_new.sound("click");
        this.rotate_sfx = this.scene.add_new.sound("rotate");
        this.snap_sfx = this.scene.add_new.sound("snap");
    }

    createPuzzle(): void {
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
    
    draw() {
        if (this.state == PuzzleState.completed || this.state == PuzzleState.failed) return;
    }
    
    postDraw(): void {
        if (this.state == PuzzleState.completed || this.state == PuzzleState.failed) return;
        if (this.hidden) return;
        this.drawBody();
        this.drawOutlines();

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

    drawOutlines(): void {
        for (let piece of this.puzzlePieces) {
            let d = this.scene.p5.dist(piece.pos.x, piece.pos.y, piece.idealPos.x, piece.idealPos.y);
            let angleErr = this.angleDiff(piece.rot, piece.idealRot);
            let outlineCol = (d < this.pieceThreshold && angleErr < this.rotationThreshold)
                ? this.scene.p5.color(0, 255, 0)
                : this.scene.p5.color(255, 0, 0);

            this.scene.p5.push();
            this.scene.p5.translate(piece.idealPos.x, piece.idealPos.y);
            this.scene.p5.rotate(this.scene.p5.radians(piece.idealRot));

            this.scene.p5.stroke(outlineCol);
            this.scene.p5.strokeWeight(2);
            this.scene.p5.noFill();

            this.scene.p5.beginShape();
            for (let v of piece.localVerts) {
                this.scene.p5.vertex(v.x, v.y);
            }
            this.scene.p5.endShape(this.scene.p5.CLOSE);

            this.scene.p5.pop();
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

    mousePressed(): void {
        let mousePos = this.scene.p5.createVector(
            this.scene.p5.mouseX - this.scene.p5.width / 2,
            this.scene.p5.mouseY - this.scene.p5.height / 2
        );

        for (let i = this.puzzlePieces.length - 1; i >= 0; i--) {
            let piece = this.puzzlePieces[i];
            let globalVerts = this.getGlobalVerts(piece);

            if (this.pointInPolygon(mousePos, globalVerts)) {
                this.selectedPieceIndex = i;
                piece.dragging = true;
                this.dragOffset = this.scene.p5.createVector(mousePos.x - piece.pos.x, mousePos.y - piece.pos.y);

                // Play click sound for selecting piece
                if (this.click_sfx && typeof this.click_sfx.play === "function") {
                    this.click_sfx.play();
                }
                return;
            }
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

            // Play snap sound if piece is placed correctly
            if (this.checkSolution() && this.snap_sfx && typeof this.snap_sfx.play === "function") {
                this.snap_sfx.play();
            }
        }
    }

    keyPressed(e: KeyboardEvent): void {
        if (this.selectedPieceIndex !== null) {
            let piece = this.puzzlePieces[this.selectedPieceIndex];

            if (piece.rotating) return;

            if (e.key === "u" || e.key === "U") {
                piece.targetRot = (piece.targetRot + this.rotationStep) % 360;

                // Play rotation sound for clockwise rotation
                if (this.rotate_sfx && typeof this.rotate_sfx.play === "function") {
                    this.rotate_sfx.play();
                }
            } else if (e.key === "d" || e.key === "D") {
                piece.targetRot = (piece.targetRot - this.rotationStep + 360) % 360;

                // Play rotation sound for counterclockwise rotation
                if (this.rotate_sfx && typeof this.rotate_sfx.play === "function") {
                    this.rotate_sfx.play();
                }
            }
            piece.rotating = true;
        }
        // console.log("Reached");
        if (this.state == PuzzleState.completed || this.state == PuzzleState.failed) return;
        // console.log("STATE", this.state);
        if (this.hidden && this.highlight && e.key == 'e') {
            this.player.disabled = true;
            this.hidden = false;
        }
    }

    checkSolution(): boolean {
        let allCorrect = this.puzzlePieces.every(piece => {
            let d = this.scene.p5.dist(piece.pos.x, piece.pos.y, piece.idealPos.x, piece.idealPos.y);
            let r = this.angleDiff(piece.rot, piece.idealRot);
            return d < this.pieceThreshold && r < this.rotationThreshold;
        });
        if (allCorrect) {
            this.state = PuzzleState.completed;
            this.hidden = true;
            this.onCompleted && this.onCompleted();
            this.player.disabled = false;
            this.scene.physics.remove(this.physics_object);
            clearTimeout(this.collider_timeout);
            this.asset.change_asset('breakaway-success');
            return true;
        }
        return false;
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
