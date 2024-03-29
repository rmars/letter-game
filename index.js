const canvas = document.getElementById("myCanvas");
const undoBtn = document.getElementById("undo");
const ctx = canvas.getContext("2d");

const puzzle = [
  ["A", "B", "C"], // top
  ["D", "E", "F"], // right
  ["G", "H", "I"], // bottom
  ["J", "K", "L"], // left
];

ctx.font = "30px Comic Sans MS";
ctx.fillStyle = "#28a745";
ctx.textAlign = "center";

const endpointRadius = 4;

const cWidth = canvas.width;
const cHeight = canvas.height;

const midX = canvas.width / 2;
const midY = canvas.height / 2;
const padding = 50;

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
};

const determineLetterClicked = (x, y) => {
  // console.log("d:", x, y);
  if (x < widthUnit) {
    console.log("first col");
  }
  if (x > 3 * widthUnit) {
    console.log("last col");
  }

  if (y < heightUnit) {
    console.log("first row");
  }

  if (y > 3 * heightUnit) {
    console.log("last row");
  }
};

const handleCanvasClick = e => {
  clicks++;
  const [x, y] = [e.offsetX, e.offsetY];

  const letterClicked = determineLetterClicked(x, y);

  if (clicks % 2 == 0) {
    line.toX = x;
    line.toY = y;

    drawLine(line);
    drawCircle(x, y, "green");
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
    drawCircle(x, y, "red");
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
};

canvas.addEventListener("click", handleCanvasClick, false);
undoBtn.addEventListener("click", handleUndoBtnClick, false);
