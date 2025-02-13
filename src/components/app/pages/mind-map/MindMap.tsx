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
    // Clear any previous SVG content.
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Set up the SVG.
    svg.attr("width", width)
       .attr("height", height)
       .style("border", "1px solid #ccc")
       .style("background", "#fafafa");

    // Append a main group for zooming/panning.
    const g = svg.append("g");

    // Add zoom behavior.
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 10])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoomBehavior);

    // Define your nodes and links.
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

    // Append a rounded rectangle for each node.
    nodeSelection.append("rect")
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", d => d3.schemeCategory10[d.group % 10]);

    // Append text for each node.
    nodeSelection.append("text")
      .text(d => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .style("pointer-events", "all")
      .style("cursor", "pointer")
      .on("dblclick", function(event, d) {
        // Prevent zoom interference.
        event.stopPropagation();
        d.editing = true;
        d3.select(this).style("display", "none");

        // Append a foreignObject within the node group.
        const fo = d3.select(this.parentNode)
          .append("foreignObject")
          .attr("id", "edit-" + d.id)
          .attr("width", 150)
          .attr("height", 30)
          // Center the foreignObject relative to the node.
          .attr("x", -75)
          .attr("y", -15);

        const input = fo.append("xhtml:input")
          .attr("type", "text")
          .style("width", "148px")
          .style("height", "28px")
          .style("font-size", "14px")
          .node() as HTMLInputElement;

        input.value = d.label;
        input.focus();

        // When editing is done, update the node text and rectangle size.
        const finishEditing = () => {
          d.label = input.value;
          d.editing = false;
          fo.remove();
          d3.select(this)
            .text(d.label)
            .style("display", "block");
          updateRect(d3.select(this.parentNode), d);
        };

        input.addEventListener("blur", finishEditing);
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") finishEditing();
        });
      });

    // Function to update rectangle dimensions based on text size.
    function updateRect(nodeGroupSelection: d3.Selection<SVGGElement, NodeDatum, any, any>, d: NodeDatum) {
      const textEl = nodeGroupSelection.select("text").node();
      if (textEl) {
        const bbox = textEl.getBBox();
        const padding = 10;
        nodeGroupSelection.select("rect")
          .attr("x", bbox.x - padding / 2)
          .attr("y", bbox.y - padding / 2)
          .attr("width", bbox.width + padding)
          .attr("height", bbox.height + padding);
      }
    }

    // Initially update all rectangle sizes.
    nodeSelection.each(function(d) {
      updateRect(d3.select(this), d);
    });

    // Update positions on every simulation tick.
    simulation.on("tick", () => {
      // Update link positions.
      link
        .attr("x1", d => (d.source as NodeDatum).x!)
        .attr("y1", d => (d.source as NodeDatum).y!)
        .attr("x2", d => (d.target as NodeDatum).x!)
        .attr("y2", d => (d.target as NodeDatum).y!);

      // Update node group positions and rectangle sizes.
      nodeSelection.attr("transform", d => `translate(${d.x}, ${d.y})`)
        .each(function(d) {
          updateRect(d3.select(this), d);
        });
    });

    // Drag behavior.
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

    // Cleanup simulation on unmount.
    return () => {
      simulation.stop();
    };
  }, [width, height]);

  return <svg ref={svgRef} style={{ width: "100vw", height: "100vh" }} />;
}
