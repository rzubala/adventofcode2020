import { FileReader } from "../common";

interface Point {
  x: number,
  y: number
}

class Solve11 extends FileReader {

  private seats: Array<Array<string>> = []
  private width = 0
  private height = 0

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");     
      rawData.split('\n').forEach(line => {
        const row: Array<string> = []
        line.split('').forEach(p => {
          row.push(p)  
        });
        this.seats.push(row)
      });
      this.height = this.seats.length
      this.width = this.seats[0].length
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
    let seats = this.copy(this.seats)
    while(true) {
      let changed = 0      
      let newSeats = []
      for (let y=0;y<this.height;y++) {
        const newRow = []
        for (let x=0;x<this.width;x++) {        
         switch(seats[y][x]) {
           case 'L':
             const cntL = this.countOccupied(seats, x, y, mode)
             if (cntL === 0) {
               newRow[x] = '#'
               changed++
             } else {
               newRow[x] = 'L'
             }
             break
            case '.':
              newRow[x] = '.'
              break
            case '#':
              const cntO = this.countOccupied(seats, x, y, mode)
              if (cntO >= others) {
                newRow[x] = 'L'
                changed++
              } else {
                newRow[x] = '#'
              }
              break
            default:
              throw new Error('Something went wrong')  
         }         
        }
        newSeats.push(newRow)         
      }
      if (changed === 0) {
        console.log(this.count(seats, '#'))
        break
      }
      changed = 0
      seats = this.copy(newSeats)
    }
  };

  private count = (seats: Array<Array<string>>, symbol: string): number => {
    let res = 0
    seats.forEach(row => {
      res += row.filter(p => p === symbol).length 
    })
    return res
  }

  private copy = (seats: Array<Array<string>>): Array<Array<string>> => {
    return seats.map(row => row.slice(0, this.width))    
  }

  private countOccupied = (seats: Array<Array<string>>, x: number, y: number, mode: boolean): number => {
    if (mode === true) {
      return this.countExtended(seats, x, y)
    } else {
      return this.countBasic(seats, x, y)
    }
  }

  private left: (x:number, y: number) => Point = (x: number, y: number): Point => {
    return {x: x-1, y}
  }
  private right: (x:number, y: number) => Point = (x: number, y: number): Point => {
    return {x: x+1, y}
  }
  private up: (x:number, y: number) => Point = (x: number, y: number): Point => {
    return {x, y: y-1}
  }
  private down: (x:number, y: number) => Point = (x: number, y: number): Point => {
    return {x, y: y+1}
  }
  private upleft: (x:number, y: number) => Point = (x: number, y: number): Point => {
    return {x: x-1, y: y-1}
  }
  private upright: (x:number, y: number) => Point = (x: number, y: number): Point => {
    return {x: x+1, y: y-1}
  }  
  private downleft: (x:number, y: number) => Point = (x: number, y: number): Point => {
    return {x: x-1, y: y+1}
  }
  private downright: (x:number, y: number) => Point = (x: number, y: number): Point => {
    return {x: x+1, y: y+1}
  }

  private countExtended = (seats: Array<Array<string>>, x: number, y: number): number => {
    let sum = 0
    const ops: ((x:number, y: number) => Point)[] = []
    ops.push(this.left)
    ops.push(this.right)
    ops.push(this.up)
    ops.push(this.down)
    ops.push(this.upleft)
    ops.push(this.upright)
    ops.push(this.downleft)
    ops.push(this.downright)

    for (let op of ops) {
      let xi = x
      let yi = y
      while(true) {
        const p = op(xi, yi)
        xi = p.x
        yi = p.y      
        if (this.isNotValid(xi, yi) || seats[yi][xi] === 'L') {
          break
        }
        if (seats[yi][xi] === '#') {
          sum++
          break
        }
      }
    }
    return sum
  }

  private countBasic = (seats: Array<Array<string>>, x: number, y: number): number => {
    const n = this.getNeighbours(x, y)
    let cnt = 0
    for (let p of n) {
      if (seats[p.y][p.x] === '#') {
        cnt++
      }
    }
    return cnt
  }

  private getNeighbours = (x: number, y: number): Point[] => {
    const points: Point[] = []   
    for (let xi=x-1;xi<=x+1;xi++) {
      for (let yi=y-1;yi<=y+1;yi++) {
        if (xi===x && yi===y) {
          continue
        }
        this.tryAdd(xi, yi, points)
      }
    }
    return points
  }

  private isNotValid = (x: number, y: number): boolean => {
    return x < 0 || y < 0 || x >= this.width || y >= this.height;
  }

  private tryAdd = (x: number, y: number, points: Point[]) => {
    if (this.isNotValid(x, y)) {
      return
    }
    points.push({x, y})
  }
}

new Solve11().run();
