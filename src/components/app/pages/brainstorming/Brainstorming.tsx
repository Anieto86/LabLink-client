import { Column } from '@/components/design/Grid';
import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';

const Brainstorming = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<{ x: number; y: number }[]>([
    { x: 400, y: 300 },
  ]);

  useEffect(() => {
    if (!canvasRef.current) {
      console.error('Canvas ref is not attached');
      return;
    }

    // Create PIXI application
    const pixiApp = new PIXI.Application<HTMLCanvasElement>({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    canvasRef.current.appendChild(pixiApp.view as HTMLCanvasElement);

    // ----- Create a grid layer (infinite background) -----
    // We’ll use a TilingSprite so that the pattern repeats infinitely.
    // This grid layer will be separate from the main container so that it doesn’t
    // scale when zooming.
    const dotSpacing = 20;
    const dotSize = 2;

    // Create a small graphic that draws a single dot centered in a cell
    const gridGfx = new PIXI.Graphics();
    gridGfx.beginFill(0xcccccc, 0.5);
    gridGfx.drawCircle(dotSpacing / 2, dotSpacing / 2, dotSize);
    gridGfx.endFill();

    // Generate a texture from the graphic
    const gridTexture = pixiApp.renderer.generateTexture(gridGfx);

    // Create a TilingSprite that covers the entire viewport
    const tilingSprite = new PIXI.TilingSprite(
      gridTexture,
      window.innerWidth,
      window.innerHeight
    );

    // Create a container for the grid. Notice we add this container directly to the stage.
    // We will not be scaling this container so the grid dots remain at a constant size.
    const gridContainer = new PIXI.Container();
    gridContainer.addChild(tilingSprite);
    pixiApp.stage.addChild(gridContainer);

    // ----- Create the main container (for nodes) -----
    // This container will be panned and zoomed.
    const container = new PIXI.Container();
    pixiApp.stage.addChild(container);

    // Add your nodes to the container
    nodes.forEach(({ x, y }) => {
      const nodeGfx = new PIXI.Graphics();
      nodeGfx.beginFill(0xff0000);
      nodeGfx.drawCircle(0, 0, 20);
      nodeGfx.endFill();
      nodeGfx.x = x;
      nodeGfx.y = y;
      container.addChild(nodeGfx);
    });

    // ----- Set up pan and zoom handling -----
    let isDragging = false;
    let startPosition = { x: 0, y: 0 };
    let startContainerPosition = { x: 0, y: 0 };

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      startPosition = { x: event.clientX, y: event.clientY };
      startContainerPosition = { x: container.x, y: container.y };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      // Update container position (panning)
      container.x = startContainerPosition.x + (event.clientX - startPosition.x);
      container.y = startContainerPosition.y + (event.clientY - startPosition.y);

      // Update the grid’s tiling offset so the grid appears continuous.
      // Because the grid layer isn’t scaled, we simply update the tilePosition.
      tilingSprite.tilePosition.x = container.x % dotSpacing;
      tilingSprite.tilePosition.y = container.y % dotSpacing;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      // Determine zoom factor (e.g. zoom in for negative deltaY)
      const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;

      // Get the mouse position relative to the canvas
      const rect = pixiApp.view.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Calculate the world coordinates under the mouse before scaling
      const worldX = (mouseX - container.x) / container.scale.x;
      const worldY = (mouseY - container.y) / container.scale.y;

      // Apply scaling to the container (zooming the nodes)
      container.scale.set(container.scale.x * scaleFactor);

      // Adjust the container position so that the world position under the mouse remains constant.
      container.x = mouseX - worldX * container.scale.x;
      container.y = mouseY - worldY * container.scale.y;

      // (Optional) Update the grid’s tilePosition. Even though the grid isn’t scaled,
      // its offset should follow the container’s panning.
      tilingSprite.tilePosition.x = container.x % dotSpacing;
      tilingSprite.tilePosition.y = container.y % dotSpacing;
    };

    // Add event listeners to the canvas element
    if (pixiApp.view instanceof HTMLCanvasElement) {
      pixiApp.view.addEventListener('mousedown', handleMouseDown);
      pixiApp.view.addEventListener('mouseup', handleMouseUp);
      pixiApp.view.addEventListener('mousemove', handleMouseMove);
      pixiApp.view.addEventListener('wheel', handleWheel);
    }

    // ----- Cleanup on component unmount -----
    return () => {
      pixiApp.view.removeEventListener('mousedown', handleMouseDown);
      pixiApp.view.removeEventListener('mouseup', handleMouseUp);
      pixiApp.view.removeEventListener('mousemove', handleMouseMove);
      pixiApp.view.removeEventListener('wheel', handleWheel);
      pixiApp.destroy(true, { children: true, texture: true });
    };
  }, [nodes]);

  const handleAddNode = () => {
    setNodes((prev) => [
      ...prev,
      { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
    ]);
  };

  return (
    <Column className="items-center fixed">
      <button type="button" onClick={handleAddNode}>
        Add Node
      </button>
      <div
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block', border: '1px solid black' }}
      />
    </Column>
  );
};

export default Brainstorming;
