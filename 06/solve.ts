import { FileReader } from "../common";

class Solve06 extends FileReader {  

  constructor() {
    super();
    this.readData("input.data")
      .then((data) => {
        this.process1(data.split("\n"));
        this.process2(data.split("\n"));
      })
      .catch((err) => console.log(err));
  }

  private process1 = (data: string[]) => {
    const yes: Set<string> = new Set()
    let sum = 0
    data.forEach(line => {
      if (line.trim() === '') {
        sum += yes.size
        yes.clear()        
      } else {
        line.split('').forEach(y => yes.add(y))
      }
    })
    sum += yes.size    
    console.log('yes', sum)
  }

  private process2 = (data: string[]) => {
    let yes = {}
    let members = 0
    let sum = 0    
    data.forEach(line => {
      if (line.trim() === '') {
        sum += this.countYes(yes, members)
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
    sum += this.countYes(yes, members)
    console.log('yes', sum)
  }

  private countYes = (yes, members): number => {
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
