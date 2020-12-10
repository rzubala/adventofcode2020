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
    this.process();
  };

  private process = () => {
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
