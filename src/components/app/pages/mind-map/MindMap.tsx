import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface NodeDatum {
  id: string;
  label: string;
  group: number;
  editing?: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export default function Brainstorming() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // Clear previous SVG content.
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Set up the SVG.
    svg.attr("width", width)
       .attr("height", height)
       .style("border", "1px solid #ccc")
       .style("background", "#fafafa");

    // Append main group for pan/zoom.
    const g = svg.append("g");

    // Set up zoom behavior.
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 10])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoomBehavior);

    // Define nodes and links.
    const nodes: NodeDatum[] = [
      { id: "Central Idea", label: "Central Idea", group: 1 },
      { id: "Idea 1", label: "Idea 1", group: 2 },
      { id: "Idea 2", label: "Idea 2", group: 2 },
      { id: "Idea 3", label: "Idea 3", group: 2 },
      { id: "Sub Idea 1", label: "Sub Idea 1", group: 3 },
      { id: "Sub Idea 2", label: "Sub Idea 2", group: 3 },
    ];

    const links = [
      { source: "Central Idea", target: "Idea 1" },
      { source: "Central Idea", target: "Idea 2" },
      { source: "Central Idea", target: "Idea 3" },
      { source: "Idea 1", target: "Sub Idea 1" },
      { source: "Idea 2", target: "Sub Idea 2" }
    ];

    // Create the simulation.
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links)
                        .id((d: any) => d.id)
                        .distance(150))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Draw links.
    const linkGroup = g.append("g").attr("class", "links");
    const link = linkGroup.selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    // Create a group for each node.
    const nodeGroup = g.append("g").attr("class", "nodes");
    const nodeSelection = nodeGroup.selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation));

    // Append a rounded rectangle.
    nodeSelection.append("rect")
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", d => d3.schemeCategory10[d.group % 10]);

    // Append a text element that will show multiple lines.
    nodeSelection.append("text")
      .attr("text-anchor", "middle")
      .attr("xml:space", "preserve")
      .style("pointer-events", "all")
      .style("cursor", "pointer")
      .each(function(d) {
         // Initialize multi‑line display.
         updateTextDisplay(d3.select(this.parentNode as SVGGElement), d.label);
      })
      // Trigger editing on single click.
      .on("click", function(event, d) {
         event.stopPropagation();
         d.editing = true;
         // Hide the text element.
         d3.select(this).style("display", "none");

         const parentGroup = d3.select(this.parentNode);
         // Append a foreignObject containing a textarea.
         const fo = parentGroup.append("foreignObject")
           .attr("id", "edit-" + d.id)
           .attr("width", 200)
           .attr("height", 100)
           .attr("x", -100)
           .attr("y", -50);
         const textarea = fo.append("xhtml:textarea")
           .style("width", "198px")
           .style("height", "98px")
           .style("font-size", "14px")
           .node() as HTMLTextAreaElement;
         textarea.value = d.label;
         textarea.focus();

         // When pressing keys...
         textarea.addEventListener("keydown", (e) => {
           // If Enter is pressed without Shift, finish editing.
           if (e.key === "Enter" && !e.shiftKey) {
             e.preventDefault();
             finishEditing();
           }
           // If Shift+Enter, allow newline insertion.
         });
         // Also finish editing on blur.
         textarea.addEventListener("blur", finishEditing);
         function finishEditing() {
           d.label = textarea.value;
           d.editing = false;
           fo.remove();
           // Show and update the text element with multiline support.
           const textEl = d3.select(parentGroup.select("text").node());
           textEl.style("display", "block");
           updateTextDisplay(parentGroup, d.label);
         }
      });

    // On every simulation tick, update positions and rectangle sizes.
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as NodeDatum).x!)
        .attr("y1", d => (d.source as NodeDatum).y!)
        .attr("x2", d => (d.target as NodeDatum).x!)
        .attr("y2", d => (d.target as NodeDatum).y!);
      nodeSelection.attr("transform", d => `translate(${d.x},${d.y})`)
        .each(function() {
          updateRect(d3.select(this));
        });
    });

    // Updates the displayed text by splitting into lines (using tspans).
    function updateTextDisplay(nodeGroupSelection: d3.Selection<SVGGElement, NodeDatum, any, any>, textString: string) {
      const textEl = nodeGroupSelection.select("text");
      textEl.selectAll("tspan").remove();
      const lines = textString.split("\n");
      lines.forEach((line, i) => {
        textEl.append("tspan")
          .attr("x", 0)
          .attr("dy", i === 0 ? "0em" : "1.2em")
          .text(line);
      });
      updateRect(nodeGroupSelection);
    }

    // Update the rectangle to enclose the text with some padding.
    function updateRect(nodeGroupSelection: d3.Selection<SVGGElement, unknown, any, any>) {
      const textEl = nodeGroupSelection.select("text").node() as SVGTextElement;
      if (textEl) {
        const bbox = textEl.getBBox();
        const padding = 10;
        nodeGroupSelection.select("rect")
          .attr("x", bbox.x - padding/2)
          .attr("y", bbox.y - padding/2)
          .attr("width", bbox.width + padding)
          .attr("height", bbox.height + padding);
      }
    }

    // Drag behavior for nodes.
    function drag(simulation: d3.Simulation<any, any>) {
      function dragstarted(event: any, d: NodeDatum) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(event: any, d: NodeDatum) {
        d.fx = event.x;
        d.fy = event.y;
      }
      function dragended(event: any, d: NodeDatum) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    // Clean up on unmount.
    return () => simulation.stop();
  }, [width, height]);

  return <svg ref={svgRef} style={{ width: "100vw", height: "100vh" }} />;
}
