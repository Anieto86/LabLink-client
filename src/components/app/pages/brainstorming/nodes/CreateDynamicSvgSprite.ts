import * as PIXI from 'pixi.js';

/**
 * Generates an SVG markup string with dynamic dimensions based on the given text.
 * @param text The text to display inside the SVG.
 */
function generateSvg(text: string): string {
  // Base dimensions.
  const baseWidth = 150;
  const baseHeight = 80;
  // Add extra width per character (adjust as needed).
  const extraWidth = text.length * 4; 
  const width = baseWidth + extraWidth;
  const height = baseHeight; 

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="10" ry="10" fill="#ffffff" stroke="#124ee6" stroke-width="2"/>
      <text x="${width / 2}" y="${height / 2 + 6}" text-anchor="middle" fill="#124ee6" font-size="20" font-family="Arial">${text}</text>
    </svg>
  `;
}

/**
 * Creates a PIXI sprite based on a dynamic SVG.
 * The texture is generated with a higher resolution.
 *
 * To compensate for the increased resolution (which makes the texture's size smaller in world coordinates),
 * we scale the sprite by the same resolution factor.
 *
 * The returned sprite includes an updateText method to change its text and update the texture.
 *
 * @param initialText The initial text to display.
 * @param x The x position for the sprite.
 * @param y The y position for the sprite.
 */
export function createDynamicSvgSprite(initialText = "…", x = 200, y = 200): PIXI.Sprite & { updateText: (newText: string) => void } {
  const resolution = 4; // Increase the texture resolution.
  const svgMarkup = generateSvg(initialText);
  const dataUri = `data:image/svg+xml;charset=utf8,${encodeURIComponent(svgMarkup)}`;
  // Create the texture with the high resolution.
  const texture = PIXI.Texture.from(dataUri, { 
    resolution, 
    scaleMode: PIXI.SCALE_MODES.LINEAR 
  });
  const sprite = new PIXI.Sprite(texture);
  sprite.anchor.set(0.5);
  sprite.x = x;
  sprite.y = y;

  // Scale up the sprite so that its displayed size matches the SVG's original dimensions.
  sprite.scale.set(resolution);

  // Add an updateText method.
  (sprite as any).updateText = (newText: string) => {
    const newSvgMarkup = generateSvg(newText);
    const newDataUri = `data:image/svg+xml;charset=utf8,${encodeURIComponent(newSvgMarkup)}`;
    const newTexture = PIXI.Texture.from(newDataUri, { 
      resolution, 
      scaleMode: PIXI.SCALE_MODES.LINEAR 
    });
    sprite.texture = newTexture;
    // Re-apply the scale so that the sprite's displayed size remains as expected.
    sprite.scale.set(resolution);
  };

  return sprite as PIXI.Sprite & { updateText: (newText: string) => void };
}
