import { Column } from '@/components/design/Grid';
import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';

const Brainstorming = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState([{ x: 400, y: 300 }]);

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

    // ----------------------------------------------------------------
    // 1. Create a main container (world) that is panned/zoomed.
    // ----------------------------------------------------------------
    const container = new PIXI.Container();
    app.stage.addChild(container);

    // ----------------------------------------------------------------
    // 2. Create a grid Graphics object and add it as a child of the container.
    //    Because it’s drawn in the same coordinate system as the nodes,
    //    it will scale along with the world.
    // ----------------------------------------------------------------
    const gridGraphics = new PIXI.Graphics();
    container.addChild(gridGraphics);

    // ----------------------------------------------------------------
    // 3. Create a separate container for your nodes (so that grid is drawn behind nodes).
    // ----------------------------------------------------------------
    const nodesContainer = new PIXI.Container();
    container.addChild(nodesContainer);

    // ----------------------------------------------------------------
    // 4. Grid Settings and redraw function
    // ----------------------------------------------------------------
    let dotSpacing = 20; // World spacing between grid dots (adjust as desired)
    const dotSize = 2;    // Dot radius in world units

    const updateGrid = () => {
      gridGraphics.clear();
      gridGraphics.beginFill(0xcccccc, 0.5);

      // Compute the visible area in world coordinates.
      // Since container is panned/zoomed, the mapping from container's local
      // coordinates to screen is: screen = container.scale * world + container.position.
      const scale = container.scale.x; // assuming uniform scale (x === y)
      const visibleLeft = -container.x / scale;
      const visibleTop = -container.y / scale;
      const visibleRight = visibleLeft + window.innerWidth / scale;
      const visibleBottom = visibleTop + window.innerHeight / scale;

      // Snap starting positions to the grid.
      const startX = Math.floor(visibleLeft / dotSpacing) * dotSpacing;
      const startY = Math.floor(visibleTop / dotSpacing) * dotSpacing;

      // Draw dots for each grid cell in the visible region.
      for (let x = startX; x <= visibleRight; x += dotSpacing) {
        for (let y = startY; y <= visibleBottom; y += dotSpacing) {
          // Place the dot in the center of the grid cell.
          gridGraphics.drawCircle(x + dotSpacing / 2, y + dotSpacing / 2, dotSize);
        }
      }
      gridGraphics.endFill();
    };

    // Draw the grid initially.
    updateGrid();

    // ----------------------------------------------------------------
    // 5. Add nodes (sample red circles).
    // ----------------------------------------------------------------
    nodes.forEach(({ x, y }) => {
      const node = new PIXI.Graphics();
      node.beginFill(0xff0000);
      node.drawCircle(0, 0, 20);
      node.endFill();
      node.x = x;
      node.y = y;
      nodesContainer.addChild(node);
    });

    // ----------------------------------------------------------------
    // 6. Set up panning and zooming for the container.
    //    The grid is redrawn after each update so it scales and repositions correctly.
    // ----------------------------------------------------------------
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
      container.x = containerStart.x + (e.clientX - dragStart.x);
      container.y = containerStart.y + (e.clientY - dragStart.y);
      updateGrid();
    });
    app.view.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const rect = app.view.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Compute the world coordinates under the mouse before zoom.
      const worldX = (mouseX - container.x) / container.scale.x;
      const worldY = (mouseY - container.y) / container.scale.y;

      // Apply zoom.
      container.scale.set(container.scale.x * scaleFactor);
      // Adjust container position so the zoom centers on the mouse pointer.
      container.x = mouseX - worldX * container.scale.x;
      container.y = mouseY - worldY * container.scale.y;
      updateGrid();
    });

    // ----------------------------------------------------------------
    // 7. Cleanup when the component is unmounted.
    // ----------------------------------------------------------------
    return () => {
      app.destroy(true, { children: true, texture: true });
    };
  }, [nodes]);

  const handleAddNode = () => {
    setNodes(prev => [
      ...prev,
      {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      },
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
