var Libx = require("./libx.js");

class State extends Libx {
    _constructor() {
        console.log("constructor");
        this.a = 0;
        this.end();
    }

    update(_a) {
        console.log("update");
        this.a = _a;
        this.end();
    }

    print() {
        console.log("print: " + this.a);
    }
}

//var state = new State();
new State().apply();
