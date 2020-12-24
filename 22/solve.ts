import { FileReader } from "../common";

class Solve22 extends FileReader {
  private player1: number[] = [];
  private player2: number[] = [];

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");
      let first = true
      for (let line of rawData.split("\n")) {
        if (line === '') {
            continue
        }
        if (line === 'Player 2:') {
            first = false
            continue
        }        
        const num = +line
        if (isNaN(num)) {
            continue
        }
        if (first) {
            this.player1.push(num)
        } else {
            this.player2.push(num)
        }
      }
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
    console.log(this.player1.join(', '))
    console.log(this.player2.join(', '))
    while (this.player1.length > 0 && this.player2.length > 0) {
        const card1 = this.player1.shift()
        const card2 = this.player2.shift()
        if (card1! > card2!) {
            this.player1.push(card1!)
            this.player1.push(card2!)
        } else {
            this.player2.push(card2!)
            this.player2.push(card1!)
        }
    }
    console.log(this.player1.join(', '))
    console.log(this.player2.join(', '))
    const res1 = this.player1.reduce((a, c, i) => {
        a += c * (this.player1.length - i)
        return a
    }, 0)
    const res2 = this.player2.reduce((a, c, i) => {
        a += c * (this.player2.length - i)
        return a
    }, 0)
    console.log(res1, res2)
  };
}

new Solve22().run();
