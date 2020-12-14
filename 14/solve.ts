import { FileReader } from "../common";

class Solve14 extends FileReader {
  private data: string[];

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");
      this.data = rawData.split("\n");
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
    let mask: string = ""    
    let mem = {}
    for (let line of this.data) {
      const input = line.split(' = ')
      if (input[0] === 'mask') {
        mask = input[1]
      } else {
        const res = this.mask(+input[1], mask)
        const address = +input[0].split('').filter(c => Number.isInteger(+c)).join('')
        mem[address] = res        
      }
    }    
    let sum = 0
    for (let val of Object.values(mem)) {
      sum += +val
    }
    console.log('sum', sum)
  };

  private toBin = (n: number): String => {
    return n.toString(2).padStart(36, '0')
  }

  private mask = (value: number, mask: string): number => {
    const arr = this.toBin(value).split('')    
    const res: string = mask.split('').map((m, i) => {
      if (m === 'X') {
        return arr[i]
      }
      return m
    }).join('')
    // console.log(value)
    // console.log(arr.join(''))
    // console.log(mask)
    // console.log(res)
    return parseInt(res, 2)
  }
}

new Solve14().run();
