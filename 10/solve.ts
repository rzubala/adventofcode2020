import { FileReader } from "../common";

class Solve10 extends FileReader {
  private adapters: number[];

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");
      this.adapters = rawData.split("\n").map((a: string) => +a).sort((a: number,b: number) => a - b);
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
    const steps = [1];    
    for (let adapter of adapters) {  
        steps[adapter] = (steps[adapter-1] || 0) + (steps[adapter-2] || 0) + (steps[adapter-3] || 0)
    }
    console.log(steps[last]);

    //or version with reduce
    const result = adapters.reduce((steps, adapter) => {
      steps[adapter] = (steps[adapter - 1] || 0) + (steps[adapter - 2] || 0) + (steps[adapter - 3] || 0)
      return steps
    }, [1])
    console.log(result[last]);
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
