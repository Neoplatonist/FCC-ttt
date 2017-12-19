(function() {
  let notifications = document.getElementById('notification')
  let parent = document.querySelector('.table')
  let state = 'X'

  const move = (e) => {
    if (e.target !== e.currentTarget && e.target.nodeName === "A") {
      if (e.target.textContent === '') {
        e.target.textContent = state

        if (state === 'X') {
          state = 'O'
        } else {
          state = 'X'
        }
      }
    }

    checkWin(e.target.innerHTML)

    e.stopPropagation()
  }

  const checkWin = (player) => {
    let board = document.querySelectorAll('.board-pos')

    let x = (player === 'X') && (
      // Check by row
      (board[0].textContent == player && board[1].textContent == player && board[2].textContent == player) ||
      (board[3].textContent == player && board[4].textContent == player && board[5].textContent == player) ||
      (board[6].textContent == player && board[7].textContent == player && board[8].textContent == player) ||
      // Check by columns
      (board[0].textContent == player && board[3].textContent == player && board[6].textContent == player) ||
      (board[1].textContent == player && board[4].textContent == player && board[7].textContent == player) ||
      (board[2].textContent == player && board[5].textContent == player && board[8].textContent == player) ||
      // Check all diagnonals
      (board[0].textContent == player && board[4].textContent == player && board[8].textContent == player) ||
      (board[2].textContent == player && board[4].textContent == player && board[6].textContent == player)
    )

    let o = (player === 'O') && (
      // Check by row
      (board[0].textContent == player && board[1].textContent == player && board[2].textContent == player) ||
      (board[3].textContent == player && board[4].textContent == player && board[5].textContent == player) ||
      (board[6].textContent == player && board[7].textContent == player && board[8].textContent == player) ||
      // Check by columns
      (board[0].textContent == player && board[3].textContent == player && board[6].textContent == player) ||
      (board[1].textContent == player && board[4].textContent == player && board[7].textContent == player) ||
      (board[2].textContent == player && board[5].textContent == player && board[8].textContent == player) ||
      // Check all diagnonals
      (board[0].textContent == player && board[4].textContent == player && board[8].textContent == player) ||
      (board[2].textContent == player && board[4].textContent == player && board[6].textContent == player)
    )

    let freeCells = board[0].textContent !== '' && board[1].textContent !== '' && board[2].textContent !== '' && board[3].textContent !== '' && board[4].textContent !== '' && board[5].textContent !== '' && board[6].textContent !== '' && board[7].textContent !== '' && board[8] !== ''

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
  }

  const reset = () => {
    let board = document.querySelectorAll('.board-pos')
    let change = document.getElementById('changeType')
    state = 'X'
    change.textContent = 'X START'

    for (let i = 0; i < board.length; i++) {
      board[i].textContent = ''
    }
  }

  const changeType = () => {
    let board = document.querySelectorAll('.board-pos')
    let freeCells = board[0].textContent !== '' || board[1].textContent !== '' || board[2].textContent !== '' || board[3].textContent !== '' || board[4].textContent !== '' || board[5].textContent !== '' || board[6].textContent !== '' || board[7].textContent !== '' || board[8] !== ''

    for (let i = 0; i < board.length; i++) {
      console.log(board[i].textContent)
    }
    console.log(freeCells === false)

    if (!freeCells) {
      let change = document.getElementById('changeType')
      
      if (state === 'X') {
        state = 'O'
        change.textContent = 'O START'
      } else {
        state = 'X'
        change.textContent = 'X START'
      }
    }
  }

  parent.addEventListener('click', move, false)
  document.getElementById('reset').addEventListener('click', reset, false)
  document.getElementById('changeType').addEventListener('click', changeType, false)
})()