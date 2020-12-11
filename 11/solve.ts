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
    this.process();
  };

  private process = () => {        
    let seats = this.copy(this.seats)
    while(true) {
      //this.print(seats)
      let changed = 0      
      let newSeats = []
      for (let y=0;y<this.height;y++) {
        const newRow = []
        for (let x=0;x<this.width;x++) {        
         switch(seats[y][x]) {
           case 'L':
             const cntL = this.countOccupied(seats, x, y)
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
              const cntO = this.countOccupied(seats, x, y)
              if (cntO >= 4) {
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
      //console.log(changed)
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

  private print = (seats: Array<Array<string>>) => {
    console.log('\n')
    seats.forEach(r => console.log(r.join('')))
    console.log('\n')
  }

  private copy = (seats: Array<Array<string>>): Array<Array<string>> => {
    const result: Array<Array<string>> = []
    seats.forEach(row => {
      const newRow = []
      row.forEach(p => {
        newRow.push(p)
      })
      result.push(newRow)
    })
    return result;
  }

  private countOccupied = (seats: Array<Array<string>>, x: number, y: number): number => {
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

  private tryAdd = (x: number, y: number, points: Point[]) => {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return
    }
    points.push({x, y})
  }
}

new Solve11().run();
