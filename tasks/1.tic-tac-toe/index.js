const config = {
    isComputerSecondPlayer: true,
    isComputerRandomMove: false,
    dimension: 3,
}

const CROSS = 'X'
const ZERO = 'O'
const EMPTY = ' '
let gameStop = false

const field = []
let currentSymbol = CROSS

let { dimension } = config

const container = document.getElementById('fieldWrapper')

startGame()
addResetListener()

function startGame() {
    setFieldDimension()
    renderGrid(dimension)
}

function setFieldDimension() {
    let userDimension = Number(prompt('Введите размер поля', String(config.dimension)))
    if (userDimension) {
        dimension = userDimension
    } else {
        dimension = config.dimension
    }
}

function getCell(field, row, column) {
    return field && field[row] && field[row][column]
}

function fillField(field, prevField) {
    field.length = 0
    for (let i = 0; i < dimension; i++) {
        let fieldRow = []
        for (let j = 0; j < dimension; j++) {
            fieldRow.push(getCell(prevField, i - 1, j - 1) || EMPTY)
        }
        field.push(fieldRow)
    }
}

function renderGrid(dimension, prevField) {
    container.innerHTML = ''
    
    fillField(field, prevField)
    
    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr')
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td')
            cell.textContent = field[i][j]
            cell.addEventListener('click', () => cellClickHandler(i, j))
            row.appendChild(cell)
        }
        container.appendChild(row)
    }
}

function setNextPlayer() {
    currentSymbol = currentSymbol === CROSS ? ZERO : CROSS
}

function cellClickHandler(row, col) {
    if (gameStop || field[row][col] !== EMPTY) {
        return
    }
    
    field[row][col] = currentSymbol
    renderSymbolInCell(field[row][col], row, col)
    
    expandField(field)
    
    checkEndGame(field)
    setNextPlayer()
    
    if (config.isComputerSecondPlayer) {
        computerMove()
    }
}

function expandField(field) {
    if (isMoreThenHalf(field)) {
        dimension += 2
        renderGrid(dimension, [...field])
    }
}

function isMoreThenHalf(field) {
    const total = dimension * dimension
    let countFilled = 0
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (field[i][j] !== EMPTY) {
                countFilled++
            }
        }
    }
    return countFilled > total / 2
}

function computerMove() {
    if (currentSymbol !== ZERO && !gameStop) {
        return
    }
    const [row, column] = findComputerMove(field)
    if (Number.isFinite(row)) {
        cellClickHandler(row, column)
    }
}

function findComputerMove(field) {
    if (config.isComputerRandomMove) {
        return findRandomCell(field)
    }
    return findSmartMove(field)
}

function findRandomCell(field) {
    const emptyCells = []
    field.forEach((row, i) => row.forEach((cell, j) => {
        if (cell === EMPTY) {
            emptyCells.push([i, j])
        }
    }))
    const randomIndex = Math.floor(Math.random() * emptyCells.length)
    return emptyCells[randomIndex] || []
}

function findSmartMove(field) {
    const lines = []
    
    for (let i = 0; i < dimension; i++) {
        if (checkLineIsValid(field[i])) {
            const line = []
            for (let j = 0; j < dimension; j++) {
                line.push({ row: i, column: j, value: field[i][j] })
            }
            lines.push(line)
        }
    }
    
    for (let i = 0; i < dimension; i++) {
        const column = []
        for (let j = 0; j < dimension; j++) {
            column.push(field[j][i])
        }
        if (checkLineIsValid(column)) {
            const line = []
            for (let j = 0; j < dimension; j++) {
                line.push({ row: j, column: i, value: field[j][i] })
            }
            lines.push(line)
        }
    }
    
    const diagMain = []
    for (let i = 0; i < dimension; i++) {
        diagMain.push(field[i][i])
    }
    if (checkLineIsValid(diagMain)) {
        const line = []
        for (let i = 0; i < dimension; i++) {
            line.push({ row: i, column: i, value: field[i][i] })
        }
        lines.push(line)
    }
    
    const diagSecond = []
    for (let i = 0; i < dimension; i++) {
        diagSecond.push(field[i][dimension - 1 - i])
    }
    if (checkLineIsValid(diagSecond)) {
        const line = []
        for (let i = 0; i < dimension; i++) {
            line.push({ row: i, column: dimension - 1 - i, value: field[i][dimension - 1 - i] })
        }
        lines.push(line)
    }
    lines.sort((line1, line2) => line2.filter(l => l.value !== EMPTY).length
        - line1.filter(l => l.value !== EMPTY).length,
    )
    
    const perfectLine = lines[0]
    if (!perfectLine) {
        return findRandomCell(field)
    }
    
    const { row, column } = perfectLine.find(line => line.value === EMPTY) || {}
    return [row, column]
}

