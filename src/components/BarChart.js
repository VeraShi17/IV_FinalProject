import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const BarChart = ({ data, selectedCountry }) => {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // Define the fixed order of `cause_name`
  const causeNames = [
    "Maternal hemorrhage",
    "Maternal abortion and miscarriage",
    "Maternal hypertensive disorders",
    "Maternal obstructed labor and uterine rupture",
    "Ectopic pregnancy",
    "Indirect maternal deaths",
    "Late maternal deaths",
    "Other direct maternal disorders",
    "Maternal sepsis and other maternal infections",
    "Maternal deaths aggravated by HIV/AIDS",
  ];

  useEffect(() => {
    // Resize dynamically based on parent container
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height: height || 400 }); // Default height if unavailable
    });

    if (svgRef.current) {
      resizeObserver.observe(svgRef.current.parentNode);
    }

    return () => {
      if (svgRef.current) resizeObserver.unobserve(svgRef.current.parentNode);
    };
  }, []);

  useEffect(() => {
    if (!data.length) return;

    const { width, height } = dimensions;
    const margin = { top: 20, right: 55, bottom: 150, left: 105 };

    // Filter data for the selected country and cause_names
    const filteredData = data.filter(
      (d) => d.location_name === selectedCountry && causeNames.includes(d.cause_name)
    );

    // Ensure all causes are present, even if their value is 0
    const fullData = causeNames.map((cause) => {
      const entry = filteredData.find((d) => d.cause_name === cause);
      return { cause_name: cause, val: entry ? entry.val : 0 };
    });

    // Set up scales
    const xScale = d3
      .scaleBand()
      .domain(causeNames) // Use the fixed order of causeNames
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(fullData, (d) => d.val)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Select the SVG element and clear previous content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Draw axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0))
      .selectAll("text") // Rotate x-axis labels
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em")
      .attr("transform", "rotate(-20)");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(6));

    svg
      .append("text")
      .attr("x", width - 40) // Center along the x-axis
      .attr("y", height - margin.bottom + 20) // Position near the bottom
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#000") // Text color
      .text("Cause Name");

    svg
      .append("text")
      .attr("transform", "rotate(-90)") // Rotate the text
      .attr("x", -height / 2 + 60) // Center along the y-axis
      .attr("y", margin.left / 4) // Adjust based on the margin
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#000") // Text color
      .text("Number of maternal deaths");

    // Draw bars
    svg
      .append("g")
      .selectAll("rect")
      .data(fullData)
      .join("rect")
      .attr("x", (d) => xScale(d.cause_name))
      .attr("y", (d) => yScale(d.val))
      .attr("height", (d) => yScale(0) - yScale(d.val))
      .attr("width", xScale.bandwidth())
      .attr("fill", "#fc8d62") // Orange color
      .on("mouseover", function (event, d) {
        const tooltip = d3.select("#tooltip");
        tooltip
          .style("opacity", 1)
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 20}px`)
          .html(
            `<strong>${d.cause_name}</strong><br/>Value: ${d.val.toFixed(3)}`
          );
      })
      .on("mouseout", () => {
        d3.select("#tooltip").style("opacity", 0);
      });
  }, [data, selectedCountry, dimensions]);

  return (
    <div>
      <svg ref={svgRef} width="100%" height={dimensions.height}></svg>
      <div
        id="tooltip"
        style={{
          position: "absolute",
          opacity: 0,
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "5px",
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
};

export default BarChart;
