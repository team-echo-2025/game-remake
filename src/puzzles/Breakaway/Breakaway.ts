import PhysicsObject from "../../lib/physics/PhysicsObject";
import RigidBody from "../../lib/physics/RigidBody";
import Player from "../../lib/Player";
import Puzzle, { PuzzleState } from "../../lib/Puzzle";
import Scene from "../../lib/Scene";
import { Vector } from "p5";
import Sprite from "../../lib/Sprite";

// Added Sound and SoundManager imports for breakaway sound effects
import Sound from "../../lib/Sound";

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

    private winDelayStart: number | null = null;
    private readonly winDelayDuration = 1000;

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
        this.hide_page = true;
        this.player = player;
    }


    force_solve() {
        this.state = PuzzleState.completed;
        this.hidden = true;
        this.hide_page = true;
        this.player.disabled = false;
        this.asset.change_asset('breakaway-success');
        this.scene.physics.remove(this.physics_object);
    }

    override preload(): any {
        // Preload sound effects using the scene's loadSound method
        this.scene.loadSound("click", "assets/TInterfaceSounds/click-234708.mp3");
        this.scene.loadSound("rotate", "assets/TInterfaceSounds/mouse-click-290204.mp3");
        this.scene.loadSound("snap", "assets/TInterfaceSounds/snap-264680.mp3");
    }

    override setup(): void {
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
                    this.hidden = false;
                    this.asset.change_asset("breakaway-highlight");
                }
                this.collider_timeout = setTimeout(() => {
                    this.highlight = false;
                    this.hidden = true;
                    this.hide_page = true;
                    this.asset.change_asset("breakaway");
                }, 100);
            }
        }
        this.asset = this.scene.add_new.sprite(this.asset_key);
        this.asset.x = this.x;
        this.asset.y = this.y;
        this.asset.width = 32;
        this.asset.height = 48;
        this.asset.zIndex = 49;
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

    override postDraw(): void {
        if (this.state == PuzzleState.completed || this.state == PuzzleState.failed) return;
        if (this.hide_page) return;
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
        this.scene.p5.text("Rotation:\nPress R (or R) to rotate clockwise\nPress D (or d) to rotate counterclockwise", 0, -175);

        if (this.checkSolution()) this.state = PuzzleState.completed;
        if (this.isDisplayingHint) {
            this.drawHint();
          }
    }

    drawBody(): void {
        let rectWidth = this.scene.p5.width / 1.30;
        let rectHeight = this.scene.p5.height / 1.1;

        let rectX = 0;
        let rectY = 0;

        this.scene.p5.fill(0);
        this.scene.p5.rect(rectX, rectY, rectWidth, rectHeight);
    }

    drawPiece(piece: any, highlight: boolean): void {
        this.scene.p5.push();
        const maxx = Math.max(...piece.localVerts.map((v: any) => v.x));
        const minx = Math.min(...piece.localVerts.map((v: any) => v.x));
        const maxy = Math.max(...piece.localVerts.map((v: any) => v.y));
        const miny = Math.min(...piece.localVerts.map((v: any) => v.y));
        let width = maxx - minx;
        let height = maxy - miny;
        this.scene.p5.translate(piece.pos.x + width / 2, piece.pos.y + height / 2);
        //this.scene.p5.translate(piece.pos.x, piece.pos.y);
        this.scene.p5.rotate(this.scene.p5.radians(piece.rot));
        this.scene.p5.translate(-width / 2, -height / 2);

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
        const angle = this.scene.p5.radians(piece.rot);

        // local bounds again
        const maxx = Math.max(...piece.localVerts.map((v: any) => v.x));
        const minx = Math.min(...piece.localVerts.map((v: any) => v.x));
        const maxy = Math.max(...piece.localVerts.map((v: any) => v.y));
        const miny = Math.min(...piece.localVerts.map((v: any) => v.y));
        const cx = (maxx - minx) / 2;
        const cy = (maxy - miny) / 2;

        return piece.localVerts.map((v: any) => {
            // shift to centre, rotate, shift back, then translate to world
            const rx = (v.x - cx) * Math.cos(angle) - (v.y - cy) * Math.sin(angle);
            const ry = (v.x - cx) * Math.sin(angle) + (v.y - cy) * Math.cos(angle);
            return this.scene.p5.createVector(rx + piece.pos.x + cx,
                ry + piece.pos.y + cy);
        });
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

    override mousePressed(): void {
        if (this.hide_page ||
            this.state === PuzzleState.failed ||
            this.state === PuzzleState.completed) {
            return;
        }
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

            piece.pos.x = this.scene.mouseX;
            piece.pos.y = this.scene.mouseY;
        }
    }

    private isPieceCorrect(piece: any): boolean {
        let d = this.scene.p5.dist(
            piece.pos.x, piece.pos.y,
            piece.idealPos.x, piece.idealPos.y
        );
        let r = this.angleDiff(piece.rot, piece.idealRot);

        return d < this.pieceThreshold && r < this.rotationThreshold;
    }


    override mouseReleased(): void {
        if (this.selectedPieceIndex !== null) {
            let piece = this.puzzlePieces[this.selectedPieceIndex];
            piece.dragging = false;
            this.selectedPieceIndex = null;

            // 1) Check if this dropped piece is in its correct spot
            if (this.isPieceCorrect(piece)) {
                piece.pos.x = piece.idealPos.x;
                piece.pos.y = piece.idealPos.y;
                this.snap_sfx.play();
            }

            // 2) Then see if the puzzle as a whole is now solved
            if (this.checkSolution()) {
                // The puzzle is fully complete. 
                // (Whatever your puzzle completion logic is)
            }
        }


    }

    override keyPressed(e: KeyboardEvent): void {
        if (this.selectedPieceIndex !== null) {
            let piece = this.puzzlePieces[this.selectedPieceIndex];

            if (piece.rotating) return;

            if (e.key === "r" || e.key === "R") {
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
        if (this.state == PuzzleState.completed || this.state == PuzzleState.failed) return;
        if (this.hide_page && this.highlight && e.key == 'e') {
            this.onOpen && this.onOpen();
            this.player.disabled = true;
            this.hide_page = false;
            this.setupHint();
        }
        if (!this.hide_page && e.key == 'Escape') {
            this.cleanup();
            this.player.disabled = false;
            this.hide_page = true;
        }
    }

    override checkSolution(): boolean {
        let allCorrect = this.puzzlePieces.every(piece => {
            let d = this.scene.p5.dist(piece.pos.x, piece.pos.y, piece.idealPos.x, piece.idealPos.y);
            let r = this.angleDiff(piece.rot, piece.idealRot);
            return d < this.pieceThreshold && r < this.rotationThreshold;
        });
        if (allCorrect) {
            this.state = PuzzleState.completed;
            this.cleanup();
            this.hide_page = true;
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

    override setDifficulty(difficulty: string): void {
        Puzzle.difficulty = difficulty;

        this.cols = Puzzle.difficulty === "easy" ? 3 : Puzzle.difficulty === "normal" ? 4 : 5;
        this.rows = Puzzle.difficulty === "easy" ? 3 : Puzzle.difficulty === "normal" ? 4 : 5;

        this.puzzlePieces = [];

        this.selectedPieceIndex = null;
        this.gameResult = "";

        this.setup();
    }
    override drawHint(): void {
        // grab p5 & raw GL context
        const p  = this.scene.p5 as any;
        const gl = p._renderer.GL as WebGLRenderingContext;
      
        // disable depth‑testing so our hint always draws on top
        gl.disable(gl.DEPTH_TEST);
      
        // card geometry 
        const rectWidth  = p.windowHeight / 2;
        const rectHeight = p.windowHeight / 2 + 60;
        const rectX      = -p.windowWidth  / 3;
        const rectY      = -50;
      
        p.push();
          // 1) fully opaque white background (hides everything)
          p.noStroke();
          p.fill(255, 255, 255, 180);  
          p.rect(rectX, rectY, rectWidth, rectHeight, 8);
      
          // 2) thin black border
          p.stroke(0);
          p.strokeWeight(2);
          p.noFill();
          p.rect(rectX, rectY, rectWidth, rectHeight, 8);
      
          // 3) title
          p.noStroke();
          p.fill(0);
          this.scene.p5.textAlign(this.scene.p5.CENTER, this.scene.p5.CENTER);
          p.textSize(32);
          this.scene.p5.text('How To Play', -this.scene.p5.windowWidth/3, -this.scene.p5.windowHeight/4 - 25);
      
          // 4) body text (wrapped)
          p.textSize(20);
          p.textLeading(24);
          p.textWrap(p.WORD);
          p.textAlign(p.LEFT, p.TOP);
          const instr =
      `Click on one of the puzzle pieces to begin dragging it toward the puzzle.
      
      Use the "r" and "d" keys to rotate the piece. Place the piece in its correct spot.
      
      When the piece is in the correct position, the outside edge of the piece will highlight green.`;
          p.text(
            instr,
            rectX + 16,
            rectY + 56,
            rectWidth - 32,
            rectHeight - 80
          );
        p.pop();
      
        // re‑enable depth‑testing so your puzzle still renders correctly afterward
        gl.enable(gl.DEPTH_TEST);
      }
      

}
