/** A direction: 0=top, 1=right, 2=bottom, 3=left */
export type Direction = 0 | 1 | 2 | 3;

/**
 * A tile can be "elbow", "T", or "straight".
 * orientation is the index in the boolean[][] that describes open edges.
 */
export interface PathCell {
  tileType: "elbow" | "T" | "straight";
  orientation: number; // number of 90° clockwise rotations
}

/**
 * pathConnections[tileType][orientation] => [top, right, bottom, left] (true/false if open)
 */
export const pathConnections: Record<PathCell["tileType"], boolean[][]> = {
  elbow: [
    [true, true, false, false],  // orientation 0: opens top & right
    [false, true, true, false],  // orientation 1: opens right & bottom
    [false, false, true, true],  // orientation 2: opens bottom & left
    [true, false, false, true],  // orientation 3: opens left & top
  ],
  T: [
    [false, true, true, true],   // orientation 0: missing top
    [true, false, true, true],   // orientation 1: missing right
    [true, true, false, true],   // orientation 2: missing bottom
    [true, true, true, false],   // orientation 3: missing left
  ],
  straight: [
    [true, false, true, false],  // orientation 0: opens top & bottom
    [false, true, false, true],  // orientation 1: opens right & left
  ],
};

/** Returns the number of possible orientations for a given tile type. */
export function maxOrientation(tileType: PathCell["tileType"]): number {
  return pathConnections[tileType].length;
}

/** Returns the open edges (a boolean[4] array) for a cell’s current orientation. */
export function getOpenEdges(cell: PathCell): boolean[] {
  return pathConnections[cell.tileType][cell.orientation];
}

/** Rotates a cell 90° clockwise (wrapping around based on the tile’s max). */
export function rotateTile(cell: PathCell): void {
  cell.orientation = (cell.orientation + 1) % maxOrientation(cell.tileType);
}

/**
 * Checks if cellA and cellB connect in a given direction.
 * For example, if direction === 1 (right), then
 *   cellA must have its right edge open,
 *   cellB must have its left edge open.
 */
export function isConnected(
  cellA: PathCell,
  cellB: PathCell,
  direction: Direction
): boolean {
  const edgesA = getOpenEdges(cellA);
  const edgesB = getOpenEdges(cellB);
  const opposite = (direction + 2) % 4;
  return edgesA[direction] && edgesB[opposite];
}

/** Returns the connected neighbors of the cell at (r,c). */
export function getNeighbors(
  grid: PathCell[][],
  r: number,
  c: number
): [number, number][] {
  const neighbors: [number, number][] = [];
  const size = grid.length;
  const cell = grid[r][c];

  // Up
  if (r > 0 && isConnected(cell, grid[r - 1][c], 0)) {
    neighbors.push([r - 1, c]);
  }
  // Right
  if (c < size - 1 && isConnected(cell, grid[r][c + 1], 1)) {
    neighbors.push([r, c + 1]);
  }
  // Down
  if (r < size - 1 && isConnected(cell, grid[r + 1][c], 2)) {
    neighbors.push([r + 1, c]);
  }
  // Left
  if (c > 0 && isConnected(cell, grid[r][c - 1], 3)) {
    neighbors.push([r, c - 1]);
  }

  return neighbors;
}

/**
 * Generates a random monotonic path from (0,0) to (gridSize-1,gridSize-1)
 * using only right ("R") and down ("D") moves.
 */
export function generateRandomPath(gridSize: number): [number, number][] {
  const path: [number, number][] = [];
  let r = 0,
    c = 0;
  path.push([r, c]);

  const steps: string[] = [];
  for (let i = 0; i < gridSize - 1; i++) {
    steps.push("R", "D");
  }

  // Shuffle the steps array
  for (let i = steps.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [steps[i], steps[j]] = [steps[j], steps[i]];
  }

  // Build the coordinates by applying the shuffled steps
  for (const s of steps) {
    if (s === "R") c++;
    else if (s === "D") r++;
    path.push([r, c]);
  }

  return path;
}

/**
 * Builds a solved grid of size gridSize x gridSize, ensuring
 * the specified path has correct pieces oriented to connect
 * to the adjacent path cells.
 */
export function buildSolutionGrid(
  gridSize: number,
  path: [number, number][]
): PathCell[][] {
  const grid: PathCell[][] = [];
  const types: PathCell["tileType"][] = ["elbow", "T", "straight"];

  // 1) Fill the grid randomly at first
  for (let r = 0; r < gridSize; r++) {
    const row: PathCell[] = [];
    for (let c = 0; c < gridSize; c++) {
      const t = types[Math.floor(Math.random() * types.length)];
      const ori = Math.floor(Math.random() * maxOrientation(t));
      row.push({ tileType: t, orientation: ori });
    }
    grid.push(row);
  }

  // Helper: direction from one cell to adjacent cell
  function getDirection(from: [number, number], to: [number, number]): Direction {
    const [fr, fc] = from;
    const [tr, tc] = to;
    if (tr === fr && tc === fc + 1) return 1; // right
    if (tr === fr + 1 && tc === fc) return 2; // down
    return 0; // fallback
  }

  // 2) For each cell in the path, ensure correct piece/orientation
  for (let i = 0; i < path.length; i++) {
    const [r, c] = path[i];
    const requiredDirections: Direction[] = [];

    if (i > 0) {
      // Connect back to previous path cell
      const prev = path[i - 1];
      const dir = getDirection(prev, [r, c]);
      requiredDirections.push(((dir + 2) % 4) as Direction); // opposite edge
    }
    if (i < path.length - 1) {
      // Connect to next path cell
      const next = path[i + 1];
      const dir = getDirection([r, c], next);
      requiredDirections.push(dir);
    }

    let chosen: PathCell | null = null;
    outer: for (const t of types) {
      for (let ori = 0; ori < maxOrientation(t); ori++) {
        const edges = pathConnections[t][ori];
        let valid = true;
        for (const req of requiredDirections) {
          if (!edges[req]) {
            valid = false;
            break;
          }
        }
        if (valid) {
          chosen = { tileType: t, orientation: ori };
          break outer;
        }
      }
    }

    // Fallback if somehow none matched
    if (!chosen) {
      chosen = { tileType: "T", orientation: 0 };
    }

    grid[r][c] = chosen;
  }

  return grid;
}

/** Scrambles the grid by rotating every cell randomly. */
export function scrambleGrid(grid: PathCell[][]): void {
  const size = grid.length;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = grid[r][c];
      const rotations = Math.floor(Math.random() * maxOrientation(cell.tileType));
      for (let i = 0; i < rotations; i++) {
        rotateTile(cell);
      }
    }
  }
}

/**
 * Checks if there's a path from (sr, sc) to (er, ec) but ONLY traversing cells
 * whose coordinates are in solutionSet. This ensures only one unique path.
 */
export function isSolutionPathComplete(
  grid: PathCell[][],
  sr: number,
  sc: number,
  er: number,
  ec: number,
  solutionSet: Set<string>
): boolean {
  const size = grid.length;
  const visited: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );
  const queue: [number, number][] = [[sr, sc]];
  visited[sr][sc] = true;

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r === er && c === ec) return true;

    for (const [nr, nc] of getNeighbors(grid, r, c)) {
      if (!visited[nr][nc] && solutionSet.has(`${nr},${nc}`)) {
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }
  return false;
}
