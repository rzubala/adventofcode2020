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
  private validTickets: Array<Array<number>> = []

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");
      rawData.split("\n").forEach((line: string) => {
        //seat: 13-40 or 45-50
        const regex: RegExp = /(.+): (\d+)-(\d+) or (\d+)-(\d+)/;
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
    this.match()
  };

  private match = () => {
    const map = new Map()
    for (let rule of this.rules) {
      let match: number[] = Array.from({length: this.validTickets[0].length}, (v, k) => k)
      for (let ticket of this.validTickets) {
        const newMatch = []
        for (let i of match) {
          if (this.isMatchRule(rule,ticket[i])) {
            newMatch.push(i)
          }               
        }
        match = newMatch
      }
      map.set(match.length, match)
    }
    
    let len = 1
    while (true) {
      if (map.get(len) === undefined) {
        break
      }      
      this.removeIndices(len, map)
      len++;
    }
    let departures = 6, d = 0, m = 1
    let ticket = this.validTickets[0]
    for (let v of map.values()) {
      m *= ticket[v[0]]
      if (++d >= departures) {
        break
      }
    }
    console.log(m)
  }

  private removeIndices = (len: number, map: Map<number, number[]>) => {
    const indices = (map.get(len) || [])
    for (let key of map.keys()) {
      if (key === len) {
        continue
      }
      const tmp = (map.get(key) || [])      
      const newi = []
      for (let i of tmp) {
        if (!indices.includes(i)) {
          newi.push(i)
        }
      }
      map.set(key, newi)
    }
  }

  private process = () => {
    let sum = 0
    this.validTickets.push(this.tickets[0])
    this.tickets.slice(1).forEach((ticket: number[]) => {
      let valid: boolean = true
      ticket.forEach(n => {
        if (!this.isValid(n)) {
          sum += n
          valid = false
        }
      })
      if (valid) {
        this.validTickets.push(ticket)
      }
    })
    console.log('not valid:', sum)    
  };

  private isValid = (n: number): boolean => {
    for (let rule of this.rules) {
      const result = this.isMatchRule(rule, n)
      if (result) {
        return true
      }
    }
    return false
  }

  private isMatchRule = (rule: Rule, n: number): boolean => {
    if (this.isInRange(rule.lower, n)) {
      return true
    }
    if (this.isInRange(rule.upper, n)) {
      return true
    }
    return false
  }

  private isInRange = (range: Range, n: number): boolean => {    
    return n>= range.from && n <= range.to
  }

}

new Solve16().run();
