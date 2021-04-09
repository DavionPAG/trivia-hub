"use strict";

const hub = require("socket.io")(process.env.PORT || 3000);
const axios = require("axios");

let connectedPlayers = [{}];
let playersReady;
let points;
let round = 0;
let roundTimer = 15;
let interval;

hub.on('connection', () => {
    console.log('Welcome');
})

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

const startGame = () => {
  nextRound();
};

const nextRound = async () => {
  round++;
  const response = await axios.get("API_URL")
    try {
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
  hub.emit("trivia", trivia);
    }
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

hub.on("player connected", () => {
  //push connected players to an array to manage each player's scores in the hub.
  // this will let us more easily acces things like player score without having to bounce back and forth after each correct answer, then retrieving total score to display between rounds / at end of the game.

  connectedPlayers.push();

  hub.emit("ready?");
});

hub.on("player ready", () => {
  playersReady++;
  if (playersReady === connectedPlayers.length) {
    startGame();
  }
});

hub.on("answer submitted", (payload) => {
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
