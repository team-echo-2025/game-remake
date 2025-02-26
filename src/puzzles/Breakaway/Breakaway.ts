import p5 from "p5";
import Scene from "../../lib/Scene";
import Puzzle from "../../lib/Puzzle";

/**
 * Represents a single puzzle piece.
 */
interface PuzzlePiece {
  localVerts: { x: number; y: number }[]; // the shape of the piece in its own local coordinates
  idealPos: p5.Vector; // the final correct position for this piece
  pos: p5.Vector;      // current position of this piece
  c: p5.Color;         // color
  rot: number;         // current rotation (0 to 359)
  targetRot: number;   // rotation we are animating toward
  idealRot: number;    // final correct rotation
}

/**
 * A puzzle called "Breakaway" with scattered jigsaw-like pieces.
 */
export default class Breakaway extends Puzzle {
  // All puzzle pieces
  private puzzlePieces: PuzzlePiece[] = [];

  // Currently selected piece for dragging/rotation
  private selectedPieceIndex: number | null = null;
  private dragOffset: p5.Vector | null = null;

  // If non-empty, puzzle is done and we display a message.
  private gameResult = "";

  // The parent scene
  scene: Scene;

  // Puzzle thresholds
  private pieceThreshold = 20;       // how close position must be
  private rotationThreshold = 30;    // how close rotation must be
  private orientationCount = 4;      // 4 discrete orientations (like 90° steps)
  private rotationStep = 360 / this.orientationCount;   // step size per rotation command
  private rotationAnimStep = 5;      // degrees per frame for rotation smoothing

  // Puzzle layout parameters.
  private p1_cols = 4;
  private p1_rows = 5;
  private p1_left = 100;
  private p1_top = 50;
  private p1_width = 400;
  private p1_height = 400;

  // Scatter tray region on the right side.
  private trayX_min = 800;
  private trayX_max = 1100;
  private trayY_min = 100;
  private trayY_max = 800;

  // Grid irregularity.
  private perturbAmt = 15;

  // We'll store grid intersections for generating puzzle pieces.
  private intersections: p5.Vector[][] = [];

  /**
   * Construct a new Breakaway puzzle.
   * @param scene the parent Scene
   */
  constructor(scene: Scene) {
    super(scene);
    this.scene = scene;
  }

  /**
   * p5 setup.
   * Force a fixed canvas size and attach event handlers.
   */
  setup(): void {
    const p = this.scene.p5;

    // Use a fixed-size canvas to avoid coordinate confusion.
    // Increase if needed.
    const cnv = p.createCanvas(1200, 900);
    // Position at top-left to avoid any scroll or margin offsets.
    cnv.position(0, 0);

    // Ensure p5 calls these class methods on mouse/key events.
    p.mousePressed = () => this.mousePressed();
    p.mouseDragged = () => this.mouseDragged();
    p.mouseReleased = () => this.mouseReleased();
    p.keyPressed = () => this.keyPressed();

    console.log("[Breakaway] setup() called.");

    // Build puzzle geometry.
    this.createPuzzle1();
    this.scatterPieces();
  }

  /**
   * p5 draw loop.
   */
  draw(): void {
    const p = this.scene.p5;
    p.background(30);

    // Animate rotations
    for (const piece of this.puzzlePieces) {
      this.updateRotation(piece);
    }

    // Draw dotted outlines for final positions.
    for (const piece of this.puzzlePieces) {
      const d = p.dist(piece.pos.x, piece.pos.y, piece.idealPos.x, piece.idealPos.y);
      const angleErr = this.angleDiff(piece.rot, piece.idealRot);
      const outlineCol = (d < this.pieceThreshold && angleErr < this.rotationThreshold)
        ? p.color(0, 255, 0)
        : p.color(255, 0, 0);
      this.drawDottedOutline(
        piece.localVerts,
        piece.idealPos.x,
        piece.idealPos.y,
        piece.idealRot,
        outlineCol
      );
    }

    // Draw puzzle pieces themselves.
    for (let i = 0; i < this.puzzlePieces.length; i++) {
      this.drawPiece(this.puzzlePieces[i], i === this.selectedPieceIndex);
    }

    // Show rotation instructions.
    p.fill(255);
    p.noStroke();
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.text(
      "Rotation:\nPress U (or u) to rotate CW\nPress D (or d) to rotate CCW",
      this.trayX_min,
      20
    );

    // Check puzzle status.
    this.checkSolutionAuto();

    // If puzzle is solved, show a message.
    if (this.gameResult !== "") {
      p.fill(255, 220, 0);
      p.textSize(40);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(this.gameResult, p.width / 2, p.height / 2);
    }
  }

