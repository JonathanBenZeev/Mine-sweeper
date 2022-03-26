'use strict'


function playHintMode() {
    gisHintMode = true
    gGame.hint--
    var elHint = document.querySelector('.hint-container span')
    if (gGame.hint === 2) elHint.innerText = '🔑🔑'
    if (gGame.hint === 1) elHint.innerText = '🔑'
    if (!gGame.hint) elHint.innerText = ''
}


function hintMode(i, j) {
    gisHintMode = false
    if (gGame.hint < 0) return

    expandShownHint(i, j, gBoard)

    setTimeout(function () {
        removeExpandShown(i, j, gBoard)

    }, 1000)




}


function removeExpandShown(cellI, cellJ, mat) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].isShown) {
                mat[i][j].isShown = false

            }
        }
    }

    renderBoard(gBoard)

}


function expandShownHint(cellI, cellJ, mat) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (!mat[i][j].isShown) {
                mat[i][j].isShown = true
            }
        }
    }
    renderBoard(gBoard)
}


// function playSafeMode() {
//     gIsSafe = true
//     gGame.safe--
//     var elSafe = document.querySelector('.safe-click span')
//     if (gGame.safe === 2) elSafe.innerText = '2 clicks available'
//     if (gGame.safe === 1) elSafe.innerText = '1 clicks available'
//     if (!gGame.safe) elSafe.innerText = '0 clicks available'
// }


// function safeClick(i,j){
//     gIsSafe = false
//     if (gGame.safe < 0) return

//     expandSafeClick(i, j, gBoard)

//     setTimeout(function () {
//         removeSafeClick(i, j, gBoard)

//     }, 1000)
// }



// function removeSafeClick(cellI, cellJ, mat) {

//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= mat.length) continue;
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (j < 0 || j >= mat[i].length) continue;
//             if (!mat[i][j].isShown) {
//                 var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
//                 elCell.classList.add('cover')

//             }
//         }
//     }

//     renderBoard(gBoard)

// }


// function expandSafeClick(cellI, cellJ, mat) {

//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= mat.length) continue;
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (j < 0 || j >= mat[i].length) continue;
//             if (!mat[i][j].isShown) {
//                 var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
//                elCell.classList.remove('cover')
//             }
//         }
//     }
//     renderBoard(gBoard)
// }