import { FileReader } from "../common";

interface Range {
  from: number,
  to: number
}

interface Rule {
  name: String,
  lower: Range,
  upper: Range,
}

class Solve16 extends FileReader {
  private rules: Rule[] = []
  private tickets: Array<Array<number>> = []

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");
      rawData.split("\n").forEach((line: string) => {
        //seat: 13-40 or 45-50
        const regex: RegExp = /(\w+): (\d+)-(\d+) or (\d+)-(\d+)/;
        const match: RegExpExecArray | null = regex.exec(line);
        if (match != null) {          
          const rule: Rule = {name: match[1], lower: {from: +match[2], to: +match[3]}, upper: {from: +match[4], to: +match[5]}}
          this.rules.push(rule)          
        } else {
          const fields = line.split(',').filter(c => c.trim().length >0 && Number.isInteger(+c)).map(Number)
          if (fields.length > 0) {
            this.tickets.push(fields)
          }
        }
      });
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
    let sum = 0
    this.tickets.slice(1).forEach((ticket: number[]) => {
      ticket.forEach(n => {
        if (!this.isValid(n)) {
          sum += n
        }
      })
    })
    console.log('not valid:', sum)
  };

  private isValid = (n: number): boolean => {
    for (let rule of this.rules) {
      if (this.isInRange(rule.lower, n)) {
        return true
      }
      if (this.isInRange(rule.upper, n)) {
        return true
      }
    }
    return false
  }

  private isInRange = (range: Range, n: number): boolean => {    
    return n>= range.from && n <= range.to
  }

}

new Solve16().run();
