import { FileReader } from "../common";

class Solve15 extends FileReader {
  private data: number[];

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");
      this.data = rawData.split(",").map(Number);
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
    const mem = this.data.reduce((a, v, i) => {
      a[v] = [i]
      return a
    }, {})

    let it = this.data.length;
    //let end = 2020
    let end = 30000000
    let last = this.data[it - 1]
    while (true) {
      let cur
      const indices: number[] = (mem[last] || [])
      const len = indices.length
      if (len < 2) {
        cur = 0
      } else {
        cur = indices[len-1] - indices[len-2]
      }
      const newindices: number[] = (mem[cur] || [])      
      newindices.push(it)
      while (newindices.length > 2) {
        newindices.shift()
      }
      mem[cur] = newindices
      last = cur
      
      if ((it + 1) === end) {
        break
      }
      it++
    }
  };
}

new Solve15().run();
