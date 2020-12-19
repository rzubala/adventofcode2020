import { FileReader } from "../common";

interface RuleMap {
  [key: number]: string;
}

interface ParsedMap {
  [key: number]: string[];
}

class Solve19 extends FileReader {
  private data: string[] = [];
  private rules: RuleMap = {}
  private parsed: ParsedMap = {}

  private init = async () => {
    try {
      const rawData = await this.readData("input2.data");      
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
      //console.log(this.rules)
      //console.log(this.data.join(' '))
    } catch (ex) {
      console.log(ex);
      throw ex;
    }
  };

  run = async () => {
    await this.init();
    this.process();
  };

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
    console.log('parsed', key)
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

  private process = () => {
    this.parse(0)
    console.log('size', this.parsed[0].length, this.data.length)
    // for (let key of Object.keys(this.parsed)) {
    //   const values = this.parsed[+key]
    //   console.log(key, ':', values.join(','))
    // }
    console.log(this.data.filter(d => this.parsed[0].includes(d)).length)
    
  };
}

new Solve19().run();
