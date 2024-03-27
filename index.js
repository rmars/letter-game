const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

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
  if (clicks % 2 == 0) {
    line.toX = e.x;
    line.toY = e.y;
    drawLine(line);
  } else {
    line.fromX = e.x;
    line.fromY = e.y;
  }
  console.log(line);
};

canvas.addEventListener("click", handleCanvasClick, false);
