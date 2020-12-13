import { FileReader } from "../common";

interface BusDeparture {
  id: number,
  offset: number
}

class Solve13 extends FileReader {
  private time: number
  private buses: BusDeparture[] = []  

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");
      const data = rawData.split("\n");
      this.time = +data[0]
      this.buses = data[1].split(',').map((b: string, i: number) => {
        return {id: parseInt(b), offset: i}}).filter((b: BusDeparture) => !Number.isNaN(b.id))
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
    let multiplier = this.buses[0].id
    let i = 0
    for (let bus of this.buses.slice(1)) {
      while(true) {
        if ((i + bus.offset) % bus.id === 0) {
          multiplier *= bus.id;
          break;
        }
        i += multiplier;
      }
    }
    console.log('res', i);
  };

  private process1() {
    let min: number = undefined;
    let res = 0;
    for (let bus of this.buses) {
      const diff = Math.ceil(this.time / bus.id) * bus.id - this.time;
      if (diff < min || min === undefined) {
        res = diff * bus.id;
        min = diff;
      }
    }
    console.log('res', res);
  }
}

new Solve13().run();
