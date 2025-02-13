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

export default function MindMap() {
  // Use full viewport dimensions for the canvas.
  const width = window.innerWidth;
  const height = window.innerHeight;
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // Select the SVG and clear any previous content.
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Set up the SVG's dimensions and style.
    svg.attr("width", width)
       .attr("height", height)
       .style("border", "1px solid #ccc")
       .style("background", "#fafafa");

    // Create a main group (g) that will be zoomed/panned.
    const g = svg.append("g");

    // Set up zoom behavior with panning & zooming.
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

    // Create a force simulation.
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links)
                        .id((d: any) => d.id)
                        .distance(150))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Create separate groups for links, nodes, and labels.
    const linkGroup = g.append("g").attr("class", "links");
    const nodeGroup = g.append("g").attr("class", "nodes");
    const textGroup = g.append("g").attr("class", "labels");

    // Draw the links.
    const link = linkGroup.selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    // Draw the nodes.
    const node = nodeGroup.selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 20)
      .attr("fill", d => d3.schemeCategory10[d.group % 10])
      .call(drag(simulation));

    // Add tooltips for nodes.
    node.append("title")
      .text(d => d.id);

    // Draw text labels for each node.
    // These text elements are interactive and editable on double-click.
    const text = textGroup.selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("pointer-events", "all")
      .style("cursor", "pointer")
      .on("dblclick", function(event, d) {
        event.stopPropagation();
        d.editing = true;
        d3.select(this).style("display", "none");

        // Append a foreignObject for an HTML input field.
        const fo = textGroup.append("foreignObject")
          .attr("id", "edit-" + d.id)
          .attr("width", 100)
          .attr("height", 30)
          .attr("x", d.x! - 50)
          .attr("y", d.y! - 15);

        const input = fo.append("xhtml:input")
          .attr("type", "text")
          .style("width", "98px")
          .style("height", "28px")
          .style("font-size", "14px")
          .node() as HTMLInputElement;

        input.value = d.label;
        input.focus();

        const finishEditing = () => {
          d.label = input.value;
          d.editing = false;
          fo.remove();
          text.filter(nd => nd.id === d.id)
              .text(d.label)
              .style("display", "block");
        };

        input.addEventListener("blur", finishEditing);
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            finishEditing();
          }
        });
      });

    // Update positions on every simulation tick.
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as NodeDatum).x!)
        .attr("y1", d => (d.source as NodeDatum).y!)
        .attr("x2", d => (d.target as NodeDatum).x!)
        .attr("y2", d => (d.target as NodeDatum).y!);

      node
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);

      text
        .attr("x", d => d.x!)
        .attr("y", d => d.y!);

      // Update the position of any active foreignObject (for editing).
      nodes.forEach(d => {
        if (d.editing) {
          d3.select("#edit-" + d.id)
            .attr("x", d.x! - 50)
            .attr("y", d.y! - 15);
        }
      });
    });

    // Drag behavior functions.
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

    // Cleanup: Stop the simulation on unmount.
    return () => {
      simulation.stop();
    };
  }, [width, height]);

  return <svg ref={svgRef} style={{ width: "100vw", height: "100vh" }} />;
}
