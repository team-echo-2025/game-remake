export class Grid {
    total: number;
    emptyCells: Set<number>;
    OPPOSITE: Map<number, number>;
    directions: number[];
    
    constructor(total: number) {
        this.total = total;
        this.emptyCells = new Set();
        this.OPPOSITE = new Map();
        this.directions = [1, -1, 10, -10, 9, -9]; // Adjusted for hexagonal grid
        
        // Define opposite directions for bidirectional connections
        this.OPPOSITE.set(1, -1);
        this.OPPOSITE.set(-1, 1);
        this.OPPOSITE.set(10, -10);
        this.OPPOSITE.set(-10, 10);
        this.OPPOSITE.set(9, -9);
        this.OPPOSITE.set(-9, 9);
    }
    
    polygon_at(index: number): { directions: number[], tileTypes: Map<number, { isFullyConnected: boolean, isStraight: boolean }> } {
        return {
            directions: this.directions,
            tileTypes: new Map([[0, { isFullyConnected: false, isStraight: false }]])
        };
    }
    
    getDirections(tile: number, _: number, __: number): number[] {
        return this.directions;
    }
    
    find_neighbour(index: number, direction: number): { neighbour: number, empty: boolean } {
        const neighbour = index + direction;
        return {
            neighbour,
            empty: this.emptyCells.has(neighbour)
        };
    }
}

export default class GrowingTree {
    grid: Grid;
    tiles: number[];
    unvisited: Set<number>;
    visited: number[];
    avoiding: number[];
    lastResortNodes: number[];
    startComponents: Map<number, Set<number>>;
    avoidObvious: number;
    avoidStraights: number;
    
    constructor(grid: Grid, avoidObvious = 0, avoidStraights = 0) {
        this.grid = grid;
        this.avoidObvious = avoidObvious;
        this.avoidStraights = avoidStraights;
        this.tiles = new Array(grid.total).fill(0);
        this.unvisited = new Set([...Array(grid.total).keys()]);
        this.visited = [];
        this.avoiding = [];
        this.lastResortNodes = [];
        this.startComponents = new Map();
    }

    private getRandomElement<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    public generate(branchingAmount: number, startTiles:  [] = []): number[] {
        if (startTiles.length === this.grid.total) {
            this.reuseStartTiles(startTiles);
        }
        
        if (this.visited.length === 0) {
            const startIndex = this.getRandomElement(Array.from(this.unvisited));
            this.visited.push(startIndex);
            this.unvisited.delete(startIndex);
        }
        
        while (this.unvisited.size > 0) {
            let fromNode: number | undefined;
            const usePrims = Math.random() < branchingAmount;
            
            for (let nodes of [this.visited, this.avoiding, this.lastResortNodes]) {
                if (nodes.length > 0) {
                    fromNode = usePrims ? this.getRandomElement(nodes) : nodes[nodes.length - 1];
                    break;
                }
            }
            if (fromNode === undefined) throw new Error("Error: fromNode is undefined");
            
            const options = this.getNeighbors(fromNode);
            let toVisit = this.chooseBestOption(options);
            
            if (!toVisit) {
                this.handleDeadEnd(fromNode, usePrims);
                continue;
            }
            
            this.tiles[fromNode] += toVisit.direction;
            this.tiles[toVisit.neighbour] += this.grid.OPPOSITE.get(toVisit.direction) ?? 0;
            this.unvisited.delete(toVisit.neighbour);
            this.visited.push(toVisit.neighbour);
        }
        console.log("I did things", this.tiles);
        return this.tiles;
    }

    private getNeighbors(fromNode: number) {
        const polygon = this.grid.polygon_at(fromNode);
        const connections = this.tiles[fromNode];
        
        const unvisitedNeighbors: { neighbour: number; direction: number }[] = [];
        
        for (let direction of polygon.directions) {
            if ((direction & connections) > 0) continue;
            
            const { neighbour, empty } = this.grid.find_neighbour(fromNode, direction);
            if (empty || !this.unvisited.has(neighbour)) continue;
            
            unvisitedNeighbors.push({ neighbour, direction });
        }
        return unvisitedNeighbors;
    }

    private chooseBestOption(options: { neighbour: number; direction: number }[]): { neighbour: number; direction: number } | null {
        if (options.length === 0) return null;
        return this.getRandomElement(options);
    }
    
    private handleDeadEnd(fromNode: number, usePrims: boolean) {
        const array = [this.visited, this.avoiding, this.lastResortNodes].find(arr => arr.length > 0) || [];
        if (usePrims) {
            const index = array.indexOf(fromNode);
            if (index !== -1) array.splice(index, 1);
        } else {
            array.pop();
        }
    }

    private reuseStartTiles(startTiles: number[]) {
        // Implement logic to reuse predefined tile portions
    }
}
