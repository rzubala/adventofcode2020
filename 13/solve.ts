import { FileReader } from "../common";

class Solve13 extends FileReader {
  private time: number
  private buses: number[] = []

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");
      const data = rawData.split("\n");
      this.time = +data[0]
      for (let bus of data[1].split(',')) {
        if (bus === 'x') {
          continue
        }
        this.buses.push(+bus)
      }

    } catch (ex) {
      console.log(ex);
      throw ex;
    }
  };

  run = async () => {
    await this.init();
    let min: number = undefined
    let res = 0
    for (let bus of this.buses) {
      const diff = Math.ceil(this.time/bus) * bus - this.time
      console.log(bus, diff)
      if (diff < min || min === undefined) {
        res = diff * bus
        min = diff
      }
    }
    console.log('res',res)
  };

  private process = () => {
    console.log(this.time, this.buses);
  };
}

new Solve13().run();
