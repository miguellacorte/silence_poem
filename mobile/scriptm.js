let raw;
let poem = [];
let lineHeight;
let scroll;
let mobileSoundscape;
let started = false;
let infoIcon, soundButton, soundOn, soundOff;
let soundMuted = false;
let soundState = "On";
let infoPopup;
let staticGraphics;
let dynamicGraphics;

// variables for type animation
let typeAnimationStart;
let indexSinceStart;
let lineIndex = 0;

let switchX;
let switchY;
let switchWidth = 28;
let switchHeight = 3;
let switchDirection = "UP"; // Possible values: "UP", "DOWN"
let lastSwitchTime;

function preload() {
  // load font and text
  font = loadFont("assets/helvetica.ttf");
  fontBold = loadFont("assets/helvetica-bold.ttf");
  fontItalic = loadFont("assets/helvetica-italic.ttf");
  raw = loadStrings("assets/silm.txt");
  mobileSoundscape = loadSound("assets/mobile_soundscape.mp3");
  soundOn = loadImage("assets/SoundOn_icon.png");
  soundOff = loadImage("assets/SoundOff_icon.png");
}

function touchStarted() {
  if (!started) {
    startPoemAndAudio();
  }
  //   return false; // prevent any default behavior
}

function startPoemAndAudio() {
  setTimeout(() => {
    mobileSoundscape.play(); // Start the audio after 2 seconds
  }, 2000);
  started = true; // Indicate that the poem and audio will start
}

function toggleSound() {
  soundMuted = !soundMuted;

  if (soundMuted) {
    mobileSoundscape.setVolume(0);
    soundState = "Off";
  } else {
    mobileSoundscape.setVolume(1);
    soundState = "On";
  }

  soundButton.elt.src = "assets/Sound" + soundState + "_icon.png";
}

function toggleInfoPopup() {
  if (
    infoPopup.elt.style.display === "none" ||
    infoPopup.elt.style.display === ""
  ) {
    infoPopup.show();
  } else {
    infoPopup.hide();
  }
}

function hideInfoPopup() {
  infoPopup.hide();
}

