import { FileReader } from "../common";

const add = (a: number, b: number): number => a+b
const mul = (a: number, b: number): number => a*b
interface OpMap {
  [op: string]: (a: number, b: number)=> number;
}
const ops: OpMap = {
  '+': add,
  '*': mul
}

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
    this.process(false);
    this.process(true);
  };

  private process = (mode: boolean) => {
    let sum = 0
    for (let line of this.data) {
      const rpn = this.RPN(line, mode)
      const res = this.calc(rpn)
      sum += res      
    }
    console.log(sum)
  };

  private calc = (rpn: string[]): number => {
    const res = 0
    const stack: number[] = []
    for (let part of rpn) {
      if (Object.keys(ops).includes(part)) {
        stack.push(ops[part]((stack.pop() || 0), (stack.pop() || 0)))
        continue
      }
      let num = parseInt(part)
      if (!isNaN(num)) {
        stack.push(num)
      }
    }
    return (stack.pop() || 0);
  }

  private RPN = (input: string, mode: boolean): string[] => {    
    const parts = input.replace(/\s/g, '').split('');
    const stack: string[] = []
    const exit: string[] = []    
    for (let part of parts) {
      if (part === '+' || part === '*') {
        while (stack.length > 0) {
          const prevOp = stack[stack.length - 1]
          if (prevOp !== '+' && prevOp !== '*') {
            break
          }
          if (mode) {
            if (prevOp === '+') {
              exit.push((stack.pop() || ''))  
            } else {
              break
            }
          } else {
            exit.push((stack.pop() || ''))
            break
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