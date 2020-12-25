import { FileReader } from "../common";

const buffer = (data: number[]) => {
  const buffer = [...data]  

  return {
    get: (index: number): number => buffer[index % buffer.length],
    indexOf: (value: number):number => buffer.indexOf(value),    
    destinationCup: (value: number):[number, number] => {
      const min = Math.min(...buffer)
      const max = Math.max(...buffer)
      let dst = value
      while(true) {
        if (--dst < min) {
          dst = max
        }
        if (buffer.includes(dst)) {
          return [dst, buffer.indexOf(dst)]
        }
      }
    },
    insert: (data: number[], index: number) => {
      let ind = index + 1
      const len = buffer.length
      if (ind !== len) {
        ind = ind % len
      }
      buffer.splice(ind, 0, ...data)
    },
    pop3: (currentIndex: number):number[] => {
      const len = buffer.length
      let index = (currentIndex + 1) % len
      if (index + 3 <= len) {
        return buffer.splice(index, 3)
      }      
      const toRemove = len - index
      const toRemoveRest = 3 - toRemove
      const last = buffer.splice(index, toRemove)
      return [...last, ...buffer.splice(0, toRemoveRest)]
    },
    print: () => {
      console.log(buffer.join(''))
    },
    result: ():string => {
      const index = buffer.indexOf(1)
      const len = buffer.length
      let res = ""
      for (let i = 1;i<len;i++) {
        res += buffer[(index + i) % len]
      }
      return res
    }    
  }  
}

class Solve23 {

  public process1 = () => {
    const input = "614752839";
    const buf = buffer(input.split('').map(e => +e))
    let currentCup = +input[0]
    let currentCupIndex = 0
    for (let i=0;i<100;i++) {      
      //console.log('***', i + 1)
      //console.log('current', currentCup, 'at', currentCupIndex)
      //buf.print()      
      const removed = buf.pop3(currentCupIndex)      
      const [destination, index] = buf.destinationCup(currentCup)      
      buf.insert(removed, index)           
      currentCupIndex = buf.indexOf(currentCup) + 1
      currentCup = buf.get(currentCupIndex)
      //console.log(removed, 'dest', destination, 'at', index)
    }
    buf.print()
    console.log(buf.result())
  };
}

new Solve23().process1();
