'use strict';

const io = require('socket.io-client');
const userSocket = io.connect(port);

let player = {
    name = ' ',
    score,
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


userSocket.on('connect', payload => {

        rl.question('Please enter your name', function(name) {
        player.name = name;
        console.log(`Thank you ${name}`);
        io.emit('player connected', player)
        rl.close();
       })
})

io.on('ready?', () => {
    rl.question('Are you ready to start? \n Type START when you\'re ready.', (answer)  =>{
        if(answer.toUpperCase() === 'START'){
            io.emit(`player ready`);
            rl.close();
        } esle {
            console.log('Good luck. You are going to need it since you can\t follow directions');        
        }        
    })

    
})

io.on('trivia', (payload) => {
    rl.question(
        `${payload.question} \n
            a: ${payload.answers.a} \n
            b: ${payload.answers.b} \n
            c: ${payload.answers.c} \n
            d: ${payload.answers.d} \n
        `, (answer) => {
            io.emit('answer submitted', answer)
    })
    // **** might need to add an 'abort controller' to abort the input ...using a setTimeout function to match the time of the timer.
})

// --------- TODO --------- //


// listen for 'trivia' --receive 'trivia' object as payload
// make a rl.question that uses that payload --'trivia' object and sets the first param --'string'-- as the quetion and selections... ie.  ` ${payload.quetion}   .... a: ${first selection}  .... b: ${second slection}, etc...
// emit sumbitted answer to hub

