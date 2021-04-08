'use strict';

const io = require('socket.io-client');
const userSocket = io.connect(port);

let player = {
    name = ' ',
    score,
}

const readline = requir('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


userSocket.on('connect', socket => {

        rl.question('Please enter your name', function(name) {
        player.name = name;
        console.log(`Thank you ${name}`);
        io.emit('player connected', payload)
        rl.close();
       })
})

io.on('ready?', socket => {
    rl.question('Are you ready to start? ... type START when ready.', function(answer) {
        if(answer.toUpperCase() === 'START'){
            io.emit(`player ready`);
            rl.close();
        } esle {
            console.log('Good luck. You are going to need it since you can\t follow directions');        
        }        
    })
})