  /**
   * Creates the puzzle pieces in memory, using a grid with slight perturbation.
   */
  private createPuzzle1(): void {
    console.log("[Breakaway] createPuzzle1() called.");
    const p = this.scene.p5;
    this.puzzlePieces = [];
    this.intersections = [];

    const cellW = this.p1_width / this.p1_cols;
    const cellH = this.p1_height / this.p1_rows;

    // Generate grid intersections with moderate perturbation.
    for (let i = 0; i <= this.p1_cols; i++) {
      this.intersections[i] = [];
      for (let j = 0; j <= this.p1_rows; j++) {
        let x = this.p1_left + i * cellW;
        let y = this.p1_top + j * cellH;
        // Shift intersections slightly.
        x += p.random(-this.perturbAmt, this.perturbAmt);
        y += p.random(-this.perturbAmt, this.perturbAmt);
        this.intersections[i][j] = p.createVector(x, y);
      }
    }

    // Build each cell into a puzzle piece.
    for (let i = 0; i < this.p1_cols; i++) {
      for (let j = 0; j < this.p1_rows; j++) {
        const tl = this.intersections[i][j];
        const tr = this.intersections[i + 1][j];
        const br = this.intersections[i + 1][j + 1];
        const bl = this.intersections[i][j + 1];

        // localVerts: store the shape relative to top-left corner.
        const localVerts = [
          { x: 0, y: 0 },
          { x: tr.x - tl.x, y: tr.y - tl.y },
          { x: br.x - tl.x, y: br.y - tl.y },
          { x: bl.x - tl.x, y: bl.y - tl.y }
        ];

        this.puzzlePieces.push({
          localVerts,
          idealPos: tl.copy(),
          pos: tl.copy(),
          c: p.color(p.random(50, 255), p.random(50, 255), p.random(50, 255)),
          rot: 0,
          targetRot: 0,
          idealRot: 0
        });
      }
    }
    console.log("[Breakaway] created", this.puzzlePieces.length, "pieces.");
  }

  /**
   * Randomly scatter all puzzle pieces in the right tray.
   */
  private scatterPieces(): void {
    console.log("[Breakaway] scatterPieces() called.");
    const p = this.scene.p5;
    for (const piece of this.puzzlePieces) {
      piece.pos = p.createVector(
        p.random(this.trayX_min, this.trayX_max),
        p.random(this.trayY_min, this.trayY_max)
      );
      // Randomize rotation to one of the discrete steps.
      piece.rot = Math.floor(p.random(0, this.orientationCount)) * this.rotationStep;
      piece.targetRot = piece.rot;
    }
  }

  /**
   * Checks if all pieces are close enough in position & rotation to declare success.
   */
  private checkSolutionAuto(): void {
    const p = this.scene.p5;
    for (const piece of this.puzzlePieces) {
      const d = p.dist(piece.pos.x, piece.pos.y, piece.idealPos.x, piece.idealPos.y);
      const r = this.angleDiff(piece.rot, piece.idealRot);
      if (d > this.pieceThreshold || r > this.rotationThreshold) {
        return; // Not solved yet.
      }
    }
    // If we never returned, puzzle is solved.
    console.log("[Breakaway] puzzle solved!");
    this.gameResult = "Puzzle Solved!";
  }

  /**
   * Helper to draw a single puzzle piece.
   * @param piece The puzzle piece data.
   * @param highlight If true, draws a red outline.
   */
  private drawPiece(piece: PuzzlePiece, highlight: boolean): void {
    const p = this.scene.p5;
    // Log the piece's pos for debugging
    // console.log(`Drawing piece at (${piece.pos.x}, ${piece.pos.y})`);

    p.push();
    p.translate(piece.pos.x, piece.pos.y);
    p.rotate(p.radians(piece.rot));
    if (highlight) {
      p.stroke(255, 0, 0);
      p.strokeWeight(3);
    } else {
      p.noStroke();
    }
    p.fill(piece.c);
    p.beginShape();
    for (const v of piece.localVerts) {
      p.vertex(v.x, v.y);
    }
    p.endShape(p.CLOSE);
    p.pop();
  }

  /**
   * Helper to draw dotted outlines showing final piece positions.
   */
  private drawDottedOutline(
    vertices: { x: number; y: number }[],
    offsetX: number,
    offsetY: number,
    outlineRot: number,
    col: p5.Color
  ): void {
    const p = this.scene.p5;
    p.push();
    p.translate(offsetX, offsetY);
    p.rotate(p.radians(outlineRot));

    // Wrap setLineDash in a check
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    if (ctx.setLineDash) {
      ctx.setLineDash([5, 5]);
    }

    p.stroke(col);
    p.strokeWeight(2);
    p.noFill();
    p.beginShape();
    for (const v of vertices) {
      p.vertex(v.x, v.y);
    }
    p.endShape(p.CLOSE);

    if (ctx.setLineDash) {
      ctx.setLineDash([]);
    }

    p.pop();
  }

