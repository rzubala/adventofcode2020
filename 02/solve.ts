import { FileReader } from "../common";

class Solve02 extends FileReader {
  private passwords = [];

  constructor() {
    super();
    this.readData("input.data").then((data) => {
        this.passwords = data.split("\n");
        this.process();
    })
  }

  private process = () => {
    var valid1 = 0, valid2 = 0;
    this.passwords.forEach((line) => {
      const regex: RegExp = /(\d+)-(\d+) (\w): (\w+)/;
      const match: RegExpExecArray = regex.exec(line);
      if (match != null) {
        const from: number = +match[1];
        const to: number = +match[2];
        const c: string = match[3];
        const password: string = match[4];
        if (this.isValid1(from, to, c, password)) {
          valid1++;
        }
        if (this.isValid2(from, to, c, password)) {
          valid2++;
        }
      }
    });
    console.log(valid1, valid2);
  };

  private isValid1(from: number, to: number, c: string, password: string): boolean {
    const count = password.split(c).length - 1;
    return count >= from && count <= to;
  }

  private isValid2(from: number, to: number, c: string, password: string): boolean {
    const arr = password.split("");
    var cnt = this.checkAt(arr, from, c);
    cnt += this.checkAt(arr, to, c);
    return cnt === 1;
  }

  private checkAt(arr: string[], n: number, c: string): number {
    const len = arr.length;
    return (n <= len && arr[n - 1] === c) ? 1 : 0  
  }  
}

new Solve02();
