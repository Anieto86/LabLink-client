import * as PIXI from 'pixi.js';

export function createTextNode(initialText = "…", x = 200, y = 200) {
  const container = new PIXI.Container();
  container.x = Math.round(x);
  container.y = Math.round(y);
  container.eventMode = 'auto'; // 'auto' so pointer events fire

  // Create the PIXI text display.
  const textStyle = new PIXI.TextStyle({
    fontSize: 20,
    fill: 0x000000,
    fontFamily: 'Arial',
    wordWrap: true,
    wordWrapWidth: 150,
  });
  const textDisplay = new PIXI.Text(initialText, textStyle);
  textDisplay.anchor.set(0.5);
  textDisplay.roundPixels = true; // Ensures the text is rendered on whole pixels.
  container.addChild(textDisplay);

  // Create background shape for better visibility.
  const background = new PIXI.Graphics();
  function updateBackground() {
    background.clear();
    background.beginFill(0xffffff, 1);
    background.lineStyle(1, 0x000000, 0.2);
    background.drawRoundedRect(
      -textDisplay.width / 2 - 5,
      -textDisplay.height / 2 - 5,
      textDisplay.width + 10,
      textDisplay.height + 10,
      5
    );
    background.endFill();
  }
  updateBackground();
  container.addChildAt(background, 0);

  // Create an HTML input element for in-place editing.
  const input = document.createElement('input');
  input.type = 'text';
  input.value = textDisplay.text;
  input.style.position = 'absolute';
  input.style.display = 'none';
  input.style.fontSize = '20px';
  input.style.fontFamily = 'Arial';
  input.style.border = '1px solid #ccc';
  input.style.background = '#fff';
  input.style.textAlign = 'center';
  input.style.outline = 'none';
  input.style.zIndex = '10000';
  document.body.appendChild(input);

  function positionInput() {
    // Use container.toGlobal to determine its position on screen.
    const globalPos = container.toGlobal(new PIXI.Point(0, 0));
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();
    // Adjust for the centered anchor and a 5px margin.
    const left = canvasRect.left + globalPos.x - textDisplay.width / 2 - 5;
    const top = canvasRect.top + globalPos.y - textDisplay.height / 2 - 5;
    input.style.left = `${left}px`;
    input.style.top = `${top}px`;
    input.style.width = `${textDisplay.width + 10}px`;
    input.style.height = `${textDisplay.height + 10}px`;
  }

  container.on('pointerdown', () => {
    input.value = textDisplay.text;
    input.style.display = 'block';
    positionInput();
    setTimeout(() => input.focus(), 0);
  });

  input.addEventListener('input', () => {
    textDisplay.text = input.value;
    updateBackground();
  });

  input.addEventListener('blur', () => {
    input.style.display = 'none';
  });

  return container;
}
