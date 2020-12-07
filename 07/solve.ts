import { FileReader } from "../common";

class Solve07 extends FileReader {

  private rules = {}

  constructor() {
    super();
    this.readData("input.data")
      .then((data) => {
        this.process(data.split("\n"));
      })
      .catch((err) => console.log(err));
  }

  process = (data: string[]) => {
    
    data.forEach(line => {
      const rule = this.parse(line)
      this.rules[rule[0]] = rule[1]
    });
    const gold = 'shiny_gold'
    //Object.keys(this.rules).forEach(r => console.log(r, this.rules[r]))
    
    const toSearch: string[] = []
    toSearch.push(gold)
    const found: string[] = []
    while (true) {
      if (toSearch.length === 0) {
        break
      }
      const bag = toSearch.shift()
      const bags = this.findParents(bag)
      if (bags.length !== 0) {
        for (const bag of bags) {
          if (!found.includes(bag)) {
            found.push(bag)
            toSearch.push(bag)
          }
        }
      }
    }
    console.log('found', found.length)
  };  

  findParents = (name: string): string[] => {
    const parents: string[] = []
    for (const rule of Object.keys(this.rules)) {            
      const bags = this.rules[rule]
      for (const bag of Object.keys(bags)) {
        if (bag === name) {
          parents.push(rule)
        }
      }
    }
    return parents
  }

  parse = (line: string): [string, object] => {
    const parts = line.split(' contain ')    
    const parentParts = parts[0].split(' ')
    const parent = parentParts[0] + "_" + parentParts[1]
    const bags = parts[1].split(', ')

    const bagsObj = {}
    bags.forEach(b => {      
      const bagParts = b.split(' ')
      if (bagParts[0] !== 'no') {
        const bag = bagParts[1] + "_" + bagParts[2]
        const num = +bagParts[0]
        bagsObj[bag] = num
      }
    })
    return [parent, bagsObj] 
  }

}

const solve: Solve07 = new Solve07();
//const result = solve.parse('faded olive bags contain 2 bright crimson bags, 5 dotted green bags, 5 dull bronze bags, 2 posh turquoise bags.')
//const result = solve.parse('faded magenta bags contain 4 bright coral bags.')
//console.log(result)

