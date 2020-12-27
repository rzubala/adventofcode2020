
const key = (subject: number, loop: number): number => {
  let val = 1
  for (let i=0;i<loop;i++) {
    val = val * subject
    val = val % 20201227
  }
  return val
}

const loop = (key: number): number => {
  let val = 1
  let subject = 7
  let loop = 1
  while(true) {
    val = val * subject
    val = val % 20201227
    if (val === key) {
      return loop
    }
    loop++
  }
  return 1
}

class Solve25 {
  public process = () => {
    const loop1 = loop(1965712)
    const loop2 = loop(19072108)

    console.log(key(1965712, loop2))
    console.log(key(19072108, loop1))
  };
}

new Solve25().process();
