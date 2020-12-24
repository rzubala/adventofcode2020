import { FileReader } from "../common";

class Solve22 extends FileReader {
  private player1: number[] = [];
  private player2: number[] = [];

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");
      let first = true;
      for (let line of rawData.split("\n")) {
        if (line === "") {
          continue;
        }
        if (line === "Player 2:") {
          first = false;
          continue;
        }
        const num = +line;
        if (isNaN(num)) {
          continue;
        }
        if (first) {
          this.player1.push(num);
        } else {
          this.player2.push(num);
        }
      }
    } catch (ex) {
      console.log(ex);
      throw ex;
    }
  };

  run = async () => {
    await this.init();
    this.play1();

    const player1 = [...this.player1];
    const player2 = [...this.player2];
    this.play2(player1, player2);
    console.log(player1.join(','))
    console.log(player2.join(','))
    console.log(this.score(player1), this.score(player2));
  };

  private play2 = (player1: number[], player2: number[]): boolean => {
    const set1 = new Set<string>()  
    const set2 = new Set<string>()
    while (player1.length > 0 && player2.length > 0) {      
      const hash1 = this.hash(player1)
      const hash2 = this.hash(player2)  
      if (set1.has(hash1) && set2.has(hash2)) {          
          return true
      }
      set1.add(hash1)
      set2.add(hash2)
        
      let winner1: boolean | undefined = undefined;
      const card1 = player1.shift();
      const card2 = player2.shift();

      if (card1! <= player1.length && card2! <= player2.length) {
        winner1 = this.play2(player1.slice(0, card1), player2.slice(0, card2));
      } else {
        winner1 = card1! > card2!;
      }
      if (winner1) {
        player1.push(card1!);
        player1.push(card2!);
      } else {
        player2.push(card2!);
        player2.push(card1!);
      }

    }
    return player1.length > 0
  };

  private play1 = () => {
    const player1 = [...this.player1];
    const player2 = [...this.player2];
    while (player1.length > 0 && player2.length > 0) {
      const card1 = player1.shift();
      const card2 = player2.shift();
      if (card1! > card2!) {
        player1.push(card1!);
        player1.push(card2!);
      } else {
        player2.push(card2!);
        player2.push(card1!);
      }
    }
    console.log(this.score(player1), this.score(player2));
  };

  private score = (player: number[]): number => {
    return player.reduce((a, c, i) => {
      a += c * (player.length - i);
      return a;
    }, 0);
  };

  private hash = (player: number[]): string => {
      return player.reduce((a,v) => {
        a += v + ","
        return a
      }, "")
  }
}

new Solve22().run();
