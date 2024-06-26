let puzzle = [
  ["A", "B", "C"], // top (first row)
  ["D", "E", "F"], // right (last col)
  ["G", "H", "I"], // bottom (last row)
  ["J", "K", "L"], // left (first col)
];

// set game state from URL, if available
const searchParams = new URLSearchParams(window.location.search);
if (searchParams.size > 0) {
  [0, 1, 2, 3].forEach(i => {
    const rowFromUrl = searchParams.get(`row-${i}`);

    // TODO: add validation
    if (!!rowFromUrl) {
      puzzle[i] = rowFromUrl; // set puzzle rows
      document.getElementById(`add-word-input-${i}`).value = rowFromUrl;
    }
  });
}

// Play game elements
const canvas = document.getElementById("myCanvas");
const undoBtn = document.getElementById("undo-btn");
const wordBtn = document.getElementById("word-btn");
const currWordContainer = document.getElementById("current-word");
const prevWordsContainer = document.getElementById("previous-words");
const ctx = canvas.getContext("2d");

// Play game logic

const genColorWithOpacity = op => `rgba(40, 167, 69, ${op})`;

const defaultLetterColor = genColorWithOpacity(1);
// const usedLetterColor = genColorWithOpacity(0.1);
const usedLetterColor = "#ffc107";
const completedLineDotColor = "green";
const startLineDotColor = "green";

ctx.font = "30px Comic Sans MS";
ctx.fillStyle = defaultLetterColor;
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

let currentWord = "";
let previousWords = [];

const drawLetter = (letter, x, y, usedLetters) => {
  if (usedLetters[letter]) {
    ctx.fillStyle = usedLetterColor;
  }

  ctx.fillText(letter, x, y);
  ctx.fillStyle = defaultLetterColor;
};

const drawLetters = letters => {
  const usedLetters = {};
  previousWords.forEach(wrd =>
    wrd.split("").forEach(l => (usedLetters[l] = true))
  );

  // top
  const topRowY = topMargin;
  drawLetter(letters[0][0], midX - padding, topRowY, usedLetters);
  drawLetter(letters[0][1], midX, topRowY, usedLetters);
  drawLetter(letters[0][2], midX + padding, topRowY, usedLetters);

  // right
  const rightColX = cWidth - sideMargin;
  drawLetter(letters[1][0], rightColX, midY - padding, usedLetters);
  drawLetter(letters[1][1], rightColX, midY, usedLetters);
  drawLetter(letters[1][2], rightColX, midY + padding, usedLetters);

  // bottom
  const bottomRowY = cHeight - topMargin;
  drawLetter(letters[2][0], midX - padding, bottomRowY, usedLetters);
  drawLetter(letters[2][1], midX, bottomRowY, usedLetters);
  drawLetter(letters[2][2], midX + padding, bottomRowY, usedLetters);
  // left
  const leftColX = sideMargin;
  drawLetter(letters[3][0], leftColX, midY - padding, usedLetters);
  drawLetter(letters[3][1], leftColX, midY, usedLetters);
  drawLetter(letters[3][2], leftColX, midY + padding, usedLetters);
};

drawLetters(puzzle);

let clicks = 0;
let fromX,
  fromY,
  toX,
  toY = null;

let linesDrawn = [];

const drawLine = ({ fromX, fromY, toX, toY }) => {
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  drawCircle(fromX, fromY, completedLineDotColor);
  drawCircle(toX, toY, completedLineDotColor);
};

// determineLetterClicked takes an (x, y) coordinate of a click on the canvas,
// and returns the letter at the coordinate clicked as well as the puzzle row
// that was clicked
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
    return [determineYClick(puzzle[3]), 3];
  }
  // last column
  if (x > cWidth - (sideMargin + padding / 2)) {
    return [determineYClick(puzzle[1]), 1];
  }
  // first row
  if (y < heightUnit) {
    return [determineXClick(puzzle[0]), 0];
  }
  // last row
  if (y > 3 * heightUnit) {
    return [determineXClick(puzzle[2]), 2];
  }

  return [null, null];
};

