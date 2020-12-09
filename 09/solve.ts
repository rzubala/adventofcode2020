import { FileReader } from "../common";

class Solve09 extends FileReader {

  private data: number[];

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");
      this.data = rawData.split("\n").map(d => +d);
    } catch (ex) {
      console.log(ex);
      throw ex;
    }
  };

  run = async () => {
    await this.init();
    const num = this.part1();
    if (num > 0) {
      this.part2(num)
    }
  };

  private part2 = (num: number) => {
    const len=this.data.length
    let i = 0;
    while(true) {
      if (i >= len) {
        break;
      }
      const res = this.findSum(num, i)
      if (res > 0) {
        console.log('found', res)
        break;
      }
      i++
    }
  }

  private findSum = (num: number, start: number): number => {
    let sum = 0
    let min = undefined
    let max = -1
    for (let i=start;i<this.data.length;i++) {
      const tmp = this.data[i]
      sum += tmp
      if (min === undefined || tmp < min) {
        min = tmp
      }
      if (tmp > max) {
        max = tmp
      }
      if (sum > num) {
        return -1
      }
      if (sum === num) {
        return min + max
      }
    }
    return -1
  }

  private part1 = ():number => {    
    const preamble = 25
    let i = preamble
    while(true) {
      if (i >= this.data.length) {
        break;
      }
      if (!this.isValid(this.data[i], this.data.slice(i-preamble, i))) {
        console.log('not valid', this.data[i])
        return this.data[i]
      }
      i++
    }
    return -1
  };

  private isValid = (num: number, arr: number[]):boolean => {
    const len = arr.length
    for (let i=0;i<len-1;i++) {
      for (let j=i+1;j<len;j++) {
        if (arr[i] + arr[j] === num) {
          return true;
        }
      }
    }
    return false
  }
}

new Solve09().run();
