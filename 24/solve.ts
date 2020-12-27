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
    for (let line of this.lines) {
      let point: Point = {x:0,y:0,z:0}
      for (let ins of line) {
        point = move(point, ins)
      }
      const val = (this.grid[pointKey(point)] || false)
      this.grid[pointKey(point)] = !val
      console.log('set', point, !val)
    }
    console.log(Object.values(this.grid).filter(v => v).length)
  };
}

new Solve24().run();
