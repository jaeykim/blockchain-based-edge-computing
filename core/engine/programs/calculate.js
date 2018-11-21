var Libx = require("./libx.js");

class Calculate extends Libx {
    /*constructor() {
        super();
    }*/

    // TODO: set flag to be called only once
    _constructor() {
    }

    print(input) {
        console.log("this: " + JSON.stringify(this));
        console.log('msg: ' + JSON.stringify(this.msg));
        console.log(`input: ${input}`);
    }
}

var calculate = new Calculate();
calculate.apply();
