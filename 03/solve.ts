import { FileReader } from "../common";

class Solve03 extends FileReader {

  private map: Array<Array<String>> = []

  constructor() {
    super();
    this.readData("input.data")
      .then((data) => {
        data.split("\n").forEach(line => {
          const row: Array<String> = []          
          line.split('').forEach(point => {
            row.push(point)
          });
          this.map.push(row)
        });   
                
        const count1 = this.countTrees(1, 1)
        const count2 = this.countTrees(3, 1)
        const count3 = this.countTrees(5, 1)
        const count4 = this.countTrees(7, 1)
        const count5 = this.countTrees(1, 2)
        console.log(count2, count1*count2*count3*count4*count5)
      })
      .catch((err) => console.log(err));
  }

  private countTrees = (stepX: number, stepY: number) => {
    var x=0, y=0;
    const lines = this.map.length
    var trees = 0
    while(true) {
      const point = this.getPointAt(x, y)
      if (point === '#') {
        trees++;
      }
      x += stepX;
      y += stepY;
      if (y >= lines) {
        break
      }
    }
    return trees;    
  }

  private getPointAt = (x: number, y: number): String => {
    const sizeX = this.map[0].length
    x = x % sizeX
    return this.map[y][x]
  }
}

new Solve03();