function setup() {
  // setup canvas and font
  createCanvas(windowWidth, windowHeight);
  background(255);
  fill(0);
  frameRate(60);

  switchX = width / 3;
  switchY = height / 1.5;
  lastSwitchTime = millis();

  infoIcon = createImg("assets/information_icon.png", "info");
  infoIcon
    .style("cursor", "pointer")
    .style("width", "20px")
    .style("position", "absolute")
    .style("margin-left", "20px")
    .style("left", "20px")
    .style("z-index", "4")
    .mousePressed(toggleInfoPopup);

  soundButton = createImg("assets/SoundOn_icon.png", "sound");
  soundButton
    .style("width", "25px")
    .style("cursor", "pointer")
    .style("position", "absolute")
    .style("margin-top", "1px")
    .style("margin-left", "15px")
    .style("margin-right", "10px")
    .style("z-index", "3")
    .mousePressed(toggleSound);

  infoPopup = createDiv();
  infoPopup
    .style("background-color", "#fff")
    .style("border", "1px solid #000")
    .style("width", "80%") // Wider for mobile
    .style("height", "60%") // Taller for mobile
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("z-index", "2")
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("align-items", "center")
    .style("justify-content", "center")
    .hide();

  let closeButton = createButton("X");
  closeButton.parent(infoPopup);
  closeButton
    .style("position", "absolute")
    .style("top", "5px")
    .style("left", "5px")
    .style("background", "transparent")
    .style("border", "none")
    .style("font-size", "16px") // Smaller for mobile
    .style("z-index", "5")
    .mousePressed(hideInfoPopup);

  let title = createElement("h3", "<br><br>Contributions");
  title.parent(infoPopup);
  title
    .style("font-family", "Helvetica-Bold")
    .style("font-size", "16px") // Smaller for mobile
    .style("font-weight", "bold")
    .style("margin-top", "20px")
    .style("margin-left", "10px");

  let content = createDiv(
    "<br>Raphael Koranda: Text, concept.<br> <br> Karin Knuttson: web development <br> <br>  Miguel La Corte: soundscape composition an web development"
  );
  content.parent(infoPopup);
  content
    .style("font-family", "Helvetica")
    .style("font-size", "14px") // Smaller for mobile
    .style("margin-left", "10px")
    .style("margin-top", "4px")
    .style("margin-right", "8px");

  // scroll turned on
  scroll = true;

  // keep track of current position in order to add the correct position to each line
  let currentPosition = height;

  // keep track of previous line height
  let previousLineHeight = 14;

  // create an object from each line and push to poem array
  for (let i = 0; i < raw.length; i++) {
    // create line object with contents from txt file & standard font size
    const currentLine = {
      content: raw[i],
      fontSize: 14,
      style: NORMAL,
    };

    // set divergent font sizes

    // yesterday someone had a finger...feeling hollow. how
    if (i > 146 && i < 170) {
      currentLine.fontSize = 20;
      currentLine.style = BOLD;
      // bridge a breath...swallows
    } else if (i > 170 && i < 175) {
      currentLine.fontSize = 24;
      currentLine.style = BOLD;
      // the words escaping...one another
    } else if (i > 175 && i < 180) {
      currentLine.fontSize = 28;
      currentLine.style = BOLD;
      // what is synonym for silence..fill the absence
    } else if (i > 193 && i < 203) {
      currentLine.fontSize = 20;
      currentLine.style = ITALIC;
      // silence is violence, silence is the absence of production?
    } else if (i > 562 && i < 574) {
      currentLine.fontSize = 26;
      // END
      // a beginning is the inception of an order + an end begins with the recognition
    } else if ((i > 699 && i < 701) || (i > 710 && i < 712)) {
      currentLine.fontSize = 23;
      currentLine.style = BOLD;
      // silence its assertion, silence its collapse
    } else if ((i > 701 && i < 703) || (i > 712 && i < 714)) {
      currentLine.fontSize = 20;
      // build a strucutre....destroy a structure...
    } else if ((i > 704 && i < 707) || (i > 715 && i < 718)) {
      currentLine.fontSize = 16;
      currentLine.style = ITALIC;
    } else if (i > 800 && i < 800) {
      currentLine.style = BOLD;
    }

    // line height is four thirds of font size
    currentLine.lineHeight = (4 * currentLine.fontSize) / 3;

    // set divergent line height
    // what if silence is not something...allowed to know sound
    if (i > 372 && i < 384) {
      currentLine.lineHeight = currentLine.fontSize * 0.8;
    }

    // set position
    currentLine.position = currentPosition + previousLineHeight;

    // set current position & previous line height
    currentPosition = currentLine.position;
    previousLineHeight = currentLine.lineHeight;

    // push to poem array
    poem.push(currentLine);
  }

  staticGraphics = createGraphics(windowWidth, windowHeight);
  dynamicGraphics = createGraphics(windowWidth, windowHeight);

  drawStaticText();
}

function drawStaticText() {
  staticGraphics.push();
  staticGraphics.fill(0);
  staticGraphics.textSize(16);
  staticGraphics.text("Touch to start", width / 2.75, height / 2);
  staticGraphics.textSize(10);
  staticGraphics.text("Please turn silent mode off", width / 3, height / 1.4);
  staticGraphics.pop();
}

function drawDynamicContent() {
  dynamicGraphics.clear(); // Clear previous frame

  push();
  if (millis() - lastSwitchTime > 1000) {
    // Animate the switch toggle
    if (switchDirection === "UP") {
      switchY -= 1;
      if (switchY <= height / 1.5 - 1) {
        switchDirection = "DOWN";
        lastSwitchTime = millis();
      }
    } else {
      switchY += 1;
      if (switchY >= height / 1.5 + 1) {
        switchDirection = "UP";
        lastSwitchTime = millis();
      }
    }
  }

  // Draw iPhone Switch background
  fill(255);
  stroke(0);
  rect(switchX - 80, height / 1.5 - 10, 300, 20, 8);

  // Draw orange square
  fill(206, 87, 56);
  rect(
    switchX - 40 - switchWidth / 2,
    height / 1.5 - 2,
    switchWidth,
    switchHeight
  );

  fill(161);
  rect(switchX + switchWidth, height / 1.5 - 2, switchWidth, switchHeight);

  fill(161);
  rect(switchX + switchWidth - 40, height / 1.5 - 2, switchWidth, switchHeight);

  // Draw iPhone Switch toggle (always gray)
  fill(242, 242, 242);
  stroke(0);
  rect(switchX - 40 - switchWidth / 2, switchY, switchWidth, switchHeight);

  pop();
}

