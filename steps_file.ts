// in this file you can append custom step methods to 'I' object

export = function() {
  return actor({
    randomTypo(element,prob=0.05){
      let n = Math.random();
      if (n < prob) {
          let test = element.toLowerCase()
          while (element.toLowerCase() != test) {
             let test =  Math.random().toString(36).slice(-1).toLowerCase()
            }
          this.pressKey(Math.random().toString(36).slice(-1));
      }
    }
    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.

  });
}
