'use strict'


function playHintMode() {
    isHintMode = true
    gGame.hint--
    var elHint = document.querySelector('.hint-container span')
    if (gGame.hint === 2) elHint.innerText = '🔑🔑'
    if (gGame.hint === 1) elHint.innerText = '🔑'
    if (!gGame.hint) elHint.innerText = ''
}


function hintMode(i, j) {
    isHintMode = false
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