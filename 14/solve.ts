import { FileReader } from "../common";

class Solve14 extends FileReader {
  private data: string[];
  private powers = []

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
    const cnt = this.process(this.apply1);
    this.generateBitCombinations(cnt)
    this.process(this.apply2)
  };

  private process = (apply: (input: string[], mask: string, mem: object) => void): number => {
    let mask: string = ""    
    let mem = {}
    let maxX = 0
    for (let line of this.data) {
      const input = line.split(' = ')
      if (input[0] === 'mask') {
        mask = input[1]
      } else {
        apply(input, mask, mem)
        maxX = Math.max(mask.split('').filter(c => c === 'X').length, maxX)
      }
    }    
    let sum = 0
    for (let val of Object.values(mem)) {
      sum += +val
    }
    console.log('sum', sum)
    return maxX
  };

  private apply1 = (input: string[], mask: string, mem: object) => {
    const res = this.mask(+input[1], mask)
    const address = +input[0].split('').filter(c => Number.isInteger(+c)).join('')
    mem[address] = res    
  }

  private apply2 = (input: string[], mask: string, mem: object) => {
    const res = +input[1]
    const address = +input[0].split('').filter(c => Number.isInteger(+c)).join('')
    const addresses = this.mask2(address, mask)
    addresses.forEach(a => {
      mem[a] = res
    })      
  } 

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
    return parseInt(res, 2)
  }

  private mask2 = (value: number, mask: string): number[] => {
    const arr = this.toBin(value).split('')    
    const res: string[] = mask.split('').map((m, i) => {
      if (m === 'X' || m === '1') {
        return m
      }
      return arr[i]
    })
    const xs = res.reduce((a,v,i) => {
      if (v === 'X') {
        a.push(i)
      }
      return a
    }, [])
    const cnt = xs.length
    const addresses: number[] = []    
    for (let i=0;i<Math.pow(2, cnt);i++) {
      const values: string[] = this.powers[i].split('')
      const len = values.length
      const address = [...res]
      for (let j=0;j<cnt;j++) {
        address[xs[j]] = values[len - 1 - j]
      }
      addresses.push(parseInt(address.join(''), 2))
    }
    return addresses
  }

  private generateBitCombinations = (cnt: number) => {   
    for (let n=0;n<Math.pow(2,cnt);n++) {
      this.powers.push(n.toString(2).padStart(9, '0'))
    }
  }
}

new Solve14().run();
