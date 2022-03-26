"use strict";

const $playedWords = $("#words");
const $form = $("#newWordForm");
const $wordInput = $("#wordInput");
const $message = $(".msg");
const $table = $("table");

let gameId;


/** Start */

async function start() {
  let response = await axios.post("/api/new-game");
  gameId = response.data.gameId;
  let board = response.data.board;


  displayBoard(board);
}

/** Display board */

function displayBoard(board) {
  $table.empty();

  for(let i = 0; i < board.length; i++){
    const $row = $("<tr>");
    for(let j = 0; j < board.length; j++){
      const $cell = $("<td>");

      $cell.text(board[i][j]);
      $row.append($cell);

    }
    $table.append($row);
  }
}

/** Check if word is legal and return a response */

async function submitWord(evt) {
  evt.preventDefault();

  const word = $wordInput.val().toUpperCase();
  $wordInput.val("");

  const resp = await axios({
    method: "POST",
    data: {
      "word": word,
      "gameId": gameId
    },
    url: "/api/score-word"
  });

  if (resp.data["result"] === "not-on-board") {
    $message.text(`${word} IS NOT ON THE BOARD!`);
  } else if (resp.data["result"] === "not-word") {
    $message.text(`${word} IS NOT A WORD!`);
  } else {
    $message.text("NICE, YOU GOT A WORD!");
    $playedWords.append($(`<p>${word}</p>`));
  }
}

$form.on('submit', submitWord);
start();