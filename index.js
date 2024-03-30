const canvas = document.getElementById("myCanvas");
const undoBtn = document.getElementById("undo");
const wordBtn = document.getElementById("word");
const currWordContainer = document.getElementById("currentWord");
const ctx = canvas.getContext("2d");

const genColorWithOpacity = op => `rgba(40, 167, 69, ${op})`;

const completedLineDotColor = "green";
const startLineDotColor = "red";

const puzzle = [
  ["A", "B", "C"], // top (first row)
  ["D", "E", "F"], // right (last col)
  ["G", "H", "I"], // bottom (last row)
  ["J", "K", "L"], // left (first col)
];

ctx.font = "30px Comic Sans MS";
ctx.fillStyle = genColorWithOpacity(1);
ctx.textAlign = "center";

const endpointRadius = 4;

const cWidth = canvas.width;
const cHeight = canvas.height;

const midX = canvas.width / 2;
const midY = canvas.height / 2;
const padding = 60;

const widthUnit = canvas.width / 4;
const heightUnit = canvas.height / 4;

const topMargin = cHeight / 8;
const sideMargin = cWidth / 8;

const drawLetters = letters => {
  // top
  const topRowY = topMargin;
  ctx.fillText(letters[0][0], midX - padding, topRowY);
  ctx.fillText(letters[0][1], midX, topRowY);
  ctx.fillText(letters[0][2], midX + padding, topRowY);

  // right
  const rightColX = cWidth - sideMargin;
  ctx.fillText(letters[1][0], rightColX, midY - padding);
  ctx.fillText(letters[1][1], rightColX, midY);
  ctx.fillText(letters[1][2], rightColX, midY + padding);

  // bottom
  const bottomRowY = cHeight - topMargin;
  ctx.fillText(letters[2][0], midX - padding, bottomRowY);
  ctx.fillText(letters[2][1], midX, bottomRowY);
  ctx.fillText(letters[2][2], midX + padding, bottomRowY);
  // left
  const leftColX = sideMargin;
  ctx.fillText(letters[3][0], leftColX, midY - padding);
  ctx.fillText(letters[3][1], leftColX, midY);
  ctx.fillText(letters[3][2], leftColX, midY + padding);
};

drawLetters(puzzle);

let clicks = 0;
const line = {
  fromX: null,
  fromY: null,
  toX: null,
  toY: null,
};

let linesDrawn = [];

const drawLine = ({ fromX, fromY, toX, toY }) => {
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  drawCircle(fromX, fromY, completedLineDotColor);
  drawCircle(toX, toY, completedLineDotColor);
};

const determineLetterClicked = (x, y) => {
  const determineYClick = letterOptions => {
    const midYBoundaryHi = cHeight / 2 + padding / 2;
    const midYBoundaryLow = cHeight / 2 - padding / 2;

    if (y < midYBoundaryLow) {
      return letterOptions[0];
    } else if (y > midYBoundaryHi) {
      return letterOptions[2];
    } else {
      return letterOptions[1];
    }
  };

  const determineXClick = letterOptions => {
    const midXBoundaryHi = cWidth / 2 + padding / 2;
    const midXBoundaryLow = cWidth / 2 - padding / 2;
    if (x < midXBoundaryLow) {
      return letterOptions[0];
    } else if (x > midXBoundaryHi) {
      return letterOptions[2];
    } else {
      return letterOptions[1];
    }
  };

  // first column
  if (x < sideMargin + padding / 2) {
    return determineYClick(puzzle[3]);
  }
  // last column
  if (x > cWidth - (sideMargin + padding / 2)) {
    return determineYClick(puzzle[1]);
  }
  // first row
  if (y < heightUnit) {
    return determineXClick(puzzle[0]);
  }
  // last row
  if (y > 3 * heightUnit) {
    return determineXClick(puzzle[2]);
  }

  return null;
};

const renderWords = (prev, curr) => {
  currWordContainer.innerText = `${prev.join(" ")} ${curr}`;
};

let currentWord = "";
let previousWords = [];
const handleCanvasClick = e => {
  clicks++;
  const [x, y] = [e.offsetX, e.offsetY];

  const letterClicked = determineLetterClicked(x, y);
  if (letterClicked === null) {
    return;
  }

  currentWord = currentWord + letterClicked;
  renderWords(previousWords, currentWord);

  if (clicks % 2 == 0) {
    line.toX = x;
    line.toY = y;

    drawLine(line);
    // if I don't re-assign here, it pushes the original line over and over
    linesDrawn.push({
      fromX: line.fromX,
      fromY: line.fromY,
      toX: line.toX,
      toY: line.toY,
    });
  } else {
    line.fromX = x;
    line.fromY = y;
    drawCircle(x, y, startLineDotColor);
  }
};

const drawCircle = (x, y, color) => {
  ctx.beginPath();
  ctx.arc(x, y, endpointRadius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
};

const handleUndoBtnClick = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
  linesDrawn.pop();
  drawLetters(puzzle); // redraw letters
  linesDrawn.forEach(drawLine); // redraw line

  // undo the current word
  if (currentWord === "") {
    if (previousWords.length > 0) {
      currentWord = previousWords.pop();
    }
  }
  currentWord = currentWord.substring(0, currentWord.length - 1);

  renderWords(previousWords, currentWord);
};

const handleWordBtnClick = () => {
  previousWords.push(currentWord);
  currentWord = "";
};

canvas.addEventListener("click", handleCanvasClick, false);
undoBtn.addEventListener("click", handleUndoBtnClick, false);
wordBtn.addEventListener("click", handleWordBtnClick, false);
