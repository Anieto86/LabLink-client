import { Column } from '@/components/design/Grid';
import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';

const Brainstorming = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<{ x: number; y: number }[]>([
    { x: 400, y: 300 },
  ]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create the PIXI application.
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    canvasRef.current.appendChild(app.view);

    // -------------------------
    // 1. Create the main container (for nodes)
    // -------------------------
    const container = new PIXI.Container();
    app.stage.addChild(container);

    // Add sample nodes.
    nodes.forEach(({ x, y }) => {
      const node = new PIXI.Graphics();
      node.beginFill(0xff0000);
      node.drawCircle(0, 0, 20);
      node.endFill();
      node.x = x;
      node.y = y;
      container.addChild(node);
    });

    // -------------------------
    // 2. Create a dedicated grid container (for the infinite dotted grid)
    //    This container is NOT scaled so the grid dots remain at a constant size.
    // -------------------------
    const gridContainer = new PIXI.Container();
    app.stage.addChildAt(gridContainer, 0); // add behind the nodes

    const gridGraphics = new PIXI.Graphics();
    gridContainer.addChild(gridGraphics);

    // Set your desired dot spacing and dot size.
    // Change this value to increase or decrease the space between dots.
    let dotSpacing = 20; // For example, 100 pixels between dots.
    const dotSize = 2;    // Dot radius

    // Function to update/redraw the grid.
    const updateGrid = () => {
      gridGraphics.clear();
      gridGraphics.beginFill(0xcccccc, 0.5);

      // Compute an offset based on the current container position.
      // This makes the grid appear to move continuously as you pan.
      const offsetX = container.x % dotSpacing;
      const offsetY = container.y % dotSpacing;

      // Loop beyond the view bounds so that the grid covers the entire screen.
      for (let x = -dotSpacing; x < window.innerWidth + dotSpacing; x += dotSpacing) {
        for (let y = -dotSpacing; y < window.innerHeight + dotSpacing; y += dotSpacing) {
          // Draw each dot at the center of its grid cell.
          gridGraphics.drawCircle(
            x - offsetX + dotSpacing / 2,
            y - offsetY + dotSpacing / 2,
            dotSize
          );
        }
      }
      gridGraphics.endFill();
    };

    // Draw the grid initially.
    updateGrid();

    // -------------------------
    // 3. Set up panning and zooming for the nodes container.
    //    The grid (in gridContainer) will update its offset accordingly.
    // -------------------------
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let containerStart = { x: 0, y: 0 };

    app.view.addEventListener('mousedown', (e: MouseEvent) => {
      isDragging = true;
      dragStart = { x: e.clientX, y: e.clientY };
      containerStart = { x: container.x, y: container.y };
    });

    app.view.addEventListener('mouseup', () => {
      isDragging = false;
    });

    app.view.addEventListener('mousemove', (e: MouseEvent) => {
      if (!isDragging) return;
      // Update container position for panning.
      container.x = containerStart.x + (e.clientX - dragStart.x);
      container.y = containerStart.y + (e.clientY - dragStart.y);
      // Update grid to follow the container's movement.
      updateGrid();
    });

    // Zooming (using mouse wheel) on the nodes container.
    app.view.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const rect = app.view.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate world coordinates under the mouse pointer.
      const worldX = (mouseX - container.x) / container.scale.x;
      const worldY = (mouseY - container.y) / container.scale.y;

      // Apply zoom.
      container.scale.set(container.scale.x * scaleFactor);
      // Adjust the container's position so that the zoom is centered under the mouse.
      container.x = mouseX - worldX * container.scale.x;
      container.y = mouseY - worldY * container.scale.y;

      // Update the grid after zoom.
      updateGrid();
    });

    // Cleanup on component unmount.
    return () => {
      app.destroy(true, { children: true, texture: true });
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
      <button onClick={handleAddNode}>Add Node</button>
      <div
        ref={canvasRef}
        style={{ width: '100%', height: '100%', border: '1px solid black' }}
      />
    </Column>
  );
};

export default Brainstorming;