  /**
   * Animate a puzzle piece's rotation until it reaches its targetRot.
   */
  private updateRotation(piece: PuzzlePiece): void {
    const oldRot = piece.rot;
    if (piece.rot !== piece.targetRot) {
      const diff = (piece.targetRot - piece.rot + 360) % 360;
      if (diff > 180) {
        // rotate negatively
        const negDiff = 360 - diff;
        if (negDiff < this.rotationAnimStep) {
          piece.rot = piece.targetRot;
        } else {
          piece.rot = (piece.rot - this.rotationAnimStep + 360) % 360;
        }
      } else {
        // rotate positively
        if (diff < this.rotationAnimStep) {
          piece.rot = piece.targetRot;
        } else {
          piece.rot = (piece.rot + this.rotationAnimStep) % 360;
        }
      }
    }
    if (oldRot !== piece.rot) {
      // optionally log
      // console.log(`[Breakaway] piece rotating from ${oldRot} to ${piece.rot}`);
    }
  }

  /**
   * A small utility to measure difference in angles (0..180).
   */
  private angleDiff(a: number, b: number): number {
    let diff = Math.abs(a - b) % 360;
    return diff > 180 ? 360 - diff : diff;
  }

  /**
   * Called by p5 when mouse is pressed.
   * We'll handle piece selection here.
   */
  mousePressed(): void {
    console.log("[Breakaway] mousePressed()");
    const p = this.scene.p5;
    if (this.gameResult !== "") {
      console.log("[Breakaway] puzzle is solved, ignoring mousePressed.");
      return;
    }

    const mx = p.mouseX;
    const my = p.mouseY;
    console.log(`[Breakaway] mousePressed at x=${mx}, y=${my}`);

    for (let i = this.puzzlePieces.length - 1; i >= 0; i--) {
      const piece = this.puzzlePieces[i];
      const clickPt = p.createVector(mx, my);
      const verts = this.getGlobalVerts(piece);

      // Debug bounding box:
      // let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      // for (const v of verts) {
      //   if (v.x < minX) minX = v.x;
      //   if (v.x > maxX) maxX = v.x;
      //   if (v.y < minY) minY = v.y;
      //   if (v.y > maxY) maxY = v.y;
      // }
      // console.log(`piece #${i} bounding box: x=[${minX},${maxX}] y=[${minY},${maxY}]`);

      if (this.pointInPolygon(clickPt, verts)) {
        console.log(`[Breakaway] clicked piece index ${i} at pos=(${piece.pos.x},${piece.pos.y})`);
        this.selectedPieceIndex = i;
        this.dragOffset = p.createVector(
          mx - piece.pos.x,
          my - piece.pos.y
        );
        return;
      }
    }
    console.log("[Breakaway] clicked on empty area, no piece selected.");
  }

  /**
   * Called by p5 when mouse is dragged.
   */
  mouseDragged(): void {
    console.log("[Breakaway] mouseDragged()");
    const p = this.scene.p5;
    if (this.selectedPieceIndex !== null && this.gameResult === "") {
      const piece = this.puzzlePieces[this.selectedPieceIndex];
      if (this.dragOffset) {
        const mx = p.mouseX;
        const my = p.mouseY;
        piece.pos.x = mx - this.dragOffset.x;
        piece.pos.y = my - this.dragOffset.y;
      }
    }
  }

  /**
   * Called by p5 when mouse is released.
   */
  mouseReleased(): void {
    console.log("[Breakaway] mouseReleased()");
    // We'll keep the piece selected for rotation.
  }

  /**
   * Called by p5 when a key is pressed.
   * We use U/d to rotate the selected piece.
   */
  keyPressed(): void {
    console.log("[Breakaway] keyPressed()");
    const p = this.scene.p5;
    if (this.selectedPieceIndex !== null && this.gameResult === "") {
      const piece = this.puzzlePieces[this.selectedPieceIndex];
      const keyVal = p.key;
      console.log(`[Breakaway] key='${keyVal}'`);
      if (keyVal === 'u' || keyVal === 'U') {
        piece.targetRot = (piece.targetRot + this.rotationStep) % 360;
      } else if (keyVal === 'd' || keyVal === 'D') {
        piece.targetRot = (piece.targetRot - this.rotationStep + 360) % 360;
      }
    }
  }

  /**
   * Converts a piece's local vertices to global coordinates.
   */
  private getGlobalVerts(piece: PuzzlePiece): p5.Vector[] {
    const p = this.scene.p5;
    const verts: p5.Vector[] = [];
    const angleRad = p.radians(piece.rot);

    for (const v of piece.localVerts) {
      // rotate point v around origin by angleRad
      const rx = v.x * p.cos(angleRad) - v.y * p.sin(angleRad);
      const ry = v.x * p.sin(angleRad) + v.y * p.cos(angleRad);
      // then offset by piece.pos
      verts.push(p.createVector(rx + piece.pos.x, ry + piece.pos.y));
    }

    return verts;
  }

  /**
   * Ray-casting test for point-in-polygon.
   */
  private pointInPolygon(pt: p5.Vector, polygon: p5.Vector[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x;
      const yi = polygon[i].y;
      const xj = polygon[j].x;
      const yj = polygon[j].y;

      const intersect = ((yi > pt.y) !== (yj > pt.y)) &&
        (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }
}
