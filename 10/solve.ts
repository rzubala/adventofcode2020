import { FileReader } from "../common";

class Solve10 extends FileReader {
  private adapters: number[];

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");
      this.adapters = rawData.split("\n").map(a => +a).sort((a,b) => a - b);
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

  private process2 = () => {
    const max = Math.max(...this.adapters)
    const last = max + 3
    const adapters = [...this.adapters, last]    

    //The Climbing Staircase Problem
    const steps = [];    
    steps[1] = adapters.includes(1) ? 1 : 0;
    steps[2] = adapters.includes(2) ? steps[1] + 1 : 0;
    steps[3] = adapters.includes(3) ? steps[1] + steps[2] + 1 : 0;
    for(let j = 4; j<=last; j++){
        steps[j] = adapters.includes(j) ? steps[j-1] + steps[j-2] + steps[j-3] : 0;
    }
    console.log(steps[last]);    
  }

  private process1 = () => {
    const max = Math.max(...this.adapters)
    const last = max + 3
    let cur = 0
    const diffs = {}
    const adapters = [...this.adapters, last]
    for (let adapter of adapters) {
      const diff = adapter - cur;
      cur = adapter
      let cnt = diffs[diff]
      if (cnt === undefined) {
        cnt = 0
      }
      diffs[diff] = cnt+1
    }
    console.log(diffs, diffs[1]*diffs[3])
  };
}

new Solve10().run();
