import { FileReader } from "../common";

class Solve18 extends FileReader {
  private data: string[] = [];

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");
      this.data = rawData.split("\n");
    } catch (ex) {
      console.log(ex);
      throw ex;
    }
  };

  run = async () => {
    await this.init();
    this.process();
  };

  private process = () => {
    let sum = 0
    for (let line of this.data) {
      const rpn = this.RPN(line)
      const res = this.calc(rpn)
      sum += res      
    }
    console.log(sum)
  };

  private calc = (rpn: string[]): number => {
    const res = 0
    const stack: number[] = []
    for (let part of rpn) {
      if (part === '+') {
        const b = (stack.pop() || 0)
        const a = (stack.pop() || 0)
        stack.push(a+b)
        continue
      } else if (part === '*') {
        const b = (stack.pop() || 0)
        const a = (stack.pop() || 0)
        stack.push(a*b)
        continue
      }
      let num = parseInt(part)
      if (!isNaN(num)) {
        stack.push(num)
      }
    }
    return (stack.pop() || 0);
  }

  private RPN = (input: string): string[] => {    
    const parts = input.replace(/\s/g, '').split('');
    const stack: string[] = []
    const exit: string[] = []    
    for (let part of parts) {
      if (part === '+' || part === '*') {
        const prevOp = stack.pop()
        if (prevOp) {
          if (prevOp === '+' || prevOp === '*') {
            exit.push(prevOp)
          } else {
            stack.push(prevOp)
          }
        }
        stack.push(part)
        continue
      }
      if (part === '(') {
        stack.push(part)
        continue
      } else if (part === ')') {
        while (true) {
          let op = stack.pop()
          if (op === '(' || op === undefined) {
            break
          }
          exit.push(op)
        }
        continue
      }
      let num = parseInt(part)
      if (!isNaN(num)) {
        exit.push(part)
      }
    }
    if (stack.length > 0) {
      while (true) {
        let op = stack.pop()
        if (op === undefined) {
          break
        }
        exit.push(op)
      }
    }
    return exit
  }
}

new Solve18().run();