function draw() {
 
  if (!started) {
    background(255);
    image(staticGraphics, 0, 0);
    drawDynamicContent();
    image(dynamicGraphics, 0, 0);
    return; // Exit the draw function
  }

  
  if (millis() > 2000) {
    // Refresh background & text color
    background(255);

    // Align text
    textAlign(LEFT, TOP);

    // Iterate through poem, line by line
    poem.forEach((currentLine, index) => {
      // check if current line is within canvas boundaries
      if (
        currentLine.position < height + currentLine.lineHeight * 3 &&
        currentLine.position > -currentLine.lineHeight
      ) {
        // set font size
        textSize(currentLine.fontSize);

        // set bold styles
        if (currentLine.style === BOLD) {
          textFont(fontBold);
        } else if (currentLine.style === ITALIC) {
          textFont(fontItalic);
        } else {
          textFont(font);
        }

        // index for first ¶ sign - anything in here will blink
        if (index === 67 || index === 563 || index === 573 || index === 744) {
          // check if even or odd second before drawing text (for blinking effect)
          if (Math.floor(millis() / 1000) % 2 === 0) {
            text(currentLine.content, 32, currentLine.position);
          }
          // centre-aligned; I was alone...else to lick
        } else if (
          (index > 215 && index < 325) ||
          (index > 82 && index < 91) ||
          (index > 116 && index < 130) ||
          (index > 463 && index < 470) ||
          (index > 645 && index < 663) ||
          (index > 634 && index < 637)
        ) {
          // push matrix to middle of canvas & draw centered text
          push();
          translate(width / 2, 0);
          textAlign(CENTER, TOP);
          text(currentLine.content, 32, currentLine.position);
          pop();

          // this is where the typing animation begins:
        } else if (index > 339 && index < 362) {
          // we keep scrolling until the first line is in the 1/8 of the height from the top
          if (index === 340 && currentLine.position < width / 8) {
            if (scroll) {
              // pause scrolling
              scroll = false;

              // keep track of when animation starts
              typeAnimationStart = millis();
            }
          }

          if (!scroll) {
            // check if we are on the right line
            if (index - 340 === lineIndex) {
              // 250 sets the speed of the typing
              // divide time difference since start of animation by 250 to type four characters per second (set to 1000 for one character per second)
              indexSinceStart = Math.floor(
                (millis() - typeAnimationStart) / 200
              );

              if (indexSinceStart <= currentLine.content.length) {
                text(
                  currentLine.content.substring(0, indexSinceStart),
                  32,
                  currentLine.position
                );
              } else {
                typeAnimationStart = millis();
                lineIndex++;
              }
            }
          }

          // draw full line if we have already typed through this line
          if (index - 340 < lineIndex) {
            text(currentLine.content, 32, currentLine.position);
          }

          // keep scrolling when we are done typing the lines
          if (lineIndex === 21) {
            scroll = true;
          }

          // where the typing animation ends

          // strikethrough in my bed there is a silhouette...and fall asleep
        } else if (index > 541 && index < 553) {
          // draw line over text (strike through text)
          const lineWidth = textWidth(currentLine.content);
          const yPosition = currentLine.position + 7;
          line(32, yPosition, lineWidth + 32, yPosition);
          text(currentLine.content, 32, currentLine.position);
        } else {
          // draw text
          text(currentLine.content, 32, currentLine.position);
        }
      }

      // decrement line's position on y axis if scroll is turned on
      if (scroll) {
        currentLine.position -= 0.8;
      }
    });
    // [The rest of your poem drawing logic here...]
  }

  infoIcon.position(windowWidth - 60 - 50, 10);
  soundButton.position(windowWidth - 10 - 50, 10);
}

// ruby -run -e httpd . -p 8000
