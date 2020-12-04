import { FileReader } from "../common";

class Solve04 extends FileReader {

  private passports = []

  private mandatoryKeys: string[] = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"]

  constructor() {
    super();
    this.readData("input.data")
      .then((data) => {
        const lines: string[] = data.split("\n")
        var passport = {}
        this.passports.push(passport)

        lines.forEach(line => {
          if (line.includes(':')) {
            line.split(' ').forEach(pair => {
              const data = pair.split(':')
              passport[data[0]] = data[1]
            })
          } else {
            passport = {}
            this.passports.push(passport)
          } 
        });
        this.checkPassports()
      })
      .catch((err) => console.log(err));
  }

  private checkPassports = () => {
    var valid = 0
    this.passports.forEach(p => {
      if (this.isValid(p)) {
        valid++
      }      
    })
    console.log(valid)
  }

  private isValid = (passport): boolean => {
    for (const key of this.mandatoryKeys) {
      if (!(key in passport)) {
        return false
      }
    }
    return true
  }
}

new Solve04();
