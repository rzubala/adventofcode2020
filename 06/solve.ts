import { FileReader } from "../common";

class Solve06 extends FileReader {  

  constructor() {
    super();
    this.readData("input.data")
      .then((data) => {
        this.process(data.split("\n"));
      })
      .catch((err) => console.log(err));
  }

  private process = (data: string[]) => {
    const yes: Set<string> = new Set()
    let sum = 0
    data.forEach(line => {
      if (line.trim() === '') {
        console.log(yes)
        sum += yes.size
        yes.clear()        
      } else {
        line.split('').forEach(y => yes.add(y))
      }
    })
    sum += yes.size    
    console.log('yes', sum)
  }
}

new Solve06();
