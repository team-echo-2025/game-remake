import p5 from "p5";
import Scene from "../../lib/Scene";
import Puzzle, { PuzzleState } from "../../lib/Puzzle";
import ButtonTest from "../../lib/ui/ButtonTest";


export default class Breakaway extends Puzzle {
    let puzzlePieces = [];
let selectedPieceIndex = null; // persistent selection for rotation
let dragOffset = null;
let gameResult = "";
scene: Scene;
reset: ButtonTest;
constructor(scene: Scene, reset: ButtonTest) {
    super(scene);
    this.reset = reset;
}

// -- Increased thresholds for an easier puzzle --
const pieceThreshold = 20;      // pieces can be 20px off
const rotationThreshold = 30;   // pieces can be 30° off

// Define discrete rotation parameters
const orientationCount = 4; // 4 orientations (90° steps)
const rotationStep = 360 / orientationCount;
const rotationAnimStep = 5; // degrees per frame for pseudo animation

// Puzzle parameters (grid: 4×5, final area: 400×400 at (100,50))
const p1_cols = 4, p1_rows = 5;
const p1_left = 100, p1_top = 50, p1_width = 400, p1_height = 400;

// Scattering tray for puzzle pieces: along the right side
const trayX_min = 800, trayX_max = 1100;
const trayY_min = 100, trayY_max = 800;

// Lower perturbation => less irregular, simpler shapes
const perturbAmt = 15;
const canvasWidth = 1200, canvasHeight = 900;
let intersections = [];

function setup() {
    this.scene.p5.createCanvas(this.scene.p5.windowWidth, this.scene.p5.windowHeight);
    createPuzzle1();
    scatterPieces(); // Scatter pieces in the side tray
    let resetBtn =  new ButtonTest(reset);
    resetBtn.position(20, height - 40);
    resetBtn.mousePressed(resetPuzzle);
    textFont("Arial", 16);
}

function draw() {
    background(30);

    // Update rotation animation for each piece
    for (let piece of puzzlePieces) {
        updateRotation(piece);
    }

    // Draw puzzle area's dotted outlines (final positions)
    for (let piece of puzzlePieces) {
        let d = dist(piece.pos.x, piece.pos.y, piece.idealPos.x, piece.idealPos.y);
        let angleErr = angleDiff(piece.rot, piece.idealRot);
        let outlineCol = (d < pieceThreshold && angleErr < rotationThreshold)
            ? color(0, 255, 0)
            : color(255, 0, 0);
        drawDottedOutline(piece.localVerts, piece.idealPos.x, piece.idealPos.y, piece.idealRot, outlineCol);
    }

    // Draw all puzzle pieces (scattered in the side tray)
    for (let i = 0; i < puzzlePieces.length; i++) {
        drawPiece(puzzlePieces[i], i === selectedPieceIndex);
    }

    // Display rotation instructions on the side
    fill(255);
    noStroke();
    textSize(16);
    textAlign(LEFT, TOP);
    text("Rotation:\nPress U (or u) to rotate CW\nPress D (or d) to rotate CCW", trayX_min, 20);

    // Check if puzzle is solved and display win message
    checkSolutionAuto();

    if (gameResult !== "") {
        fill(255, 220, 0);
        textSize(40);
        textAlign(CENTER, CENTER);
        text(gameResult, width / 2, height / 2);
    }
}

function createPuzzle1() {
    puzzlePieces = [];
    intersections = [];
    let cellW = p1_width / p1_cols;
    let cellH = p1_height / p1_rows;

    // Generate grid intersections with moderate perturbation
    for (let i = 0; i <= p1_cols; i++) {
        intersections[i] = [];
        for (let j = 0; j <= p1_rows; j++) {
            let x = p1_left + i * cellW;
            let y = p1_top + j * cellH;

            // Shift intersections slightly for mild irregularity
            x += random(-perturbAmt, perturbAmt);
            y += random(-perturbAmt, perturbAmt);

            intersections[i][j] = createVector(x, y);
        }
    }

    // Create pieces using these intersections
    for (let i = 0; i < p1_cols; i++) {
        for (let j = 0; j < p1_rows; j++) {
            let tl = intersections[i][j];
            let tr = intersections[i + 1][j];
            let br = intersections[i + 1][j + 1];
            let bl = intersections[i][j + 1];
            let localVerts = [
                { x: 0, y: 0 },
                { x: tr.x - tl.x, y: tr.y - tl.y },
                { x: br.x - tl.x, y: br.y - tl.y },
                { x: bl.x - tl.x, y: bl.y - tl.y }
            ];
            puzzlePieces.push({
                localVerts,
                idealPos: tl.copy(), // final position in puzzle area
                pos: tl.copy(),
                c: color(random(50, 255), random(50, 255), random(50, 255)),
                rot: 0,        // current rotation
                targetRot: 0,  // target rotation for animation
                idealRot: 0
            });
        }
    }
}

// Scatter pieces into the side tray
function scatterPieces() {
    for (let piece of puzzlePieces) {
        piece.pos = createVector(random(trayX_min, trayX_max), random(trayY_min, trayY_max));
        // Randomize rotation to one of the discrete steps
        piece.rot = floor(random(0, orientationCount)) * rotationStep;
        piece.targetRot = piece.rot;
    }
}

function resetPuzzle() {
    gameResult = "";
    scatterPieces();
}

function checkSolutionAuto() {
    let allCorrect = true;
    for (let piece of puzzlePieces) {
        let d = dist(piece.pos.x, piece.pos.y, piece.idealPos.x, piece.idealPos.y);
        let r = angleDiff(piece.rot, piece.idealRot);
        if (d > pieceThreshold || r > rotationThreshold) {
            allCorrect = false;
            break;
        }
    }
    if (allCorrect) {
        gameResult = "Puzzle Solved!";
    }
}

function drawPiece(piece, highlight) {
    push();
    translate(piece.pos.x, piece.pos.y);
    rotate(radians(piece.rot));
    if (highlight) {
        stroke(255, 0, 0);
        strokeWeight(3);
    } else {
        noStroke();
    }
    fill(piece.c);
    beginShape();
    for (let v of piece.localVerts) {
        vertex(v.x, v.y);
    }
    endShape(CLOSE);
    pop();
}

function drawDottedOutline(vertices, offsetX, offsetY, outlineRot, col) {
    push();
    translate(offsetX, offsetY);
    rotate(radians(outlineRot));
    drawingContext.setLineDash([5, 5]);
    stroke(col);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let v of vertices) {
        vertex(v.x, v.y);
    }
    endShape(CLOSE);
    drawingContext.setLineDash([]);
    pop();
}

