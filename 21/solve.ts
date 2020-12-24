import { FileReader } from "../common";

interface AllergenMap {
  [allergen: string]: Array<Array<string>>;
}

interface MatchMap {
  [food: string]: string
}

interface FoodStat {
  [food: string]: number
}

class Solve21 extends FileReader {
  private map: AllergenMap = {};
  private match: MatchMap = {}
  private foodStat: FoodStat = {}

  private init = async () => {
    try {
      const rawData = await this.readData("input.data");
      for (let line of rawData.split("\n")) {
        const parts = line.replace(")", "").split(" (contains ");
        const foods = parts[0].split(" ");
        for (let allergen of parts[1].split(", ")) {
          const foodsList = this.map[allergen] || [];
          foodsList.push(foods);
          this.map[allergen] = foodsList;          
        }
        for (let food of foods) {
          this.foodStat[food] = (this.foodStat[food] || 0) + 1
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
    //console.log("***");
    for (let food of Object.keys(this.match)) {
      console.log(food, this.match[food])
    }
    let cnt = 0
    for (let food of Object.keys(this.foodStat)) {
      if (this.match[food] === undefined) {
        cnt += this.foodStat[food]
      }
    }
    console.log(cnt)
    // for (let allergen of Object.keys(this.map)) {
    //   console.log(allergen, this.map[allergen]);
    // }
  };

  private process = () => {    
    while(true) {      
      let toProcess = false
      for (let allergen of Object.keys(this.map)) {
        const found = this.findFood(this.map[allergen])
        if (found.length === 1) {
          this.match[found[0]] = allergen
          toProcess = true
        }
        //console.log(allergen, found)
      }
      if (!toProcess) {
        break
      }
    }
  };

  private findFood = (foods: Array<Array<string>>): string[] => {
    const result: string[] = []
    const toTest = [...foods[0]].filter(f => !Object.keys(this.match).includes(f))
    while (toTest.length > 0) {
      const food = toTest.pop()
      let found = true
      for (let foodArray of foods) {
        if (!foodArray.includes(food!)) {
          found = false
          break
        }
      }
      if (found) {
        result.push(food!)
      }
    }
    return result
  }

  // private clearAllergen = (allergen: string, exceptFood: string) => {
  //   for (let food of Object.keys(this.map)) {
  //     if (food === exceptFood) {
  //       continue;
  //     }
  //     const allergens = this.map[food];
  //     if (Object.keys(allergens).includes(allergen)) {
  //       //console.log('clear', allergen, food, allergens)
  //       delete allergens[allergen];
  //     }
  //   }
  // };

  // private getAllergen = (
  //   allergens: FoodStat,
  //   value: number
  // ): string | undefined => {
  //   for (let allergen of Object.keys(allergens)) {
  //     if (allergens[allergen] === value) {
  //       return allergen;
  //     }
  //   }
  //   return undefined;
  // };
}

new Solve21().run();
