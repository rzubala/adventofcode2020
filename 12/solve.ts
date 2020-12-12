import { FileReader } from "../common";

enum Direction {
  E,
  S,
  W,
  N,
}
interface Instruction {
  command: string;
  value: number;
}
interface Point {
  x: number,
  y: number
}

class Solve12 extends FileReader {
  private instructions: Instruction[];

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");
      this.instructions = rawData.split("\n").map((e: string) => {
        const regex: RegExp = /^(\w)(\d+)$/;
        const match: RegExpExecArray = regex.exec(e);
        return { command: match[1], value: +match[2] };
      });
    } catch (ex) {
      console.log(ex);
      throw ex;
    }
  };

  run = async () => {
    await this.init();
    this.process1();
    this.process2();
  };

  private process1 = () => {
    let dir: Direction = Direction.E;
    let point: Point = {x:0, y:0}
    for (let ins of this.instructions) {
      switch (ins.command) {
        case "E":
        case "S":
        case "W":
        case "N":
          point = this.move(point, ins.command, ins.value)
          break;
        case "L":          
        case "R":
          dir = this.turn(dir, ins.command, ins.value)
          break;
        case "F":
          point = this.move(point, Direction[dir], ins.value)
          break;
        default:
          throw new Error("something went wrong");
      }
    }
    console.log(this.dist(point))
  };
  
  private process2 = () => {    
    let point: Point = {x:0, y:0}
    let waypoint: Point = {x:10, y:-1}
    for (let ins of this.instructions) {
      switch (ins.command) {
        case "E":
        case "S":
        case "W":
        case "N":
          waypoint = this.move(waypoint, ins.command, ins.value)
          break;
        case "L":          
        case "R":
          waypoint = this.rotate(point, waypoint, ins.command, ins.value)
          break;
        case "F":
          const diff = {x: waypoint.x - point.x, y: waypoint.y - point.y}
          point = this.moveToWaypoint(point, diff, ins.value)
          waypoint = {x: point.x + diff.x, y: point.y + diff.y}
          break;
        default:
          throw new Error("something went wrong");
      }
    }
    console.log(this.dist(point))
  };

  private dist = (p: Point): number => {
    return Math.abs(p.x) + Math.abs(p.y)
  }

  private moveToWaypoint = (p: Point, d: Point, v: number): Point => {
    return {x: p.x + d.x*v, y: p.y + d.y*v}
  }

  private move = (p: Point, dir: string, v: number) => {
    if (dir === Direction[Direction.E]) {
      return {x: p.x + v, y: p.y}
    } if (dir === Direction[Direction.W]) {
      return {x: p.x - v, y: p.y}
    } else if (dir === Direction[Direction.S]) {
      return {x: p.x, y: p.y + v}
    } if (dir === Direction[Direction.N]) {
      return {x: p.x, y: p.y - v}
    }
  }

  private rotate = (p: Point, w: Point, dir: string, v: number): Point => {
    const steps = v/90
    const tmp = {x: w.x-p.x, y:w.y-p.y}
    if (steps == 2) {
      return {x: p.x-tmp.x, y: p.y-tmp.y}
    } else if (steps === 1 && dir === 'L' || steps === 3 && dir === 'R') {            
      return {x: p.x+tmp.y, y: p.y-tmp.x}      
    } else if (steps === 1 && dir === 'R' || steps === 3 && dir === 'L') {      
      return {x: p.x-tmp.y, y: p.y+tmp.x}
    }
    return p
  }

  private turn = (d: Direction, dir: string, v: number): Direction => {
    let index = d
    const steps = v/90
    if (dir === 'L') {
      index = (index + 4 - steps)%4
    } else if (dir === 'R') {
      index = (index + steps)%4
    } 
    return index
  }
}

new Solve12().run();
