import { FileReader } from "../common";

interface RuleMap {
  [key: number]: string;
}

interface RuleParsedMap {
  [key: number]: Array<Array<number | string>>;
}

interface ParsedMap {
  [key: number]: string[];
}

class Solve19 extends FileReader {
  private data: string[] = [];
  private rules: RuleMap = {}
  private parsedRules: RuleParsedMap = {}
  private parsed: ParsedMap = {}

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");      
      for (const line of rawData.split("\n")) {
        if (line.trim().length === 0) {
          continue
        }
        const regex: RegExp = /(\d+): (.+)/;
        const match: RegExpExecArray | null = regex.exec(line);
        if (match != null) {          
          this.rules[+match[1]] = match[2]
        } else {
          this.data.push(line)
        }
      }
      this.parseRules()
    } catch (ex) {
      console.log(ex);
      throw ex;
    }
  };

  run = async () => {
    await this.init();
    this.process1();
    this.parsedRules[8] = [[42], [42, 8]];
    this.parsedRules[11] = [[42, 31], [42, 11, 31]];
    this.process2();
  };

  private parseRules = () => {
    for (let rule of Object.keys(this.rules)) {
      const value = this.rules[+rule]
      const parsed = []
      for (let part of value.split(' | ')) {        
        const npart = part.split(' ').map(e => isNaN(+e) ? e.split('')[1] : +e)
        parsed.push(npart)
      }
      this.parsedRules[+rule] = parsed
      
    }
  }

  private findPathLength = (value: string, rule: number, position: number): number[] => {
    if (position >= value.length) {
      return [-1];
    }
    const ruleValue = this.parsedRules[rule][0][0]
    if (isNaN(+ruleValue)) {
      if (ruleValue as unknown as string === value[position]) {
        return [position + 1]
      } else {
        return [-1]
      }
    }
    const positionsQueue = [];
    for (const variants of this.parsedRules[rule]) {
      let nextPositions = [position];
      let found = true;  
      for (const testRule of variants) {
        const next: Array<number> = []
        for (let nextPosition of nextPositions) {
          next.push(...this.findPathLength(value, +testRule, nextPosition).filter(e => e !== -1))
        }
        if (next.length === 0) {
          found = false;
          break;
        }
        nextPositions = next
      }  
      if (found) {
        positionsQueue.push(...nextPositions);
      }
    }
    if (positionsQueue.length > 0) {
      return positionsQueue;
    } else {  
      return [-1];
    }
  }
  
  private process2 = () => {
    let cnt = 0
    for (let line of this.data) {
      if (this.findPathLength(line, 0, 0).filter(length => length === line.length).length > 0) {
        cnt++
      }
    }
    console.log(cnt)
  }

  private parse = (key: number): string[] => {
    if (this.parsed[key]) {
      return this.parsed[key]
    }
    const values: string[] = this.rules[key].split(' ')
    let result: string [] = []
    let part: Array<Array<string>> = []    
    for (let value of values) {
      if (value === '"a"') {
        part.push(['a'])
        break
      }
      if (value === '"b"') {
        part.push(['b'])
        break
      }
      if (value === '|') {        
        result = result.concat(this.merge(part))
        part = []
        continue
      }
      if (!isNaN(parseInt(value))) {
        part.push(this.parse(+value))                
        continue;
      }
    }
    
    result = result.concat(this.merge(part))
    this.parsed[key] = result
    return result;
  }

  private merge = (input: Array<Array<string>>): string[] => {
    if (input.length === 1) {      
      return input[0]
    } else if (input.length > 1) {      
      let res = []
      let tmp = this.copy(input[0])
      for (let n=1;n<input.length;n++) {
        res = []
        const len1 = tmp.length
        const len2 = input[n].length
        for (let i=0;i<len1;i++) {
          for (let j=0;j<len2;j++) {
            res.push(`${tmp[i]}${input[n][j]}`)    
          }
        }
        tmp = this.copy(res)
      }
      return res
    }
    throw new Error('something went wrong: '+ input.join(','))
  }

  private copy = (arr: string[]): string[] => {
    return arr.map(e => e)
  }

  private process1 = () => {
    this.parse(0)
    console.log('size', this.parsed[0].length, this.data.length)
    console.log(this.data.filter(d => this.parsed[0].includes(d)).length)    
  };
}

new Solve19().run();
