import { FileReader } from "../common";

interface Instruction {
  operand: string,
  argument: number
}

class Solve08 extends FileReader {
  private rawData: string[]
  private program: Instruction[]
  private acc: number = 0
  private pc: number = 0

  constructor() {
    super();
    this.readData("input.data")
    .then((data: string) => {
      this.program = this.parse(data.split('\n'))
      this.startProgram(this.program)
      console.log('part1', this.acc)
      this.repair()
    })
    .catch((err) => console.log(err));  
  };

  parse = (data: string[]): Instruction[] => {
    return data.map(line => {
      const tmp = line.split(' ')
      const arg = +tmp[1]
      return {operand: tmp[0], argument: arg}
    }) 
  }

  startProgram = (program: Instruction[]): number => {
    this.acc = 0
    this.pc = 0
    const set: Set<number> = new Set()
    while (true) {
      if (this.pc >= program.length) {        
        return 1
      }
      if (this.pc < 0) {
        return -1
      }
      if (set.has(this.pc)) {
        return -1
      }
      set.add(this.pc)
      const instruction = program[this.pc]
      switch(instruction.operand) {
        case 'acc':
          this.pc++;
          this.acc += instruction.argument 
          break
        case 'jmp':
          this.pc += instruction.argument
          break;
        case 'nop':
          this.pc++;
          break    
        default:
          throw new Error('Not supported op: ' + instruction.operand)
      }      
    }
    throw new Error('Should never reach it')
  }

  private repair = () => {
    if (!this.repairOp(this.checkNop, 'jmp')) {
      this.repairOp(this.checkJmp, 'nop')
    }
  }

  private repairOp = (check: (ins:Instruction) => boolean, newOp: string): boolean => {
    for (let i=0;i<this.program.length;i++) {
      const ins = this.program[i]
      if (check(ins)) {
        const copy = [...this.program]
        copy[i] = {operand: newOp, argument: ins.argument}        
        const res = this.startProgram(copy)
        if (res > 0) {
          console.log('part2', this.acc)
          return true
        }
      }
    };
    return false
  }

  private checkNop = (ins: Instruction): boolean => {
    return ins.operand === 'nop' && ins.argument !== 0
  }

  private checkJmp = (ins: Instruction): boolean => {
    return ins.operand === 'jmp'
  }
}

new Solve08();