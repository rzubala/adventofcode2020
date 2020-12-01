import { FileReader } from "../common";

class Solve01 extends FileReader {
  constructor() {
    super();
    this.readData("input.data")
      .then((data) => {
        this.process1(data.split("\n"));
        this.process2(data.split("\n"));
      })
      .catch((err) => console.log(err));
  }

  process1 = (data) => {
    const len = data.length;
    for (var i = 0; i < len - 1; i++) {
      for (var j = i + 1; j < len; j++) {
        const tmpi = parseInt(data[i]);
        const tmpj = parseInt(data[j]);
        if (tmpi + tmpj === 2020) {
          console.log(tmpi * tmpj);
          return;
        }
      }
    }
  };

  process2 = (data) => {
    const len = data.length;
    for (var i = 0; i < len - 2; i++) {
      for (var j = i + 1; j < len - 1; j++) {
        for (var k = j + 1; k < len; k++) {
          const tmpi = parseInt(data[i]);
          const tmpj = parseInt(data[j]);
          const tmpk = parseInt(data[k]);
          if (tmpi + tmpj + tmpk === 2020) {
            console.log(tmpi * tmpj * tmpk);
            return;
          }
        }
      }
    }
  };
}

new Solve01();
