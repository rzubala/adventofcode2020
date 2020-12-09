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
    this.process();
  };

  private process = () => {
    console.log(this.data);
    const preamble = 25
    let i = preamble
    while(true) {
      if (i >= this.data.length) {
        break;
      }
      if (!this.isValid(this.data[i], this.data.slice(i-preamble, i))) {
        console.log('not valid', this.data[i])
        break;
      }
      i++
    }
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