function checkEndGame(field) {
    const { winner, cells } = checkRow(field) || checkColumn(field) || checkDiagonals(field) || {}
    if (winner) {
        paintBackground(field, cells)
        finishGame(`Победил ${winner}`)
    } else if (checkDraw(field)) {
        finishGame(`Победила дружба`)
    }
}

function stopGame() {
    gameStop = true
}

function finishGame(text) {
    stopGame()
    alertMessage(text)
}

/**
 * Чтобы выводить сообщение после рендера
 */
function alertMessage(text) {
    setTimeout(() => alert(text), 0)
}

function checkSymbolsArray(array) {
    const set = new Set(array)
    if (set.size === 1 && !set.has(EMPTY)) {
        return [...set][0]
    }
}

function checkLineIsValid(array) {
    return !array.includes(CROSS)
}

function checkRow(field) {
    for (let i = 0; i < dimension; i++) {
        const winner = checkSymbolsArray(field[i])
        if (winner) {
            const cells = []
            for (let j = 0; j < dimension; j++) {
                cells.push([i, j])
            }
            return { winner, cells }
        }
    }
}

function checkColumn(field) {
    for (let i = 0; i < dimension; i++) {
        const column = []
        for (let j = 0; j < dimension; j++) {
            column.push(field[j][i])
        }
        const winner = checkSymbolsArray(column)
        if (winner) {
            return {
                winner,
                cells: Array.from({ length: dimension }).map((elem, j) => [j, i]),
            }
        }
    }
}

function checkDiagonals(field) {
    const diag1 = []
    for (let i = 0; i < dimension; i++) {
        diag1.push(field[i][i])
    }
    
    let winner = checkSymbolsArray(diag1)
    if (winner) {
        return {
            winner,
            cells: Array.from({ length: dimension }).map((e, i) => [i, i]),
        }
    }
    
    const diag2 = []
    for (let i = 0; i < dimension; i++) {
        diag2.push(field[i][dimension - 1 - i])
    }
    winner = checkSymbolsArray(diag2)
    if (winner) {
        return {
            winner,
            cells: Array.from({ length: dimension }).map((e, i) => [i, dimension - 1 - i]),
        }
    }
}

function checkDraw(field) {
    return field.every(row => row.every(cell => cell !== EMPTY))
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col)
    
    targetCell.textContent = symbol
    targetCell.style.color = color
}

function paintBackground(field, cells) {
    cells.forEach(([row, column]) => changeBackgroundColorInCell(row, column))
}

function changeBackgroundColorInCell(row, col, color = 'red') {
    const targetCell = findCell(row, col)
    
    targetCell.style.backgroundColor = color
}

function findCell(row, col) {
    const targetRow = container.querySelectorAll('tr')[row]
    return targetRow.querySelectorAll('td')[col]
}

function addResetListener() {
    const resetButton = document.getElementById('reset')
    resetButton.addEventListener('click', resetClickHandler)
}

function setDefaults() {
    currentSymbol = CROSS
    gameStop = false
}

function resetClickHandler() {
    setDefaults()
    startGame()
}


/* Test Function */

/* Победа первого игрока */
function testWin() {
    clickOnCell(0, 2)
    clickOnCell(0, 0)
    clickOnCell(2, 0)
    clickOnCell(1, 1)
    clickOnCell(2, 2)
    clickOnCell(1, 2)
    clickOnCell(2, 1)
}

/* Ничья */
function testDraw() {
    clickOnCell(2, 0)
    clickOnCell(1, 0)
    clickOnCell(1, 1)
    clickOnCell(0, 0)
    clickOnCell(1, 2)
    clickOnCell(1, 2)
    clickOnCell(0, 2)
    clickOnCell(0, 1)
    clickOnCell(2, 1)
    clickOnCell(2, 2)
}

function clickOnCell(row, col) {
    findCell(row, col).click()
}
