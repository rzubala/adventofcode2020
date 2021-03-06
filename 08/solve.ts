import { FileReader } from "../common";

interface Instruction {
  operand: string,
  argument: number
}

class Solve08 extends FileReader {
  private program: Instruction[]
  private acc: number = 0
  private pc: number = 0

  private init = async () => {
    try {
      const data = await this.readData("input.data")    
      this.program = this.parse(data.split('\n'))
    } catch (ex) {
      console.log(ex)
    }
  }

  run = async () => {
    await this.init()
    this.startProgram(this.program)
    console.log('part1', this.acc)
    if (this.repair()) {
      console.log('part2', this.acc)
    }
  }

  private parse = (data: string[]): Instruction[] => {
    return data.map(line => {
      const tmp = line.split(' ')
      const arg = +tmp[1]
      return {operand: tmp[0], argument: arg}
    }) 
  }

  private startProgram = (program: Instruction[]): number => {
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

  private repair = (): boolean => {
    if (!this.repairOp(this.checkNop, 'jmp')) {
      return this.repairOp(this.checkJmp, 'nop')
    }
    return false
  }

  private repairOp = (check: (ins:Instruction) => boolean, newOp: string): boolean => {
    for (let i=0;i<this.program.length;i++) {
      const ins = this.program[i]
      if (check(ins)) {
        const copy = [...this.program]
        copy[i] = {operand: newOp, argument: ins.argument}        
        const res = this.startProgram(copy)
        if (res > 0) {
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

const solve = new Solve08();
solve.run()