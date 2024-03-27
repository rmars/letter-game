const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const letters = [
  ["A", "B", "C"], // top
  ["D", "E", "F"], // right
  ["G", "H", "I"], // bottom
  ["J", "K", "L"], // left
];

ctx.font = "30px Comic Sans MS";
ctx.fillStyle = "red";
ctx.textAlign = "center";

const widthUnit = canvas.width / 4;
const heightUnit = canvas.height / 4;

// top
for (l in letters[0]) {
  ctx.fillText(letters[0][l], widthUnit + l * widthUnit, canvas.height / 8);
}

// right
for (l in letters[1]) {
  ctx.fillText(
    letters[1][l],
    canvas.width - canvas.width / 8,
    heightUnit + l * heightUnit
  );
}

// bottom
for (l in letters[2]) {
  ctx.fillText(
    letters[2][l],
    widthUnit + l * widthUnit,
    canvas.height - canvas.height / 8
  );
}

// left
for (l in letters[3]) {
  ctx.fillText(letters[3][l], canvas.width / 8, heightUnit + l * heightUnit);
}

let clicks = 0;
const line = {
  fromX: null,
  fromY: null,
  toX: null,
  toY: null,
};

const drawLine = ({ fromX, fromY, toX, toY }) => {
  // Start a new Path
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);

  // Draw the Path
  ctx.stroke();
};

const handleCanvasClick = e => {
  clicks++;
  const [x, y] = [e.offsetX, e.offsetY];
  if (clicks % 2 == 0) {
    line.toX = x;
    line.toY = y;
    drawLine(line);
  } else {
    line.fromX = x;
    line.fromY = y;
  }
};

canvas.addEventListener("click", handleCanvasClick, false);
