SA.redirection_mobile({
  mobile_url: "ssshhh.xyz/mobile",
  mobile_prefix: "https",
});

let font;
let raw;
let poem = [];
let lineHeight;
let scroll;
let soundscape;
let started = false;

// create variables for type animation
let typeAnimationStart;
let indexSinceStart;
let lineIndex = 0;

function preload() {
  // load font and text
  font = loadFont("assets/helvetica.ttf");
  fontBold = loadFont("assets/helvetica-bold.ttf");
  fontItalic = loadFont("assets/helvetica-italic.ttf");
  raw = loadStrings("assets/sil.txt");
  soundscape = loadSound("assets/desktop_soundscape.mp3");
}

function startPoemAndAudio() {
  // Your logic to start the poem
  setTimeout(() => {
    soundscape.play(); // Start the audio after 2 seconds (2000 milliseconds)
  }, 2000);
  started = true; // Indicate that the poem and audio will start
}

function keyPressed() {
  if (keyCode === 32 && !started) {
    // 32 is the keyCode for the spacebar
    startPoemAndAudio();
    started = true; // Prevents the audio from restarting if the spacebar is pressed again
  }
}

function setup() {
  // setup canvas and font
  createCanvas(windowWidth, windowHeight);

  background(255);
  fill(0);
  frameRate(60);

  // scroll turned on
  scroll = true;

  // keep track of current position in order to add the correct position to each line
  let currentPosition = height;

  // keep track of previous line height
  let previousLineHeight = 24;

  // create an object from each line and push to poem array
  for (let i = 0; i < raw.length; i++) {
    // create line object with contents from txt file & standard font size
    const currentLine = {
      content: raw[i],
      fontSize: 18,
      style: NORMAL,
    };

    // set divergent font sizes

    // yesterday someone had a finger...feeling hollow. how
    if (i > 134 && i < 150) {
      currentLine.fontSize = 33;
      currentLine.style = BOLD;
      // bridge a breath...swallows
    } else if (i > 150 && i < 155) {
      currentLine.fontSize = 40;
      currentLine.style = BOLD;
      // the words escaping...one another
    } else if (i > 155 && i < 160) {
      currentLine.fontSize = 46;
      currentLine.style = BOLD;
      // what is synonym for silence..fill the absence
    } else if (i > 171 && i < 183) {
      currentLine.fontSize = 23;
      currentLine.style = ITALIC;
      // silence is violence, silence is the absence of production?
    } else if (i > 519 && i < 531) {
      currentLine.fontSize = 33;
      // END
      // a beginning is the inception of an order + an end begins with the recognition
    } else if ((i > 646 && i < 648) || (i > 656 && i < 658)) {
      currentLine.fontSize = 26;
      currentLine.style = BOLD;
      // silence its assertion, silence its collapse
    } else if ((i > 648 && i < 650) || (i > 658 && i < 660)) {
      currentLine.fontSize = 23;
      // ???
    } else if ((i > 651 && i < 653) || (i > 661 && i < 663)) {
      currentLine.fontSize = 20;
      currentLine.style = ITALIC;
    } else if (i > 602 && i < 612) {
      currentLine.style = BOLD;
    }

    // line height is four thirds of font size
    currentLine.lineHeight = (4 * currentLine.fontSize) / 3;

    // set divergent line height
    // what if silence is not something...allowed to know sound
    if (i > 351 && i < 362) {
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
}

function draw() {
  if (!started) {
    background(255); // Clear the background
    fill(0); // Set text color to black
    text("Press spacebar to start", width / 2.5, height / 2); // Display the instruction text
	textSize(24)
  } else {
    // animation starts 2 seconds after canvas has been setup
    if (millis() > 2000) {
      // refresh background & text color
      background(255);

      // align text
      textAlign(LEFT, TOP);

      // iterate through poem, line by line
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
          if (index === 63 || index === 520 || index === 530 || index === 689) {
            // check if even or odd second before drawing text (for blinking effect)
            if (Math.floor(millis() / 1000) % 2 === 0) {
              text(currentLine.content, 32, currentLine.position);
            }
            // centre-aligned; I was alone...else to lick
          } else if (
            (index > 195 && index < 303) ||
            (index > 78 && index < 84) ||
            (index > 109 && index < 117) ||
            (index > 428 && index < 433) ||
            (index > 602 && index < 612) ||
            (index > 591 && index < 595)
          ) {
            // push matrix to middle of canvas & draw centered text
            push();
            translate(width / 2, 0);
            textAlign(CENTER, TOP);
            text(currentLine.content, 32, currentLine.position);
            pop();

            // this is where the typing animation begins:
          } else if (index > 318 && index < 342) {
            // we keep scrolling until the first line is in the 1/8 of the height from the top
            if (index === 319 && currentLine.position < width / 8) {
              if (scroll) {
                // pause scrolling
                scroll = false;

                // keep track of when animation starts
                typeAnimationStart = millis();
              }
            }

            if (!scroll) {
              // check if we are on the right line
              if (index - 319 === lineIndex) {
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
            if (index - 319 < lineIndex) {
              text(currentLine.content, 32, currentLine.position);
            }

            // keep scrolling when we are done typing the lines
            if (lineIndex === 21) {
              scroll = true;
            }

            // where the typing animation ends

            // strikethrough in my bed there is a silhouette...and fall asleep
          } else if (index > 504 && index < 511) {
            // draw line over text (strike through text)
            const lineWidth = textWidth(currentLine.content);
            const yPosition = currentLine.position + 10;
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
    }
  }
}