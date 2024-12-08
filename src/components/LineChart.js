import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const LineChart = ({ data, selectedCountry }) => {
  const svgRef = useRef();
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };

  useEffect(() => {
    if (!data.length) return;

    // Filter data for the selected country
    const filteredData = data.filter((d) => d.location_name === selectedCountry);

    // Ensure values have 3 decimal places
    const processedData = filteredData.map((d) => ({
      ...d,
      val: parseFloat(d.val.toFixed(3)),
    }));

    // Get unique age groups
    const ageGroups = Array.from(new Set(processedData.map((d) => d.age_name)));

    // Get unique years and sort them
    const years = Array.from(new Set(processedData.map((d) => d.year))).sort(
      (a, b) => a - b
    );

    // Fill missing data for each age group and year
    const groupedData = ageGroups.map((age) => ({
      age,
      values: years.map((year) => {
        const record = processedData.find(
          (d) => d.age_name === age && d.year === year
        );
        return {
          year,
          val: record ? record.val : null, // Use null for missing values
        };
      }),
    }));

    // Set up scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(years))
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(processedData, (d) => d.val)])
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(ageGroups);

    // Select the SVG element and clear previous content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Draw axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Draw lines
    svg
      .append("g")
      .selectAll("path")
      .data(groupedData)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", (d) => colorScale(d.age))
      .attr("stroke-width", 2)
      .attr(
        "d",
        (d) =>
          d3
            .line()
            .defined((point) => point.val !== null) // Ignore missing data points
            .x((point) => xScale(point.year))
            .y((point) => yScale(point.val))(d.values)
      );

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - margin.right - 100},${margin.top})`);

    legend
      .selectAll("rect")
      .data(ageGroups)
      .join("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 20)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d) => colorScale(d));

    legend
      .selectAll("text")
      .data(ageGroups)
      .join("text")
      .attr("x", 20)
      .attr("y", (d, i) => i * 20 + 12)
      .text((d) => d)
      .attr("font-size", "12px");
  }, [data, selectedCountry]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default LineChart;