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
const widthUnit = canvas.width / 4;
const heightUnit = canvas.height / 4;

const topMargin = cHeight / 8;
const sideMargin = cWidth / 8;

const drawLetters = letters => {
  // top
  for (l in letters[0]) {
    ctx.fillText(letters[0][l], widthUnit + l * widthUnit, topMargin);
  }
  // right
  for (l in letters[1]) {
    ctx.fillText(
      letters[1][l],
      cWidth - sideMargin,
      heightUnit + l * heightUnit
    );
  }
  // bottom
  for (l in letters[2]) {
    ctx.fillText(letters[2][l], widthUnit + l * widthUnit, cHeight - topMargin);
  }
  // left
  for (l in letters[3]) {
    ctx.fillText(letters[3][l], sideMargin, heightUnit + l * heightUnit);
  }
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

const handleCanvasClick = e => {
  clicks++;
  const [x, y] = [e.offsetX, e.offsetY];
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
    drawCircle(x, y, "yellow");
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
