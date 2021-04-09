"use strict";

const hub = require("socket.io")(process.env.PORT || 3000);
const axios = require("axios");

let connectedPlayers = [];
let playersReady = 0;
let points;
let round = 0;
let roundTimer = 15;
let interval;

let trivia = {
  // values are dependant on shape of data from API
  question: " Trivia Question ",
  answers: {
    a: "option a",
    b: "option b",
    c: "option c",
    d: "option d",
    correct: "correct answer",
  },
};



const startTimer = () => {
  interval = setInterval(() => {
    if (roundTimer > 0) {
      roundTimer--;
    } else if (roundTimer === 0) {
      clearInterval(interval);
    }
  }, 1000);
};

hub.on('connection', (socket) => {
  console.log('Welcome');

  const startGame = () => {
    nextRound();
  };

  const nextRound = async () => {
    round += 1;
    console.log('The round is: ', round);
    try {
        const response = await axios.get('process.env.API_URL')
        console.log('response', response.results[0].question)
          //question
          trivia.quesiton = response.results[0].question;
          //answers
          trivia.answers.a = response.results[0].incorrect_answers[0];
          trivia.answers.b = response.results[0].incorrect_answers[2];
          trivia.answers.c = response.results[0].correct_answer;
          trivia.answers.d = response.results[0].incorrect_answers[1];
          //correct answer
          trivia.answers.correct = response.results[0].correct_answer;
      } catch (error) {
          console.error("Sorry, the API gave us nothing to work with");
    
    // emit ...with 'trivia' object as payload
    socket.emit("trivia", trivia);
      }
  };
  
  
  
  socket.on('player-connected', payload => {
  
    // console.log('player object: ', payload)
    connectedPlayers.push(payload);
    console.log('Players: ', connectedPlayers)
  
    socket.emit("ready?");
  });
  
  socket.on("player ready", () => {
    playersReady += 1;
    console.log('players ready: ', playersReady)
    if (playersReady === connectedPlayers.length) {
      startGame();
    }
  });
  
  socket.on("answer submitted", (payload) => {
    let reaminingTime = timer;
    let start = 15;
    let possible = 100;
    let points = () => {
      let neg = (start - reaminingTime) * 5;
      return (total = possible - neg);
    };
    if (payload.answer === trivia.answers.correct) {
      connectedPlayers[Object.keys(payload.player)].score += points;
    }
  });


  
})





// --------- TODO --------- //

// Begin a round
// increase round #
// Hit API to retrieve question, selection, and correct answer.
// set those to the respective spots in the 'trivia' object
// emit the trivia object as payload to Player

// listen for 'submitted answer' from player
// capture time left on timer / points value based on that remaining time into temp variable
// compare submitted answer to 'trivia.answers.correct'
// if they match add points earned for that question...value based on reamining time to the player's total score.
// broadcast trivia.answers.correct & all player's scores
