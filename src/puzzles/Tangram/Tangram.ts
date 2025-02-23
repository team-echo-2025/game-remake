import p5 from "p5";
import Scene from "../../lib/Scene";
import DragHandler, { ShapeState, ShapeType } from "./DragHandler";
import Puzzle, { PuzzleState } from "../../lib/Puzzle";
import Shape from "./Shape";


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
    // this.drawShapes();
    // if (this.dragging) {
    //   const x = this.scene.p5.mouseX - this.scene.p5.width / 2;
    //   const y = this.scene.p5.mouseY - this.scene.p5.height / 2;
    //   this.dragging.x = x;
    //   this.dragging.y = y;
    //   this.dragging.draw();
    // }
    for (let shape of this.shapes) {
      if (shape.dragging == false) {
        shape.draw();
      }
    }
    if (this.dragging) {
      console.log("updating dragging cube")
      this.dragging.update();
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
    let largeTriangle1 = new DragHandler(this.scene, 385, -50, ShapeType.largeTriangle);
    largeTriangle1.state = ShapeState.unmoved;
    this.shapes.push(largeTriangle1);

    let largeTriangle2 = new DragHandler(this.scene, 385, 300, ShapeType.largeTriangle);
    largeTriangle2.state = ShapeState.unmoved;
    this.shapes.push(largeTriangle2);

    // Add medium triangle
    let mediumTriangle = new DragHandler(this.scene, -675, -200, ShapeType.medTriangle);
    mediumTriangle.state = ShapeState.unmoved;
    this.shapes.push(mediumTriangle);
    let mediumTriangle2 = new DragHandler(this.scene, -625, 350, ShapeType.medTriangle);
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

  mouseReleased(): void {
    if (this.dragging) {
      //logic
      this.dragging.x = this.scene.p5.mouseX - this.scene.p5.width / 2;
      this.dragging.y = this.scene.p5.mouseY - this.scene.p5.height / 2; // value - offset
      this.dragging.dragging = false;
      //IMPLEMENT CHECK SOLUTION --> LATER THO
      // if (this.checkSolution()) this.state = PuzzleState.completed;
      this.dragging = null;
    }
  }


  isMouseOver(shape: DragHandler): boolean {
    let d = this.scene.p5.dist(shape.x, shape.y, this.scene.p5.mouseX - this.scene.p5.width / 2, this.scene.p5.mouseY - this.scene.p5.height / 2);
    return d < 20;
  }
  drawOutline() {
    let rectWidth = this.scene.p5.width * 0.5;
    let rectHeight = this.scene.p5.width * 0.51; // Proportional height

    this.scene.p5.fill(255);
    this.scene.p5.strokeWeight(5);
    this.scene.p5.stroke(0);
    this.scene.p5.rectMode(this.scene.p5.CENTER);
    this.scene.p5.rect(0, 0, rectWidth, rectHeight);
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
}