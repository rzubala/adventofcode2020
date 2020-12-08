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
      this.startProgram() 
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

  startProgram = () => {
    this.acc = 0
    this.pc = 0

    const set: Set<number> = new Set()

    while (true) {
      console.log(this.pc, this.acc)
      if (this.pc < 0 || this.pc >= this.program.length) {
        console.log('EXITING')
        break;
      }
      if (set.has(this.pc)) {
        console.log('INFINITIVE LOOP')
        break;
      }
      set.add(this.pc)
      const instruction = this.program[this.pc]
      console.log(instruction)
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
  }
}

new Solve08();