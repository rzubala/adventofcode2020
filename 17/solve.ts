import { FileReader } from "../common";

interface Point {
  x: number
  y: number
  z: number
  w: number
}

const asIndex = (p: Point): string => `${p.x}_${p.y}_${p.z}_${p.w}`

interface PointMap {
  [point: string]: number;
}

class Grid {
  grid: PointMap = {}
  minX = 0
  maxX = 0
  minY = 0
  maxY = 0
  minZ = 0
  maxZ = 0
  minW = 0
  maxW = 0
  addValue = (point: Point, value: number) => {
    this.grid[asIndex(point)] = value
    this.minX = Math.min(this.minX, point.x)
    this.maxX = Math.max(this.maxX, point.x)
    this.minY = Math.min(this.minY, point.y)
    this.maxY = Math.max(this.maxY, point.y)
    this.minZ = Math.min(this.minZ, point.z)
    this.maxZ = Math.max(this.maxZ, point.z)
    this.minW = Math.min(this.minW, point.w)
    this.maxW = Math.max(this.maxW, point.w)
  }
  getValue = (point: Point): number => {
    return (this.grid[asIndex(point)] || 0)
  }
  xrange = (offset: number = 0): number[] => Array.from({length: this.maxX - this.minX + 1 + 2 * offset}, (i, v) => this.minX - offset + v)
  yrange = (offset: number = 0): number[] => Array.from({length: this.maxY - this.minY + 1 + 2 * offset}, (i, v) => this.minY - offset + v)
  zrange = (offset: number = 0): number[] => Array.from({length: this.maxZ - this.minZ + 1 + 2 * offset}, (i, v) => this.minZ - offset + v)
  wrange = (offset: number = 0): number[] => Array.from({length: this.maxW - this.minW + 1 + 2 * offset}, (i, v) => this.minW - offset + v)

  count = (): number => {
    return Object.values(this.grid).reduce((a, v) => {
      return a + v
    }, 0)
  }

  countNeighbours = (p: Point): number => {
    let sum = 0
    for (let w=p.w-1;w<=p.w+1;w++) {
      for (let z=p.z-1;z<=p.z+1;z++) {
        for (let y=p.y-1;y<=p.y+1;y++) {
          for (let x=p.x-1;x<=p.x+1;x++) {
            if (x===p.x && y===p.y && z===p.z && w===p.w) {
              continue
            }
            sum += this.getValue({x,y,z,w});
          }
        }
      }
    }
    return sum
  }
}

class Solve17 extends FileReader {
  private pocket: Array<Array<Array<number>>> = [];
  private grid = new Grid();

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");
      const w = 0, z = 0
      let y = 0
      for (let line of rawData.split('\n')) {
        let x = 0
        for (let p of line.split('')) {
          const v = p === '#' ? 1 : 0
          const point: Point = {x,y,z,w}
          this.grid.addValue(point, v)
          x++
        }
        y++
      }
    } catch (ex) {
      console.log(ex);
      throw ex;
    }
  };

  run = async () => {
    await this.init();
    this.process(false);
    this.process(true);
  };

  private process = (hasW: boolean) => {
    let cycles = Array.from({length: 6}, (v,k) => k)    
    let grid = this.grid
    let wrange = [0]
    cycles.forEach(c => {
      const nextGrid = new Grid()
      if (hasW) {
        wrange = grid.wrange(1)
      }
      for (let w of wrange) {
        for (let z of grid.zrange(1)) {
          for (let y of grid.yrange(1)) {
            for (let x of grid.xrange(1)) {
              const cnt = grid.countNeighbours({x, y, z, w})
              const curVal = grid.getValue({x,y,z, w})
              let nextVal = 0
              if (curVal && (cnt === 2 || cnt ===3)) {
                nextVal = 1
              } else if (!curVal && cnt === 3) {
                nextVal = 1
              }
              nextGrid.addValue({x,y,z,w}, nextVal)
            }
          }
        }
      }
      grid = nextGrid 
    })
    console.log(grid.count())
  };
}

new Solve17().run();
