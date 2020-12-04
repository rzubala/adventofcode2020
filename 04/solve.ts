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
    var required = 0, valid = 0
    this.passports.forEach(p => {
      if (this.isRequired(p)) {
        required++
        if (this.isValid(p)) {
          valid++;
        }
      }      
    })
    console.log(required, valid)
  }

  private isRequired = (passport): boolean => {
    for (const key of this.mandatoryKeys) {
      if (!(key in passport)) {
        return false
      }
    }
    return true
  }

  private isValid = (passport): boolean => {
    const byr = passport['byr']
    if (!/([0-9]{4})/.test(byr) || +byr < 1920 || +byr > 2002) {
      return false;
    }
    const iyr = passport['iyr']
    if (!/([0-9]{4})/.test(iyr) || +iyr < 2010 || +iyr > 2020) {
      return false;
    }
    const eyr = passport['eyr']
    if (!/([0-9]{4})/.test(eyr) || +eyr < 2020 || +eyr > 2030) {
      return false;
    }
    const hgt = passport['hgt']
    const hgtregex: RegExp = /(\d+)(cm|in)/;
    const hgtmatch: RegExpExecArray = hgtregex.exec(hgt);
    if (hgtmatch != null) {
      const hgtn: number = +hgtmatch[1];
      const unit = hgtmatch[2];
      if (unit === 'cm' && (+hgtn < 150 || +hgtn > 193)) {      
        return false
      } else if (unit === 'in' && (+hgtn < 59 || +hgtn > 76)) {    
        return false
      }
    } else {
      return false;
    }
    const hcl = passport['hcl']
    if (hcl.length !== 7 || !/(#[0-9a-f]{6})/.test(hcl)) {
      return false
    }
    const ecl = passport['ecl']
    if (ecl.length !== 3 || !/(amb|blu|brn|gry|grn|hzl|oth)/.test(ecl)) {
      return false
    }
    const pid = passport['pid']
    if (pid.length !== 9 || !/([0-9]{9})/.test(pid)) {
      return false
    }
    return true
  }
}

new Solve04();
