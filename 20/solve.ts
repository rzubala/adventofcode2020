import { FileReader } from "../common";

enum Side {
  UP,
  RIGHT,
  DOWN,
  LEFT  
}
const sides = [Side.UP, Side.RIGHT, Side.DOWN, Side.LEFT]

const size = 10

interface SideMap {
  [key: string]: number
}

class Tile {
  grid: Array<Array<string>> = [];  
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

const flipHMonster = (input: Array<Array<boolean>>): Array<Array<boolean>> => {
  const res: Array<Array<boolean>> = [];
  const height = input.length
  const width = input[0].length
  for (let y=0;y<input.length;y++) {
    const row: boolean[] = [];
    for (let x=0;x<input[0].length;x++) {
      row.push(input[y][width - 1 - x]);
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

const flipVMonster = (input: Array<Array<boolean>>): Array<Array<boolean>> => {
  const res: Array<Array<boolean>> = [];
  const height = input.length
  for (let y=0;y<input.length;y++) {
    const row: boolean[] = [];
    for (let x=0;x<input[0].length;x++) {
      row.push(input[height - 1 - y][x]);
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

const rotateRightMonster = (input: Array<Array<boolean>>): Array<Array<boolean>> => {
  const res: Array<Array<boolean>> = [];
  const width = input[0].length
  const height = input.length
  for (let x=0;x<width;x++) {  
    const row: boolean[] = [];
    for (let y=0;y<height;y++) {  
      row.push(input[height - 1 - y][x]);
    }
    res.push(row);
  }
  return res;
};

class Solve20 extends FileReader {
  private monster: Array<Array<boolean>> = []
  private tiles: Tile[] = [];
  private tileSpace: number = 0
  private map: Array<Array<boolean>> = []

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
      this.tileSpace = (size - 2)*Math.sqrt(this.tiles.length)
      this.map = new Array(this.tileSpace).fill(false).map(() => new Array(this.tileSpace).fill(false));

      const monsterData = await this.readData("monster.data")
      for (let line of monsterData.split('\n')) {
        const row = []
        for (let e of line.split('').map((e: string) => e === '#' ? true : false)) {
          row.push(e)
        }
        this.monster.push(row)
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
        if (Object.keys(tile!.neighbours).length === 4) {
          continue
        }
        const others = this.tiles.filter(t => {
          return t.id !== tile!.id && Object.keys(tile!.neighbours).length < 4
        })
        let cnt = Object.keys(tile!.neighbours).length
        for (let tilej of others) {
          for (let _ of sides) {
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
      const leftUpper = corners.filter(t => !t.neighbours[Side.LEFT] && !t.neighbours[Side.UP])[0]
      console.log(corners.map(c => c.id).reduce((a,v) => {return a *= v}, 1))

      this.createMap(leftUpper)      
  };

  private createMap = (start: Tile) => {
    let iter: Tile = start
    let side: Tile  = start
    let x = 0
    let y = 0
    while (true) {
      x = 0
      while (true) {
        this.fillMap(iter, x, y)
        const tmp = this.getTitle(iter.neighbours[Side.RIGHT])
        if (!tmp) {
          break
        }
        iter = tmp
        x++        
      }
      const tmp = this.getTitle(side.neighbours[Side.DOWN])
      if (!tmp) {
        break
      }
      side = tmp
      iter = side
      y++
    }
        
    let monsterGrid = flipHMonster(this.monster)
    for (let _ of sides) {
      if (this.markMonster(monsterGrid)) {
        return
      }
      monsterGrid = rotateRightMonster(monsterGrid)
    }    

    monsterGrid = flipVMonster(this.monster)
    for (let _ of sides) {
      if (this.markMonster(monsterGrid)) {
        return
      }
      monsterGrid = rotateRightMonster(monsterGrid)
    }    

    monsterGrid = this.monster
    for (let _ of sides) {
      if (this.markMonster(monsterGrid)) {
        return
      }
      monsterGrid = rotateRightMonster(monsterGrid)
    }
  }

  private markMonster = (data: Array<Array<boolean>>): boolean => {
    const width = data[0].length
    const height = data.length
    const points: [number, number][] = [];
    data.forEach((row, i) => {
      const found = row.map((v, i) => v ? i : undefined).filter(v => v !== undefined)
      found.forEach(e => points.push([i, e!]))
    })

    let found = false
    for (let y=0;y<this.tileSpace - height;y++) {
      for (let x=0;x<this.tileSpace - width;x++) {
        if (this.isMonster(y, x, points)) {
          found = true
        }
      }
    }
    if (found) {
      console.log(this.map.reduce((a, row) => {
        a += row.filter(v => v).length
        return a
      }, 0))
    }
    return found
  }

  private isMonster = (y: number, x: number, monster: [number, number][]): boolean => {
    for (let m of monster) {
      if (!this.map[y+m[0]][x+m[1]]) {
        return false
      }
    }
    for (let m of monster) {
      this.map[y+m[0]][x+m[1]] = false
    }
    return true
  }

  private fillMap = (tile: Tile, x: number, y: number) => {
    const space = size - 2
    tile.grid.slice(1, size - 1).forEach((row, j) => {
      row.slice(1, size - 1).forEach((v, i) => {
        this.map[y*space+j][x*space+i] = v === '#' ? true : false
      })
    })
  }

  private getTitle = (id: number): Tile | undefined => this.tiles.find(t => t.id === id)

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