const renderWords = (prev, curr) => {
  currWordContainer.innerText = `${curr}`;
  prevWordsContainer.innerText = prev.join(" ");
};

const handleCanvasClick = e => {
  clicks++;
  const [x, y] = [e.offsetX, e.offsetY];

  const [letterClicked, rowClicked] = determineLetterClicked(x, y);

  if (letterClicked === null) {
    return; // don't process clicks outside of letter spaces
  }
  if (
    currentWord.length > 0 &&
    letterClicked === currentWord[currentWord.length - 1]
  ) {
    // don't allow the user to click the same letter twice
    return;
  }
  // TODO: don't allow the user to click a letter in the same row twice
  console.log(rowClicked);

  currentWord = currentWord + letterClicked;
  renderWords(previousWords, currentWord);

  if (fromX === null || fromY === null) {
    fromX = x;
    fromY = y;
    drawCircle(x, y, startLineDotColor);
  } else {
    toX = x;
    toY = y;
    drawLine({ fromX, fromY, toX, toY });
    linesDrawn.push({ fromX, fromY, toX, toY });
    // set this as the new start point
    fromX = toX;
    fromY = toY;
  }
};

const drawCircle = (x, y, color) => {
  ctx.beginPath();
  ctx.arc(x, y, endpointRadius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
};

const redrawGame = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
  drawLetters(puzzle); // redraw letters
  linesDrawn.forEach(drawLine); // redraw lines
};

const handleUndoBtnClick = () => {
  linesDrawn.pop();

  // re-set the start point of the current line
  if (linesDrawn.length > 0) {
    const lastLine = linesDrawn[linesDrawn.length - 1];
    fromX = lastLine.toX;
    fromY = lastLine.toY;
  }
  if (linesDrawn.length === 0) {
    fromX = null;
    fromY = null;
  }

  // undo the current word in the display
  if (currentWord.length === 1) {
    if (previousWords.length > 0) {
      currentWord = previousWords.pop();
    }
  }
  currentWord = currentWord.substring(0, currentWord.length - 1);
  renderWords(previousWords, currentWord); // wow, I miss react
  redrawGame();
};

const handleWordBtnClick = () => {
  if (currentWord.length < 3) {
    console.log("current word is too short");
    return;
  }
  previousWords.push(currentWord);
  currentWord = currentWord[currentWord.length - 1];

  renderWords(previousWords, currentWord); // wow, I miss react
  redrawGame();
};

// play game listeners
canvas.addEventListener("click", handleCanvasClick, false);
undoBtn.addEventListener("click", handleUndoBtnClick, false);
wordBtn.addEventListener("click", handleWordBtnClick, false);

// Create game elements

const addWordBtns = [0, 1, 2, 3].map(n =>
  document.getElementById(`add-word-btn-${n}`)
);
const addWordInputs = [0, 1, 2, 3].map(n =>
  document.getElementById(`add-word-input-${n}`)
);

// Create game logic

const validateRowInput = val => {
  if (val.length < 3) {
    console.error("invalid input");
    return null;
  }
  return val
    .split("")
    .map(l => l.toUpperCase())
    .slice(0, 3);
};

const addRow = rowNum => {
  const validatedInput = validateRowInput(addWordInputs[rowNum].value);
  if (!validatedInput) {
    return null;
  }

  puzzle[rowNum] = validatedInput;
  searchParams.set(`row-${rowNum}`, validatedInput.join(""));

  var newQuery = window.location.pathname + "?" + searchParams.toString();
  history.pushState(null, "", newQuery);
  redrawGame();
};

addWordBtns.forEach((btn, i) => {
  btn.addEventListener("click", () => addRow(i), false);
});

const ENTER_KEY = "Enter";
addWordInputs.forEach((btn, i) => {
  btn.addEventListener(
    "keydown",
    e => {
      if (e.code != ENTER_KEY) {
        return;
      }
      addRow(i);
    },
    false
  );
});
