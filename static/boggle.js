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
  // loop over board and create the DOM tr/td structure

  for(let i = 0; i < board.length; i++){

    const $row = $("<tr>")

    for(let j = 0; j < board.length; j++){

      const $cell = $("<td>")
      $cell
      .addClass(`${[i]}-${[j]}`)
      .text(board[i][j])
      $row.append($cell)
    }
    $table.append($row)
  }
}

start();