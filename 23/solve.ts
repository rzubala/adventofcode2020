
const buffer = (data: number[], min: number, max: number) => {
  const buffer = [...data]  

  return {
    get: (index: number): number => buffer[index % buffer.length],
    indexOf: (value: number):number => buffer.indexOf(value),    
    destinationCup: (value: number):[number, number] => {
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
  public process1a = () => {
    const input = "614752839";
    const buf = buffer(input.split('').map(e => +e), 1, 9)
    let currentCup = +input[0]
    let currentCupIndex = 0
    for (let i=0;i<100;i++) {      
      const removed = buf.pop3(currentCupIndex)      
      const [destination, index] = buf.destinationCup(currentCup)      
      buf.insert(removed, index)           
      currentCupIndex = buf.indexOf(currentCup) + 1
      currentCup = buf.get(currentCupIndex)
    }
    console.log(buf.result())
  };

  public process1b = () => {
    const input = "614752839";
    const data = input.split('').map(e => +e)
    let currentCup = data[0]
    const len = data.length
    const min = Math.min(...data)
    const max = Math.max(...data)
    const buffer = new Array<number>(len + 1)
    const group3 = new Array<number>(3)
    for (let i=0;i<len-1;i++) {
      buffer[data[i]] = data[i+1]    
    }
    buffer[data[len-1]] = data[0]

    for (let i=0;i<100;i++) {
      const firstRemoved = buffer[currentCup]
      let toRemove = group3[0] = firstRemoved
      for (let i=1;i<3;i++) {
        toRemove = group3[i] = buffer[toRemove]
      }
      buffer[currentCup] = buffer[toRemove]
      let destination = currentCup - 1
      while(true) {
        if (destination < min) {
          destination = max
          continue
        }
        if (group3.includes(destination)) {
          destination--
          continue
        }
        break; 
      }
      const afterDestination = buffer[destination]
      buffer[destination] = group3[0]
      buffer[group3[2]] = afterDestination
      currentCup = buffer[currentCup]
    }
    let score = ''
    let iter = buffer[1]
    while(score.length < len - 1) {
      score += iter
      iter = buffer[iter]
    }
    console.log(score)
  }

  public process2 = () => {
    const input = "389125467"
    const bufferData = [...input.split('').map(e => +e), ...Array.from({length: 1000000 - input.length}, (v,k) => 10 + k)]
    const buf = buffer(bufferData, 1, 1000000)
    
    // console.log(buffer.length)
    // for (let i=0;i<15;i++) {
    //   console.log(buffer[i])
    // }
    // console.log(buffer[buffer.length-1])
    //moves 10000000
    //last value 1000000


    let currentCup = +input[0]
    let currentCupIndex = 0
    //for (let i=0;i<10000000;i++) {      
    for (let i=0;i<15;i++) {
      const removed = buf.pop3(currentCupIndex)      
      const [destination, index] = buf.destinationCup(currentCup)      
      buf.insert(removed, index)           
      currentCupIndex = buf.indexOf(currentCup) + 1
      currentCup = buf.get(currentCupIndex)
    }    
  }
}

new Solve23().process1a();
new Solve23().process1b();
