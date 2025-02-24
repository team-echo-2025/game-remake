import p5 from "p5";
import Scene from "../../lib/Scene";
import DragHandler, { ShapeState, ShapeType } from "./DragHandler";
import Puzzle, { PuzzleState } from "../../lib/Puzzle";


export default class Tangram extends Puzzle {
  img: p5.Image | null = null;
  shapes: DragHandler[] = []; // Array to store shapes
  dragging: DragHandler | null = null;

  constructor(scene: Scene) {
    super(scene);
    this.state = PuzzleState.notStarted;
  }

  setup(): void {
    this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
    let shapeCount = Puzzle.difficulty === "easy" ? 7 : Puzzle.difficulty === "normal" ? 7 : 7;
    this.generateSolvableShapes(shapeCount);
    this.scene.p5.rectMode(this.scene.p5.CENTER);
  }

  draw(): void {
    this.drawOutline();
    const p = this.scene.p5;
    
    if (this.solved()) {
        this.displayWinMessage();
    } else {
        for (let shape of this.shapes) {
            if (!shape.dragging) {
                shape.draw();
            }
        }
    }

    if (this.dragging) {
        this.dragging.update();
    } else {
        // Only check the solution when no piece is being dragged
        if (this.checkSolution()) {
            this.displayWinMessage();
        }
    }
}
  generateSolvableShapes(shapeCount: number): DragHandler[] {
    this.shapes = [];

    let rectWidth = this.scene.p5.width / 2;
    let rectHeight = this.scene.p5.height / 2;

    // Calculate size for each shape based on proportions
    let largeTriangleBase = rectWidth / 4;   // Large triangle
    let mediumTriangleBase = rectWidth / 8;  // Medium triangle
    let smallTriangleBase = rectWidth / 16;  // Small triangle
    let squareSize = rectWidth / 8;          // Square
    let parallelogramBase = rectWidth / 8;   // Parallelogram base (same as square)

    // Add large triangles
    let largeTriangle1 = new DragHandler(this.scene, 285, this.scene.p5.height / 3, ShapeType.largeTriangle);
    largeTriangle1.state = ShapeState.unmoved;
    this.shapes.push(largeTriangle1);

    let largeTriangle2 = new DragHandler(this.scene, 285, this.scene.p5.height/5, ShapeType.largeTriangle);
    largeTriangle2.state = ShapeState.unmoved;
    this.shapes.push(largeTriangle2);

    // Add medium triangle
    let mediumTriangle = new DragHandler(this.scene, -675, this.scene.p5.height/2, ShapeType.medTriangle);
    mediumTriangle.state = ShapeState.unmoved;
    this.shapes.push(mediumTriangle);
    let mediumTriangle2 = new DragHandler(this.scene, -675, this.scene.p5.height/3, ShapeType.medTriangle);
    mediumTriangle.state = ShapeState.unmoved;
    this.shapes.push(mediumTriangle2);

    // Add small triangle
    let smallTriangle = new DragHandler(this.scene, -625, 250, ShapeType.smallTriangle);
    smallTriangle.state = ShapeState.unmoved;
    this.shapes.push(smallTriangle);
    // let smallTriangle2 = new DragHandler(this.scene, -625, 350, ShapeType.smallTriangle);
    // smallTriangle.state = ShapeState.unmoved;
    // this.shapes.push(smallTriangle2);

    // Add square
    let square = new DragHandler(this.scene, -300, 0, ShapeType.square);
    square.state = ShapeState.unmoved;
    this.shapes.push(square);

    // Add parallelogram
    let parallelogram = new DragHandler(this.scene, this.scene.p5.width / 100, 300, ShapeType.quad);
    parallelogram.state = ShapeState.unmoved;
    this.shapes.push(parallelogram);

    console.log("Created solvable shapes for Tangram puzzle");
    return this.shapes;
  }






  mousePressed(): void {
    if (this.solved()) {
      this.scene.start(this.scene.name);
      return;
    }

    for (let shape of this.shapes) {
      if (this.isMouseOver(shape)) {
        this.dragging = shape;
        this.dragging.dragging = true;
        this.dragging.state = ShapeState.dragged;
        break;
      }
    }
  }

  mouseDragged(): void {
    if (this.dragging!.dragging) {
      this.dragging!.x = this.scene.p5.mouseX - this.scene.p5.width / 2;
      console.log(this.dragging!.x);
      this.dragging!.y = this.scene.p5.mouseY - this.scene.p5.height / 2;
    }
    this.draw();
  }

