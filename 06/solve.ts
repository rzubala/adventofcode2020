import { FileReader } from "../common";

interface YesMap {
  [key: string]: number
}

class Solve06 extends FileReader {  

  constructor() {
    super();
    this.readData("input.data")
      .then((data) => {
        this.process(data.split("\n"), this.countAll);
        this.process(data.split("\n"), this.countYes);
      })
      .catch((err) => console.log(err));
  }

  private process = (data: string[], count: (stat: YesMap, members: number) => number) => {
    let yes: YesMap = {}
    let members = 0
    let sum = 0    
    data.forEach(line => {
      if (line.trim() === '') {
        sum += count(yes, members)
        yes = {}
        members = 0 
      } else {
        members++;
        line.split('').forEach(y => {          
          let cnt = yes[y]
          if (cnt === undefined) {
            cnt = 0
          }
          yes[y] = cnt + 1            
        })          
      }      
    })
    sum += count(yes, members)
    console.log('yes', sum)
  }

  private countAll = (yes: YesMap, members: number): number => {
    return Object.keys(yes).length
  }

  private countYes = (yes: YesMap, members: number): number => {
    let sum = 0
    for (const y in yes) {
      if (yes[y] === members) {
        sum++
      }
    }
    return sum
  }
}

new Solve06();
