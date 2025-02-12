import { Column } from '@/components/design/Grid';
import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { createTextNode } from '@/components/app/pages/brainstorming/nodes/TextNode';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  // Sample node state (if you want additional nodes later).
  const [nodes] = useState([{ x: 400, y: 300 }]);
  // (If needed, you can keep track of additional nodes.)

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create the PIXI application with the view typed as HTMLCanvasElement.
    const app = new PIXI.Application<HTMLCanvasElement>({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    canvasRef.current.appendChild(app.view);

    // ----------------------------------------------------------------
    // 1. Create the main "world" container for panning/zooming.
    // ----------------------------------------------------------------
    const container = new PIXI.Container();
    app.stage.addChild(container);

    // ----------------------------------------------------------------
    // 2. Create a grid Graphics object.
    // ----------------------------------------------------------------
    const gridGraphics = new PIXI.Graphics();
    container.addChild(gridGraphics);

    // ----------------------------------------------------------------
    // 3. Create a container for nodes.
    // ----------------------------------------------------------------
    const nodesContainer = new PIXI.Container();
    container.addChild(nodesContainer);

    // ----------------------------------------------------------------
    // 4. Grid settings:
    // ----------------------------------------------------------------
    const minorSpacing = 100; // world units for minor grid lines.
    const groupFactor = 5;    // every 5 minor cells, draw a thicker major line.
    const majorSpacing = minorSpacing * groupFactor;

    // ----------------------------------------------------------------
    // 5. Update grid function.
    // ----------------------------------------------------------------
    const updateGrid = () => {
      gridGraphics.clear();

      // Compute visible area in world coordinates.
      const scale = container.scale.x; // assume uniform scale (x === y)
      const visibleLeft = -container.x / scale;
      const visibleTop = -container.y / scale;
      const visibleRight = visibleLeft + window.innerWidth / scale;
      const visibleBottom = visibleTop + window.innerHeight / scale;

      // Draw minor grid lines (1px on screen).
      const desiredMinorThickness = 1; // in screen pixels
      const minorThickness = desiredMinorThickness / scale;
      gridGraphics.lineStyle(minorThickness, 0xeeeeee, 1);
      const startX_minor = Math.floor(visibleLeft / minorSpacing) * minorSpacing;
      const startY_minor = Math.floor(visibleTop / minorSpacing) * minorSpacing;
      for (let x = startX_minor; x <= visibleRight; x += minorSpacing) {
        gridGraphics.moveTo(x, visibleTop);
        gridGraphics.lineTo(x, visibleBottom);
      }
      for (let y = startY_minor; y <= visibleBottom; y += minorSpacing) {
        gridGraphics.moveTo(visibleLeft, y);
        gridGraphics.lineTo(visibleRight, y);
      }

      // Draw major grid lines (2px on screen).
      const desiredMajorThickness = 2; // in screen pixels
      const majorThickness = desiredMajorThickness / scale;
      gridGraphics.lineStyle(majorThickness, 0xcccccc, 1);
      const startX_major = Math.floor(visibleLeft / majorSpacing) * majorSpacing;
      const startY_major = Math.floor(visibleTop / majorSpacing) * majorSpacing;
      for (let x = startX_major; x <= visibleRight; x += majorSpacing) {
        gridGraphics.moveTo(x, visibleTop);
        gridGraphics.lineTo(x, visibleBottom);
      }
      for (let y = startY_major; y <= visibleBottom; y += majorSpacing) {
        gridGraphics.moveTo(visibleLeft, y);
        gridGraphics.lineTo(visibleRight, y);
      }
    };

    // Draw the grid initially.
    updateGrid();

    // ----------------------------------------------------------------
    // 6. Add the interactive text node to the nodes container.
    // ----------------------------------------------------------------
    const textNode = createTextNode("…", 200, 200);
    nodesContainer.addChild(textNode);

    // ----------------------------------------------------------------
    // 7. Set up panning and zooming.
    // ----------------------------------------------------------------
    const minScale = 0.2;
    const maxScale = 3;
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let containerStart = { x: 0, y: 0 };

    app.view!.addEventListener('mousedown', (e: Event) => {
      const me = e as MouseEvent;
      isDragging = true;
      dragStart = { x: me.clientX, y: me.clientY };
      containerStart = { x: container.x, y: container.y };
    });
    app.view!.addEventListener('mouseup', () => {
      isDragging = false;
    });
    app.view!.addEventListener('mousemove', (e: Event) => {
      if (!isDragging) return;
      const me = e as MouseEvent;
      container.x = containerStart.x + (me.clientX - dragStart.x);
      container.y = containerStart.y + (me.clientY - dragStart.y);
      updateGrid();
    });
    app.view!.addEventListener('wheel', (e: Event) => {
      e.preventDefault();
      const me = e as WheelEvent;
      const scaleFactor = me.deltaY > 0 ? 0.9 : 1.1;
      const rect = (app.view as HTMLCanvasElement).getBoundingClientRect();
      const mouseX = me.clientX - rect.left;
      const mouseY = me.clientY - rect.top;
      const worldX = (mouseX - container.x) / container.scale.x;
      const worldY = (mouseY - container.y) / container.scale.y;
      let newScale = container.scale.x * scaleFactor;
      newScale = Math.max(minScale, Math.min(maxScale, newScale));
      container.scale.set(newScale);
      container.x = mouseX - worldX * newScale;
      container.y = mouseY - worldY * newScale;
      updateGrid();
    });

    return () => {
      app.destroy(true, { children: true, texture: true });
    };
  }, []);

  return (
    <Column className="items-center fixed">
      <div ref={canvasRef} style={{ width: '100%', height: '100%', border: '1px solid black' }} />
    </Column>
  );
};

export default Canvas;
