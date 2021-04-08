const minimist = require('minimist');
class Input {
    constructor() {
        let args = minmist(process.argv.slice(2));
        this.command = this.validate(args);
    }
}

validate(args){
    let possibleArgs = {
        a: 'answer A';
        A: 'answer A';
        b: 'b'
    }
}

