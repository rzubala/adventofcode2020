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
    this.getGoldOutBag()
    this.countGoldInBags()
  };  

  private countGoldInBags = () => {
    const gold = 'shiny_gold'
    let sum = 0;    
    const toCount = [{bag: gold, count: 1}]
    while (true) {
      if (toCount.length === 0) {
        break
      }
      const bagObj = toCount.shift()
      const bag = bagObj.bag
      const count = bagObj.count
      const children = this.rules[bag]
      for (const child of Object.keys(children)) {
        toCount.push({bag: child, count: count*children[child]})
        sum += count*children[child]
      }      
    }    
    console.log('bags', sum)
  }

  private getGoldOutBag = () => {
    const gold = 'shiny_gold'        
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
  }

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

new Solve07()