  isOverlapping(shapeA: DragHandler, shapeB: DragHandler): boolean {
    let tolerance = Math.min(this.getShapeWidth(shapeA), this.getShapeWidth(shapeB)) * .7  ; // Dynamic tolerance

    let wA = this.getShapeWidth(shapeA);
    let hA = this.getShapeHeight(shapeA);
    let wB = this.getShapeWidth(shapeB);
    let hB = this.getShapeHeight(shapeB);

    let xA = shapeA.x;
    let yA = shapeA.y;
    let xB = shapeB.x;
    let yB = shapeB.y;

    return !(
      xA + wA / 2 < xB - wB / 2 + tolerance ||
      xA - wA / 2 > xB + wB / 2 - tolerance ||
      yA + hA / 2 < yB - hB / 2 + tolerance ||
      yA - hA / 2 > yB + hB / 2 - tolerance
    );
  }
  getShapeWidth(shape: DragHandler): number {
    let baseSize = this.scene.p5.width / 8;
    switch (shape.shapeType) {
      case ShapeType.largeTriangle: return baseSize * 2;
      case ShapeType.medTriangle: return baseSize * 1.5;
      case ShapeType.smallTriangle: return baseSize;
      case ShapeType.square: return baseSize;
      case ShapeType.quad: return baseSize * 1.2;
      default: return baseSize;
    }
  }

  getShapeHeight(shape: DragHandler): number {
    return this.getShapeWidth(shape) * 0.9; // Rough height estimation
  }

  mouseReleased(): void {
    if (this.dragging) {
        let newX = this.scene.p5.mouseX - this.scene.p5.width / 2;
        let newY = this.scene.p5.mouseY - this.scene.p5.height / 2;

        this.dragging.x = newX;
        this.dragging.y = newY;
        this.dragging.dragging = false;

        let overlapping = false;

        for (let shape of this.shapes) {
            if (shape !== this.dragging && this.isOverlapping(this.dragging, shape)) {
                overlapping = true;
            }
        }

        if (overlapping) {
            console.log("Overlap detected, resetting position");
            this.dragging.x = this.dragging.initialX;
            this.dragging.y = this.dragging.initialY;
        }

        // **Ensure checkSolution() is checked every time a piece is released**
        console.log("Checking solution after mouse release...");
        if (this.checkSolution()) {
            this.state = PuzzleState.completed;
            console.log("Puzzle Solved!");
        }

        this.dragging = null;
    }
}


  isMouseOver(shape: DragHandler): boolean {
    let d = this.scene.p5.dist(shape.x, shape.y, this.scene.p5.mouseX - this.scene.p5.width / 2, this.scene.p5.mouseY - this.scene.p5.height / 2);
    return d < 20;
  }
  drawOutline() {
    let padding = this.scene.p5.width * 0.05; // Add some padding around the shapes
    let maxShapeSize = this.scene.p5.width / 2; // Approximate max size of all shapes combined
    let outlineWidth = maxShapeSize + padding;
    let outlineHeight = maxShapeSize + padding;

    this.scene.p5.fill(255);
    this.scene.p5.strokeWeight(3);
    this.scene.p5.stroke(0);
    this.scene.p5.rectMode(this.scene.p5.CENTER);
    this.scene.p5.rect(0, 0, outlineWidth * .64, outlineHeight * .64);
  }

  keyPressed(): void {
    if (this.dragging) {
      if (this.scene.p5.key === 'r' || this.scene.p5.key === 'R') {
        this.dragging.rotateShape(Math.PI / 12); // Rotate by 15 degrees
      }
      if (this.scene.p5.key === 't' || this.scene.p5.key === 'T') {
        this.dragging.rotateShape(-Math.PI / 12); // Rotate counterclockwise
      }
    }
  }
  checkSolution(): boolean {
    let padding = this.scene.p5.width * 0.05;
    let maxShapeSize = this.scene.p5.width / 2;
    let outlineWidth = maxShapeSize + padding;
    let outlineHeight = maxShapeSize + padding;

    let leftBound = -outlineWidth * 0.32;
    let rightBound = outlineWidth * 0.32;
    let topBound = -outlineHeight * 0.32;
    let bottomBound = outlineHeight * 0.32;

    for (let shape of this.shapes) {
        if (
            shape.x < leftBound || shape.x > rightBound ||
            shape.y < topBound || shape.y > bottomBound
        ) {
            return false; // Shape is outside the box
        }
    }
    console.log("Checked and solved");
    return true;
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

}