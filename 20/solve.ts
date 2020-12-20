import { FileReader } from "../common";

enum Side {
  UP,
  LEFT,
  DOWN,
  RIGHT,
}

class Tile {
  grid: Array<Array<string>> = [];
  size = 10;
  id: number;
  neighbours: number[] = [];
  processed: boolean = false;
  constructor(id: number) {
    this.id = id;
  }
  addRow = (line: string) => {
    const row: string[] = [];
    line.split("").forEach((e) => row.push(e));
    this.grid.push(row);
  };  
  printGrid = () => {
      console.log('***', this.id, '***')
      this.grid.forEach(l => console.log(l.join('')))
  }
}

const flip = (input: Array<Array<string>>): Array<Array<string>> => {
    const res: Array<Array<string>> = [];
    const len = input.length
    for (let y of Array.from({length: len}, (v,k) => k)) {
        const row: string[] = [];
        for (let x of Array.from({length: len }, (v,k) => k)) {
            row.push(input[y][len - 1 - x])
        }
        res.push(row)
    }
    return res
}

const rotateRight = (input: Array<Array<string>>): Array<Array<string>> => {
    const res: Array<Array<string>> = [];
    const len = input.length
    for (let y of Array.from({length: len}, (v,k) => k)) {
        const row: string[] = [];
        for (let x of Array.from({length: len }, (v,k) => k)) {
            row.push(input[len - 1 - x][y])
        }
        res.push(row)
    }
    return res
}

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
          tile.addRow(line)
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

  };
}

new Solve20().run();
