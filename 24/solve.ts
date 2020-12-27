import { FileReader } from "../common";

enum Side {
  e,
  w,
  sw,
  se,
  nw,
  ne,
}
const sides: string[] = Object.values(Side).filter(
  (value) => typeof value === "string"
) as string[];

const toSide = (name: string): Side => {
  if (name === Side[Side.e]) {
    return Side.e;
  } else if (name === Side[Side.w]) {
    return Side.w;
  } else if (name === Side[Side.nw]) {
    return Side.nw;
  } else if (name === Side[Side.ne]) {
    return Side.ne;
  } else if (name === Side[Side.se]) {
    return Side.se;
  } else if (name === Side[Side.sw]) {
    return Side.sw;
  }
  throw new Error('not handled: ' + name)
};

interface Point {
  x: number;
  y: number;
  z: number;
}
const equals = (p1: Point, p2: Point): boolean => p1.x === p2.x && p1.y === p2.y && p1.z === p2.z
const pointKey = (p: Point) => `${p.x}-${p.y}-${p.z}`
interface GridMap {
  [point: string]: boolean
}

const e = (p: Point): Point => {
  return { x: p.x + 1, y: p.y - 1, z: p.z };
};
const w = (p: Point): Point => {
  return { x: p.x - 1, y: p.y + 1, z: p.z };
};
const sw = (p: Point): Point => {
  return { x: p.x - 1, y: p.y, z: p.z + 1 };
};
const se = (p: Point): Point => {
  return { x: p.x, y: p.y - 1, z: p.z + 1 };
};
const nw = (p: Point): Point => {
  return { x: p.x, y: p.y + 1, z: p.z - 1 };
};
const ne = (p: Point): Point => {
  return { x: p.x + 1, y: p.y, z: p.z - 1 };
};

interface MoveMap {
  [dir: string]: (p: Point) => Point;
}
const moves: MoveMap = {};
moves[Side.e] = e;
moves[Side.w] = w;
moves[Side.ne] = ne;
moves[Side.nw] = nw;
moves[Side.se] = se;
moves[Side.sw] = sw;

const move = (point: Point, dir: Side): Point => moves[dir](point);

class Solve24 extends FileReader {
  private lines: Side[][] = [];
  private grid: GridMap = {}

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");
      const rows = rawData.split("\n");
      for (let row of rows) {
        const line: Side[] = [];
        const len = row.length;
        let pointer = 0;
        while (pointer < len) {
          const ins1 = row[pointer];
          if (sides.includes(ins1)) {
            line.push(toSide(ins1));
            pointer++;
            continue;
          }
          let ins2: string = row.slice(pointer, pointer + 2);
          if (sides.includes(ins2)) {
            line.push(toSide(ins2));
            pointer = pointer + 2;
            continue;
          }
          throw new Error('not supported instruction: ' + ins1 + " " + ins2)
        }
        this.lines.push(line);
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
    let points: Point[] = []
    for (let line of this.lines) {
      let point: Point = {x:0,y:0,z:0}
      for (let ins of line) {
        point = move(point, ins)
      }
      const val = (this.grid[pointKey(point)] || false)
      this.grid[pointKey(point)] = !val
      points.push(point)
    }
    console.log('part 1')
    console.log(Object.values(this.grid).filter(v => v).length)    
    
    console.log('part 2')
    for (let d=0;d<100;d++) {
      points.push(...this.addNeighbours(points))

      const toWhite: Point[] = []
      const toBlack: Point[] = []      

      for (let point of points) {

        const blackNeighbours = this.countBlack(point)
        const val = this.grid[pointKey(point)] || false

        if (val && (blackNeighbours === 0 || blackNeighbours > 2)) {
          toWhite.push(point)
        } else if (!val && blackNeighbours === 2) {
          toBlack.push(point)
        }        
      }

      for (let w of toWhite) {
        this.grid[pointKey(w)] = false
      }
      for (let b of toBlack) {
        this.grid[pointKey(b)] = true
      }

      console.log('day ', d + 1)
      console.log(Object.values(this.grid).filter(v => v).length)
    }
  };

  private addNeighbours = (points: Point[]): Point[] => {
    const result: Point[] = []
    const resultHash: Set<String> = new Set()
    for (let black of points) {
      const val = this.grid[pointKey(black)] || false
      if (!val) {
        continue
      }
      
      
      for (let dir of Object.values(moves)) {
        const whiteNeigh = dir(black)
        if (resultHash.has(pointKey(whiteNeigh))) {
          continue
        }
        let foundOtherBlack = false
        for (let dirw of Object.values(moves)) {
          const whiteNeighNeigh = dirw(whiteNeigh)
          if (equals(whiteNeighNeigh, black)) {
            continue
          }
          if (this.grid[pointKey(whiteNeighNeigh)] === true) {
            foundOtherBlack = true
            break
          }
        }
        if (foundOtherBlack) {
          result.push(whiteNeigh)
          resultHash.add(pointKey(whiteNeigh))
        }
      }
    }
    return result;
  }

  private countBlack = (point: Point): number => {
    let cnt = 0
    for (let dir of Object.values(moves)) {
      const n = dir(point)
      cnt += (this.grid[pointKey(n)] || false) ? 1 : 0
    }
    return cnt
  }  
}

new Solve24().run();