function mousePressed() {
    if (gameResult !== "") return;
    for (let i = puzzlePieces.length - 1; i >= 0; i--) {
        let piece = puzzlePieces[i];
        if (pointInPolygon(createVector(mouseX, mouseY), getGlobalVerts(piece))) {
            selectedPieceIndex = i;
            dragOffset = createVector(mouseX - piece.pos.x, mouseY - piece.pos.y);
            return;
        }
    }
}

function mouseDragged() {
    if (selectedPieceIndex !== null && gameResult === "") {
        let piece = puzzlePieces[selectedPieceIndex];
        piece.pos.x = mouseX - dragOffset.x;
        piece.pos.y = mouseY - dragOffset.y;
    }
}

function mouseReleased() {
    // Keep selection for rotation
}

function keyPressed() {
    if (selectedPieceIndex !== null && gameResult === "") {
        let piece = puzzlePieces[selectedPieceIndex];
        if (key === 'u' || key === 'U') {
            piece.targetRot = (piece.targetRot + rotationStep) % 360;
        } else if (key === 'd' || key === 'D') {
            piece.targetRot = (piece.targetRot - rotationStep + 360) % 360;
        }
    }
}

// Smoothly animate piece rotation
function updateRotation(piece) {
    if (piece.rot !== piece.targetRot) {
        let diff = (piece.targetRot - piece.rot + 360) % 360;
        if (diff > 180) {
            // Rotate negatively
            let negDiff = 360 - diff;
            if (negDiff < rotationAnimStep) {
                piece.rot = piece.targetRot;
            } else {
                piece.rot = (piece.rot - rotationAnimStep + 360) % 360;
            }
        } else {
            // Rotate positively
            if (diff < rotationAnimStep) {
                piece.rot = piece.targetRot;
            } else {
                piece.rot = (piece.rot + rotationAnimStep) % 360;
            }
        }
    }
}

function getGlobalVerts(piece) {
    let verts = [];
    let angle = radians(piece.rot);
    for (let v of piece.localVerts) {
        let rx = v.x * cos(angle) - v.y * sin(angle);
        let ry = v.x * sin(angle) + v.y * cos(angle);
        verts.push(createVector(rx + piece.pos.x, ry + piece.pos.y));
    }
    return verts;
}

function pointInPolygon(pt, polygon) {
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

function angleDiff(a: number, b: number) {
    let diff = Math.abs(a - b) % 360;
    return diff > 180 ? 360 - diff : diff;
}

}
