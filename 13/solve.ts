import { FileReader } from "../common";
import { lcm } from '../utils'

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
    let n = this.buses[0].id
    let timestamp = 0    
    for (let bus of this.buses.slice(1)) {
      let it = 0
      while(true) {
        it++;
        if ((timestamp + bus.offset) % bus.id === 0) {          
          n = lcm(bus.id, n);
          break;
        }
        timestamp += n;
      }      
    }
    console.log('res', timestamp);
  };

  private process1() {
    let min: number = undefined;
    let res = 0;
    for (let bus of this.buses) {
      const diff = bus.id - this.time % bus.id;
      if (diff < min || min === undefined) {
        res = diff * bus.id;
        min = diff;
      }
    }
    console.log('res', res);
  }
}

new Solve13().run();
