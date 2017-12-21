$(document).ready(function() { 
  // $('.modal').modal({
  //   dismissible: false
  // });
  // $('#modal1').modal('open');
  $('select').material_select();
});


(function() {
  let notifications = document.getElementById('notification')
  let parent = document.querySelector('.table')

  let state = {
    ai: {
      board: [],
      numBoard: [],
      numTurn: 0,
      turn: ''
    },
    board: [], // 9 positions
    gameStarted: false,
    playerX: 'human',
    playerO: 'human',
    turn: 'X'
  }

  const convert = (value) => {
    let type = typeof value

    if (type === 'string') {
      switch (value) {
        case 'X':
          return 1
          break
        case '':
          return 0
          break
        case 'O':
          return -1
          break
      }
    } else {
      switch (value) {
        case 1:
          return 'X'
          break
        case 0:
          return ''
          break
        case -1:
          return 'O'
          break
      }
    }
  }

  const move = (e) => {
    if (e.target !== e.currentTarget && e.target.nodeName === "A") {
      if (e.target.textContent === '') {
        e.target.textContent = state.turn

        if (!state.gameStarted) {
          state.gameStarted = true

          $('select').prop('disabled', true)
          $('select').material_select()
        }

        if (state.turn === 'X') {
          state.ai.turn = state.turn = 'O'
        } else {
          state.ai.turn = state.turn = 'X'
        }

        state.ai.board = state.board = moveBoard()
        checkWin(e.target.innerHTML, state.board)
        
        if (state.playerX === 'ai' || state.playerO === 'ai') {
          aiMove()
        }
      }
    }

    e.stopPropagation()
  }

  const moveBoard = () => {
    let board = new Array()
    let pos = document.querySelectorAll('.board-pos')

    for (let i = 0; i < pos.length; i++) {
      board.push(pos[i].textContent)
    }

    return board
  }

  const checkWin = (player, board) => {
    let x = (player === 'X') && (
      // Check by row
      (board[0] === player && board[1] === player && board[2] === player) ||
      (board[3] === player && board[4] === player && board[5] === player) ||
      (board[6] === player && board[7] === player && board[8] === player) ||
      // Check by columns
      (board[0] === player && board[3] === player && board[6] === player) ||
      (board[1] === player && board[4] === player && board[7] === player) ||
      (board[2] === player && board[5] === player && board[8] === player) ||
      // Check all diagnonals
      (board[0] === player && board[4] === player && board[8] === player) ||
      (board[2] === player && board[4] === player && board[6] === player)
    )

    let o = (player === 'O') && (
      // Check by row
      (board[0] === player && board[1] === player && board[2] === player) ||
      (board[3] === player && board[4] === player && board[5] === player) ||
      (board[6] === player && board[7] === player && board[8] === player) ||
      // Check by columns
      (board[0] === player && board[3] === player && board[6] === player) ||
      (board[1] === player && board[4] === player && board[7] === player) ||
      (board[2] === player && board[5] === player && board[8] === player) ||
      // Check all diagnonals
      (board[0] === player && board[4] === player && board[8] === player) ||
      (board[2] === player && board[4] === player && board[6] === player)
    )

    let freeCells = board[0] !== '' && board[1] !== '' && board[2] !== '' && board[3] !== '' && board[4] !== '' && board[5] !== '' && board[6] !== '' && board[7] !== '' && board[8] !== ''

    if (x && !o) {
      notifications.style.display = 'block'
      notifications.textContent = 'Player X Wins!'
      parent.removeEventListener('click', move, false)
    }

    if (o && !x) {
      notifications.style.display = 'block'
      notifications.textContent = 'Player O Wins!'
      parent.removeEventListener('click', move, false)
    }

    if (freeCells) {
      notifications.style.display = 'block'
      notifications.textContent = 'Draw!'
      parent.removeEventListener('click', move, false)
    }

    return false
  }

  const checkWinAi = (board) => {
    let wins = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ]

    for (let i = 0; i < 8; i++) {
      if (
        board[wins[i][0]] !== 0 &&
        board[wins[i][0]] === board[wins[i][1]] &&
        board[wins[i][0]] === board[wins[i][2]]
      ) {
        return board[wins[i][2]]
      }
    }

    return 0
  }

  const reset = () => {
    let board = document.querySelectorAll('.board-pos')
    let change = document.getElementById('changeType')

    state.turn = 'X'
    change.textContent = 'X START'
    state.gameStarted = false

    for (let i = 0; i < board.length; i++) {
      board[i].textContent = ''
    }

    $('select').prop('disabled', false)
    $('select').val('human')
    $('select').material_select()
    parent.addEventListener('click', move, false)

    notifications.textContent = ''
    notifications.style.display = 'none'
  }

  const changeType = () => {
    if (!state.gameStarted) {
      let change = document.getElementById('changeType')
      
      if (state.turn === 'X') {
        state.turn = 'O'
        change.textContent = 'O START'
      } else {
        state.turn = 'X'
        change.textContent = 'X START'
      }
    }
  }

  const aiMove = () => {
    // Convert ai.board to numBoard
    let move = -1
    let score = -2
    let tempScore = 0

    for (let i = 0; i < 9; i++) {
      state.ai.numBoard[i] = convert(state.ai.board[i])
    }

    state.ai.numTurn = convert(state.turn)

    for (let i = 0; i < 9 && checkWinAi(state.ai.numBoard) === 0; i++) {
      if (state.ai.numBoard[i] === 0) {
        state.ai.numBoard[i] = state.ai.numTurn

        console.log('numboard before/after')
        console.log(state.ai.numBoard)
        let board = state.ai.numBoard
        tempScore = -negamax(state.ai.numTurn * -1, board)
        console.log(state.ai.numBoard)

        state.ai.numBoard[i] = 0

        if (tempScore > score) {
          score = tempScore
          console.log('Updated AI Move')
          move = i
          console.log(move)
        }
      }
    }

    aiRender(move) // use the state.ai.move
    checkWin(state.turn, state.board)

    if (state.turn === 'X') {
      state.turn = 'O'
    } else {
      state.turn = 'X'
    }
  }

  const aiRender = (move) => {
    console.log('Ai renders')
    let pos = document.querySelectorAll('.board-pos')

    for (let i = 0; i < 9; i++) {
      console.log(i)
      if (move === i) {
        console.log(move)
        pos[i].innerHTML = state.turn

        console.log('State Turn placed in pos ^ ' + pos[i].innerHTML)
        state.board[i] = state.turn
      }
    }
  }

  const negamax = (player, board) => {
    let winner = checkWinAi(board)
    if (winner !== 0) {
      return player * winner
    }

    let move = -1
    let score = -2

    for (let i = 0; i < 9; i++) {
      if (board[i] === 0) {
        board[i] = player

        let thisScore = -negamax(player * -1, board)

        if (thisScore > score) {
          score = thisScore
          move = i
        }

        board[i] = 0
      }
    }

    if (move === -1) {
      return 0
    }

    return score
  }

  const playerChange = (e) => {
    if (!state.gameStarted) {
      let player = e.target.value

      switch (e.target.id) {
        case 'changeX':
          if (player === 'ai') {
            state.playerX = 'ai'
            state.ai.board = state.board = moveBoard()
            aiMove()
          } else {
            state.playerX = 'human'
          }
          break
        case 'changeO':
          if (player === 'ai') {
            state.playerO = 'ai'

            if (state.playerX === 'ai') {
              $('select').prop('disabled', false)
              $('select').material_select()

              aiMove()
            }
          } else {
            state.playerO = 'human'
          }
          break
        default:
          break
      }
    }
  }

  parent.addEventListener('click', move, false)
  document.getElementById('reset').addEventListener('click', reset, false)
  document.getElementById('changeType').addEventListener('click', changeType, false)
  document.getElementById('changeX').onchange = playerChange
  document.getElementById('changeO').onchange = playerChange
})()


// Negamax Init

// Recursive
// func Negamax(board []int, player int) int {
// 	winner := tttBoard.CheckWinAi(board)
// 	if winner != 0 {
// 		return player * winner
// 	}

// 	move := -1
// 	score := -2

// 	// goes through all possible moves on board
// 	for i := 0; i < 9; i++ {
// 		// checks if position on board is empty
// 		if board[i] == 0 {
// 			// tries the move
// 			board[i] = player

// 			thisScore := -Negamax(board, player*-1)

// 			if thisScore > score {
// 				score = thisScore
// 				move = i
// 			}

// 			board[i] = 0
// 		}
// 	}

// 	if move == -1 {
// 		return 0
// 	}

// 	return score
// }