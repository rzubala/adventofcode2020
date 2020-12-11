import { FileReader } from "../common";

interface Point {
  x: number;
  y: number;
}

class Solve11 extends FileReader {
  private seats: Array<Array<string>> = [];
  private width = 0;
  private height = 0;

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");
      rawData.split("\n").forEach((line) => {
        const row: Array<string> = [];
        line.split("").forEach((p) => {
          row.push(p);
        });
        this.seats.push(row);
      });
      this.height = this.seats.length;
      this.width = this.seats[0].length;
    } catch (ex) {
      console.log(ex);
      throw ex;
    }
  };

  run = async () => {
    await this.init();
    this.process(4, false);
    this.process(5, true);
  };

  private process = (others: number, mode: boolean) => {
    let seats = this.copy(this.seats);
    while (true) {
      let changed = 0;
      let newSeats = [];
      for (let y = 0; y < this.height; y++) {
        const newRow = [];
        for (let x = 0; x < this.width; x++) {
          const val = seats[y][x];
          newRow.push(val);
          switch (val) {
            case ".":
              break;
            case "L":
              const cntL = this.countOccupied(seats, x, y, mode);
              if (cntL === 0) {
                newRow[x] = "#";
                changed++;
              }
              break;
            case "#":
              const cntO = this.countOccupied(seats, x, y, mode);
              if (cntO >= others) {
                newRow[x] = "L";
                changed++;
              }
              break;
            default:
              throw new Error("Something went wrong");
          }
        }
        newSeats.push(newRow);
      }
      if (changed === 0) {
        console.log(this.count(seats, "#"));
        break;
      }
      changed = 0;
      seats = this.copy(newSeats);
    }
  };

  private count = (seats: Array<Array<string>>, symbol: string): number => {
    return seats.reduce((acc, row) => {
      acc += row.filter((p) => p === symbol).length;
      return acc;
    }, 0);
  };

  private countOccupied = (
    seats: Array<Array<string>>,
    x: number,
    y: number,
    mode: boolean
  ): number => {
    return this.countExtended(seats, x, y, !mode);
  };

  private countExtended = (
    seats: Array<Array<string>>,
    x: number,
    y: number,
    single: boolean
  ): number => {
    let sum = 0;
    const ops: ((x: number, y: number) => Point)[] = [];
    ops.push(this.left);
    ops.push(this.right);
    ops.push(this.up);
    ops.push(this.down);
    ops.push(this.upleft);
    ops.push(this.upright);
    ops.push(this.downleft);
    ops.push(this.downright);

    for (let op of ops) {
      let xi = x;
      let yi = y;
      while (true) {
        const p = op(xi, yi);
        xi = p.x;
        yi = p.y;
        if (this.isNotValid(xi, yi) || seats[yi][xi] === "L") {
          break;
        }
        if (seats[yi][xi] === "#") {
          sum++;
          break;
        }
        if (single) {
          break
        }
      }
    }
    return sum;
  };

  private left: (x: number, y: number) => Point = (
    x: number,
    y: number
  ): Point => {
    return { x: x - 1, y };
  };
  private right: (x: number, y: number) => Point = (
    x: number,
    y: number
  ): Point => {
    return { x: x + 1, y };
  };
  private up: (x: number, y: number) => Point = (
    x: number,
    y: number
  ): Point => {
    return { x, y: y - 1 };
  };
  private down: (x: number, y: number) => Point = (
    x: number,
    y: number
  ): Point => {
    return { x, y: y + 1 };
  };
  private upleft: (x: number, y: number) => Point = (
    x: number,
    y: number
  ): Point => {
    return { x: x - 1, y: y - 1 };
  };
  private upright: (x: number, y: number) => Point = (
    x: number,
    y: number
  ): Point => {
    return { x: x + 1, y: y - 1 };
  };
  private downleft: (x: number, y: number) => Point = (
    x: number,
    y: number
  ): Point => {
    return { x: x - 1, y: y + 1 };
  };
  private downright: (x: number, y: number) => Point = (
    x: number,
    y: number
  ): Point => {
    return { x: x + 1, y: y + 1 };
  };

  private isNotValid = (x: number, y: number): boolean => {
    return x < 0 || y < 0 || x >= this.width || y >= this.height;
  };

  private copy = (seats: Array<Array<string>>): Array<Array<string>> => {
    return seats.map((row) => row.slice(0, this.width));
  };
}

new Solve11().run();
