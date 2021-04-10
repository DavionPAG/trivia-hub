'use strict';

const io = require('socket.io-client');
const host = 'http://localhost:3000';
const userSocket = io.connect(host);

let player = {
    name: ' ',
    score: 0,
}

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// userSocket.emit('player-connected', 20)

userSocket.on('connect', async () => {

        rl.question('Please enter your name \n', (name) => {
        player.name = name;
        console.log(`Thank you ${name}`);
        console.log('player object: ', player);      
        userSocket.emit('player-connected', player);
        // rl.close();
        })
})

userSocket.on('ready?', async () => {

    rl.question(
        'Are you ready to start? \n Type START when you are ready. \n', 
        (answer) => {
            console.log('answer: ', answer);
            if(answer.toUpperCase() === 'START'){
                console.log('I am in the comparison');
                userSocket.emit(`player ready`);
                // rl.close();
            } else{
                console.log('Good luck. You are going to need it since you can\t follow directions');        
        }        
    })    
})

userSocket.on('trivia', (payload) => {
    rl.question(
        `${payload.question} \n
            a: ${payload.answers.a} \n
            b: ${payload.answers.b} \n
            c: ${payload.answers.c} \n
            d: ${payload.answers.d} \n
        `, (answer) => {
            console.log('payload in trivia func: ', payload)
            switch(answer.toUpperCase()){
                case 'A':
                    answer = payload.answers.a;
                break;
                case 'B':
                    answer = payload.answers.b;
                break;
                case 'C':
                    answer = payload.answers.c;
                    console.log('answer in switch: ', answer)
                break;
                case 'D':
                    answer = payload.answers.d;
                break;
                default:
                console.log('Sorry, that is not an option.');
            }
            console.log('answer: ', answer);
            userSocket.emit(
                'answer submitted', 
                {answer, player: player.name}
            )

            }
        )
    // **** might need to add an 'abort controller' to abort the input ...using a setTimeout function to match the time of the timer.
})

// --------- TODO --------- //


// listen for 'trivia' --receive 'trivia' object as payload
// make a rl.question that uses that payload --'trivia' object and sets the first param --'string'-- as the quetion and selections... ie.  ` ${payload.quetion}   .... a: ${first selection}  .... b: ${second slection}, etc...
// emit sumbitted answer to hub

