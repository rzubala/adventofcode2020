import { FileReader } from "../common";

interface Range {
  from: number,
  to: number
}

class Solve05 extends FileReader {
  constructor() {
    super();
    this.readData("input.data")
      .then((data) => {
        this.process(data.split("\n"));
      })
      .catch((err) => console.log(err));
  }

  process = (data) => {
    const ids: number[] = data.map(line => this.getId(line))
    console.log('max', Math.max(...ids))
    let id: number = Math.min(...ids) + 1;
    while (true) {
      if (ids.indexOf(id) === -1 && ids.indexOf(id-1) !== -1 && ids.indexOf(id+1) !== -1) {
        console.log('id', id)
        break
      }
      id++;
    }
  };

  public getId = (value): number => {
    let row: Range = {from: 0, to: 127}
    for (const d of value.substring(0, 7).split('')) {      
      row = this.nextRange(d === 'B', row);
    }
    let col: Range = {from: 0, to: 7}
    for (const d of value.substring(7, 10).split('')) {      
      col = this.nextRange(d === 'R', col);
    }
    return row.from * 8 + col.from
  }

  private nextRange = (up: boolean, range: Range) : Range => {
    const size = range.to - range.from + 1
    if (size === 1) {
      return range
    }
    const half = size / 2
    if (up) {
      return {
        from: range.from + half,
        to: range.to
      }
    } else {
      return {
        from: range.from,
        to: range.from + half - 1
      }
    }
  }
}

new Solve05()
