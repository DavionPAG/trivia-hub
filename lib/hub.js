'use strict';

const hub = require('socket.io')(port);
const uuid = require('uuid').v4

const port = process.env.PORT || 3000;

let connectedPlayers;
let playersReady;
let points;
let round = 0;
let roundTimer = 15;
let interval;


let trivia = {
    // values are dependant on shape of data from API
    question: ' Trivia Question ',
    answers: {
        a: 'option a',
        b: 'option b',
        c: 'option c',
        d: 'option d',
        correct: 'correct answer',
    }
}

const startGame = () => {
    nextRound()    
}

const nextRound = async () => {
    round ++;
    const question = await axios.get('API_URL') 
    // Hit API... get data
    // set question to question
    // .then (function (res) {
        
    // })

}

const startTimer = () => {

interval = setInterval(() => {
   
    if (roundTimer > 0) {
      roundTimer --;
    } else if (roundTimer === 0) {
      clearInterval(interval);

    }
  
}, 1000);


hub.on('connection', socket => {

})

hub.on('player connected', socket => {
    connectedPlayers ++;

    hub.emit('ready?', payload);
})

hub.on('player ready', socket => {

    if(playersReady === connectedPlayers){
        startGame();
    }


})


