'use strict'


const FLAG = '🏳️'
const MINE = '💥'
const EMPTY = ' '


// The model:
//globals:
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    life: 3,
    hint: 3
}


var gLevel = {
    size: 8,
    mines: 12
}

var gBoard;

var gCells;
var gIntervalID;
var gStartTime = 0
var isHintMode = false



function initGame() {
    endTimer()
    gGame.life = 3
    gGame.hint = 3
    var elHint = document.querySelector('.hint-container span')
    elHint.innerText = '🔑🔑🔑'
    var elLife = document.querySelector('.life span')
    elLife.innerText = '❤❤❤'
    gBoard = buildBoard(gBoard, gLevel.size)
    renderBoard(gBoard)
    var elStatus = document.querySelector('.status')
    elStatus.innerText = '😀'
    gGame.isOn = false
}


function buildBoard(board, boardSize) {

    var board = [];

    for (var i = 0; i < boardSize; i++) {
        board.push([i])
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = createCell()
        }
    }

    return board;

}

function createMines(board) {

    getRandomCells(board)
    for (var i = 0; i < gLevel.mines; i++) {
        shuffleArray(gCells)
        var mineCell = drawNum(gCells)
        board[mineCell.i][mineCell.j].isMine = true
    }

}


function getLevel(elBtn) {
    console.log('elBtn', elBtn)
    if (elBtn.innerText === 'Easy') {
        gLevel.size = 4
        gLevel.mines = 3
    }
    else if (elBtn.innerText === 'Medium') {
        gLevel.size = 8
        gLevel.mines = 12
    }
    else {
        gLevel.size = 12
        gLevel.mines = 30
    }
    initGame()

}

function createCell() {
    var cell = {
        minesAroundCount: EMPTY,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell
}

function getRandomCells(gBoard) {
    gCells = []
    for (var i = 0; i < gBoard.length - 1; i++) {
        for (var j = 0; j < gBoard.length - 1; j++) {
            gCells.push({ i, j })
        }
    }

}


function setMinesNegsCount(board) {
    var newBoard = copyMat(board)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {

            var numOfNeighbors = countNeighbors(i, j, board);
            if (numOfNeighbors === 0) newBoard[i][j].minesAroundCount = EMPTY
            if (numOfNeighbors === 1) newBoard[i][j].minesAroundCount = 1
            if (numOfNeighbors === 2) newBoard[i][j].minesAroundCount = 2
            if (numOfNeighbors === 3) newBoard[i][j].minesAroundCount = 3
            if (numOfNeighbors === 4) newBoard[i][j].minesAroundCount = 4
        }
    }

    console.log('newBoard', newBoard)
    return newBoard;

}


function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;

            if (mat[i][j].isMine) neighborsCount++;
        }
    }
    return neighborsCount;
}

function renderBoard(board) {

    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j]
            var className = (cell.isMine) ? 'mine' : ''
            var innerSymbol = (cell.isMine) ? MINE : cell.minesAroundCount
            if (!cell.isShown) {

                className = 'cover'
                innerSymbol = EMPTY
            }
            else innerSymbol = innerSymbol
            if (innerSymbol === 1) className = 'one'
            if (innerSymbol === 2) className = 'two'
            if (innerSymbol === 3) className = 'three'
            if (innerSymbol === 4) className = 'four'

            if (cell.isMarked) innerSymbol = FLAG

            strHTML += `<td oncontextmenu="cellMarked(this,${i}, ${j})" onclick="cellClicked(this, ${i}, ${j})" class="${className}" >${innerSymbol}</td>`
            // data-i="${i}" data-j="${j}"
        }
        strHTML += '</tr>'
    }

    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}


function cellClicked(elCell, i, j) {

    console.log(elCell, i, j);
    if (!gBoard[i][j].isMarked && !gBoard[i][j].isShown) {

        if (!gGame.isOn) {
            createMines(gBoard)
            setMinesNegsCount(gBoard)
            gGame.isOn = true
            startTimer()

        } if (gGame.isOn) {
            gBoard[i][j].isShown = true
            renderBoard(gBoard)
            checkGameOver()
        }
        if (isHintMode) {
            hintMode(i, j)
        } else if (gBoard[i][j].minesAroundCount === EMPTY && !gBoard[i][j].isMine) {
            expandShown(elCell, i, j)
        }
    }
    if (gBoard[i][j].isMine) {
        //model
        gGame.life--
        //dom
        var elLife = document.querySelector('.life span')
        if (gGame.life === 2) elLife.innerText = '❤❤'
        else if (gGame.life === 1) elLife.innerText = '❤'
        else if (gGame.life === 0) {
            elLife.innerText = ''
            checkIsMine()
            checkGameOver()
            renderBoard(gBoard)
        }
    }
}





function checkIsMine() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine) currCell.isShown = true
        }
    }
}

function cellMarked(elCell, i, j) {

    if (!gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
        gBoard[i][j].isMarked = true
        renderBoard(gBoard)
        gGame.markedCount++

    }
    else {
        gBoard[i][j].isMarked = false
        renderBoard(gBoard)
    }

    checkGameOver()
}

function checkGameOver() {
    if (gGame.isOn) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                if (gBoard[i][j].isMine && gBoard[i][j].isShown && gGame.life === 0) {
                    console.log('gGame.life', gGame.life)
                    console.log('you lost');

                    var elStatus = document.querySelector('.status')
                    elStatus.innerText = '😭'
                    endTimer()
                    return
                }
                gBoard[i][j].shownCount = 0
            }
        }
    }

    checkVictory()

}

function checkVictory() {
    var count = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isShown && !currCell.isMine) {
                currCell.shownCount++
                if (currCell.shownCount === 1) {
                    count++

                    if (gGame.markedCount === gLevel.mines && count === (gLevel.size ** 2) - gLevel.mines) {
                        console.log('you won!');
                        endTimer()
                        var elStatus = document.querySelector('.status')
                        elStatus.innerText = '😍'

                    }

                }

            }

        }
    }
}


function checkNeighbors(cellI, cellJ, mat) {
    // var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (!mat[i][j].isShown && mat[i][j].minesAroundCount && !mat[i][j].isMine) {
                mat[i][j].isShown = true

            }
        }
    }
}


function expandShown(elCell, i, j) {
    checkNeighbors(i, j, gBoard)
    renderBoard(gBoard)
    checkGameOver()
}


function startTimer() {
    var elSeconds = document.querySelector('.seconds');

    gStartTime = Date.now()
    gIntervalID = setInterval(function () {
        var timeDiff = Date.now() - gStartTime
        elSeconds.innerText = timeDiff / 1000;

    }, 100);
}

function endTimer() {
    clearInterval(gIntervalID);
}



document.addEventListener("contextmenu", function (free) {
    free.preventDefault()
})

