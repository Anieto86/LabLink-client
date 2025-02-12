import * as PIXI from 'pixi.js';

export function createTextNode(initialText = "…", x = 200, y = 200) {
  const container = new PIXI.Container();
  container.x = x;
  container.y = y;
  // Use 'auto' eventMode so that pointer events fire.
  container.eventMode = 'auto';

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
  container.addChild(textDisplay);

  // Create a background shape for better visibility.
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

  // Create an HTML input element for inline editing.
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

  // Function to position the input element exactly over the text node.
  function positionInput() {
    // Get the global position of the container.
    const globalPos = container.toGlobal(new PIXI.Point(0, 0));
    // Find the canvas element.
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();
    // Calculate absolute position:
    // Since textDisplay.anchor is (0.5, 0.5), subtract half its width/height.
    const left = canvasRect.left + globalPos.x - textDisplay.width / 2 - 5;
    const top = canvasRect.top + globalPos.y - textDisplay.height / 2 - 5;
    input.style.left = `${left}px`;
    input.style.top = `${top}px`;
    input.style.width = `${textDisplay.width + 10}px`;
    input.style.height = `${textDisplay.height + 10}px`;
  }

  // When the container is clicked, show the input for editing.
  container.on('pointerdown', () => {
    // (For debugging, you can log here.)
    // Hide the PIXI text (or you may choose to leave it visible).
    textDisplay.visible = false;
    input.value = textDisplay.text;
    input.style.display = 'block';
    positionInput();
    // Use a small timeout to ensure rendering, then focus.
    setTimeout(() => input.focus(), 0);
  });

  // As the user types, update the PIXI text and background.
  input.addEventListener('input', () => {
    textDisplay.text = input.value;
    updateBackground();
  });

  // When editing is finished, hide the input and show the PIXI text.
  input.addEventListener('blur', () => {
    input.style.display = 'none';
    textDisplay.visible = true;
  });

  return container;
}
