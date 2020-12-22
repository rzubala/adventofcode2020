import { FileReader } from "../common";

enum Side {
  UP,
  RIGHT,
  DOWN,
  LEFT  
}
const sides = [Side.UP, Side.RIGHT, Side.DOWN, Side.LEFT]

interface SideMap {
  [key: string]: number
}

class Tile {
  grid: Array<Array<string>> = [];
  size = 10;
  id: number;
  neighbours: SideMap = {};
  oriented: boolean = false;
  constructor(id: number) {
    this.id = id;
  }
  addRow = (line: string) => {
    const row: string[] = [];
    line.split("").forEach((e) => row.push(e));
    this.grid.push(row);
  };
  edge = (side: Side): string[] => getEdge(this.grid, side)
  
  debug = () => console.log(this.id, ":", Object.keys(this.neighbours).length, this.neighbours, this.oriented)

  printGrid = () => {
    console.log("***", this.id, "***");
    this.grid.forEach((l) => console.log(l.join("")));
    console.log()
  };
}

const isMatch = (e1: string[], e2: string[]): boolean => {  
  for (let i=0;i<e1.length;i++) {
    if (e1[i] !== e2[i]){
      return false
    }
  }
  return true
}

const getEdge = (grid: Array<Array<string>>, side: Side): string[] => {
  const size = grid.length
  const res: string[] = [];
  for (let i of Array.from({ length: size }, (v, k) => k)) {
    switch (side) {
      case Side.UP:
        res.push(grid[0][i]);
        break;
      case Side.DOWN:
        res.push(grid[size - 1][i]);
        break;
      case Side.LEFT:
        res.push(grid[i][0]);
        break;
      case Side.RIGHT:
        res.push(grid[i][size - 1]);
        break;
    }
  }
  return res;
}

const flipH = (input: Array<Array<string>>): Array<Array<string>> => {
  const res: Array<Array<string>> = [];
  const len = input.length;
  for (let y of Array.from({ length: len }, (v, k) => k)) {
    const row: string[] = [];
    for (let x of Array.from({ length: len }, (v, k) => k)) {
      row.push(input[y][len - 1 - x]);
    }
    res.push(row);
  }
  return res;
};

const flipV = (input: Array<Array<string>>): Array<Array<string>> => {
  const res: Array<Array<string>> = [];
  const len = input.length;
  for (let y of Array.from({ length: len }, (v, k) => k)) {
    const row: string[] = [];
    for (let x of Array.from({ length: len }, (v, k) => k)) {
      row.push(input[len - 1 - y][x]);
    }
    res.push(row);
  }
  return res;
};

const rotateRight = (input: Array<Array<string>>): Array<Array<string>> => {
  const res: Array<Array<string>> = [];
  const len = input.length;
  for (let y of Array.from({ length: len }, (v, k) => k)) {
    const row: string[] = [];
    for (let x of Array.from({ length: len }, (v, k) => k)) {
      row.push(input[len - 1 - x][y]);
    }
    res.push(row);
  }
  return res;
};

class Solve20 extends FileReader {
  private tiles: Tile[] = [];

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");
      let tile: Tile | undefined;
      for (let line of rawData.split("\n")) {
        if (line.trim().length === 0) {
          tile = undefined;
          continue;
        }
        const regex: RegExp = /Tile (\d+):/;
        const match: RegExpExecArray | null = regex.exec(line);
        if (match != null) {
          tile = new Tile(+match[1]);
          this.tiles.push(tile);
        } else {
          if (!tile) {
            throw new Error("something went wrong");
          }
          tile.addRow(line);
        }
      }
    } catch (ex) {
      console.log(ex);
      throw ex;
    }
  };

  run = async () => {
    await this.init();
    this.process();
  };

  private process = () => {
      const start = this.tiles[0]
      const queue: Tile[] = []
      queue.push(start)
      while (queue.length > 0) {
        const tile = queue.pop()
        const others = this.tiles.filter(t => {
          return t.id !== tile!.id && Object.keys(tile!.neighbours).length < 4
        })
        let cnt = 0
        for (let tilej of others) {
          for (let tmp of sides) {
            if (tile!.oriented && tilej.oriented) {
              if (this.matchOriented(tile!, tilej)) {
                queue.push(tilej)
                cnt++
              }
            } else {
              if (tilej.oriented) {
                if (this.match(tilej, tile!)) {
                  queue.push(tilej)
                  cnt++
                }
              } else {
                if (this.match(tile!, tilej)) {
                  queue.push(tilej)
                  cnt++
                }
              }
            }
          }
          if (cnt === 4) {
            break
          }
        }
      }
      const corners = this.tiles.filter(t => Object.keys(t.neighbours).length === 2)
      console.log(corners.map(c => c.id).reduce((a,v) => {return a *= v}, 1))
  };

  private matchOriented = (tile1: Tile, tile2: Tile): boolean => {
    for (let side1 of sides) {
      if (tile1.neighbours[side1]) {
        continue
      }      
      const side2 = (side1 + 2) % 4
      if (tile2.neighbours[side2]) {
        continue
      }
      const edge1 = tile1.edge(side1)
      const edge2 = tile2.edge(side2)
      if (isMatch(edge1, edge2)) {        
        this.markMatch(tile1, tile2, side1, side2)
        return true
      }
    }
    return false
  }

  private match = (tile1: Tile, tile2: Tile): boolean => {
    for (let side1 of sides) {
      if (tile1.neighbours[side1]) {
        continue
      }
      const edge1 = tile1.edge(side1)
      const side2 = (side1 + 2) % 4;
      let grid2 = tile2.grid
      let found = this.tryMatch(edge1, grid2, side2)
      if (found) {
        tile2.grid = found
        this.markMatch(tile1, tile2, side1, side2)
        return true
      }

      grid2 = flipH(tile2.grid)
      found = this.tryMatch(edge1, grid2, side2)
      if (found) {
        tile2.grid = found
        this.markMatch(tile1, tile2, side1, side2)
        return true
      }

      grid2 = flipV(tile2.grid)
      found = this.tryMatch(edge1, grid2, side2)
      if (found) {
        tile2.grid = found
        this.markMatch(tile1, tile2, side1, side2)
        return true
      }      
    }
    return false
  }

  private tryMatch = (edge: string[], grid: Array<Array<string>>, side: Side): Array<Array<string>> | undefined => {
    for (let tmp of sides) {
      if (isMatch(edge, getEdge(grid, side))) {
        return grid
      }
      grid = rotateRight(grid)
    }
    return undefined
  }

  private markMatch = (tile1: Tile, tile2: Tile, side1: Side, side2: Side) => {
    tile1.oriented = true
    tile2.oriented = true
    tile1.neighbours[side1] = tile2.id
    tile2.neighbours[side2] = tile1.id
  }
}

new Solve20().run();
