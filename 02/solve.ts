import { FileReader } from "../common";

class Solve02 extends FileReader {
  private passwords = [];

  constructor() {
    super();
    this.readData("input.data")
    //this.readData("test.data")
      .then((data) => {
        this.passwords = data.split("\n");
        this.process();
      })
      .catch((err) => console.log(err));
  }

  private process = () => {
    var valid = 0;
    this.passwords.forEach((line) => {
      const regex: RegExp = /(\d+)-(\d+) (\w): (\w+)/;
      const match: RegExpExecArray = regex.exec(line);
      if (match != null) {
        const from: number = +match[1];
        const to: number = +match[2];
        const c: string = match[3];
        const password: string = match[4];
        if (this.isValid(from, to, c, password)) {
          valid++;
        }
      }
    });
    console.log(valid);
  };

  private isValid(
    from: number,
    to: number,
    c: string,
    password: string
  ): boolean {
    const count = password.split(c).length - 1;
    return count >= from && count <= to;
  }
}

new Solve02();
