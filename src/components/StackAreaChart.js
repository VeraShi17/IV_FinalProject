import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const StackAreaChart = ({ data, selectedCountry }) => {
    const svgRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

    useEffect(() => {
        // Resize dynamically based on parent container
        const resizeObserver = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            setDimensions({ width, height: height || 400 }); // Default height if unavailable
        });

        const currentSvgRef = svgRef.current; // Copy ref value to a local variable

        if (currentSvgRef) {
            resizeObserver.observe(currentSvgRef.parentNode);
        }

        return () => {
            if (currentSvgRef) {
                resizeObserver.unobserve(currentSvgRef.parentNode);
            }
        };
    }, []);

    useEffect(() => {
        if (!data.length) return;

        const { width, height } = dimensions;
        const margin = { top: 10, right: 70, bottom: 50, left: 70 };

        // Filter data for the selected country and exclude "All ages"
        const filteredData = data.filter(
            (d) => d.location_name === selectedCountry && d.age_name !== "All ages"
        );

        // Ensure values are numeric and sort data by year
        const sortedData = filteredData
            .map((d) => ({
                ...d,
                year: +d.year,
                val: +d.val,
            }))
            .sort((a, b) => a.year - b.year);

        // Define the desired age group order
        const ageGroups = ["<20 years", "20-35 years", ">35 years"]; // Custom order
        const years = Array.from(new Set(sortedData.map((d) => d.year)));

        // Group data by year for stacking
        const groupedData = years.map((year) => {
            const yearData = sortedData.filter((d) => d.year === year);
            const yearObject = { year };
            ageGroups.forEach((age) => {
                const ageData = yearData.find((d) => d.age_name === age);
                yearObject[age] = ageData ? ageData.val : 0; // Fill missing values with 0
            });
            return yearObject;
        });

        // Create stack generator with custom order
        const stack = d3.stack().keys(ageGroups);
        const stackedData = stack(groupedData);

        // Set up scales
        const xScale = d3
            .scaleLinear()
            .domain(d3.extent(years))
            .range([margin.left, width - margin.right]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(stackedData, (layer) => d3.max(layer, (d) => d[1]))])
            .range([height - margin.bottom, margin.top]);

        const colorScale = d3
            .scaleOrdinal()
            .domain(ageGroups)
            .range(["#ffeda0", "#f16913", "#8c2d04"]);

        // Select the SVG element and clear previous content
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const tooltip = d3.select("#tooltip").style("opacity", 0);

        // Draw axes
        svg
            .append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

        svg
            .append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale));

        svg
            .append("text")
            .attr("x", width / 2) // Center along the x-axis
            .attr("y", height - margin.bottom / 4) // Position near the bottom
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "#000") // Text color
            .text("Year");

        svg
            .append("text")
            .attr("transform", "rotate(-90)") // Rotate the text
            .attr("x", -height / 2 + 20) // Center along the y-axis
            .attr("y", margin.left / 4) // Adjust based on the margin
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "#000") // Text color
            .text("Number of maternal deaths");

        // Draw areas
        svg
            .append("g")
            .selectAll("path")
            .data(stackedData)
            .join("path")
            .attr("fill", (d) => colorScale(d.key))
            .attr(
                "d",
                d3
                    .area()
                    .x((d) => xScale(d.data.year))
                    .y0((d) => yScale(d[0]))
                    .y1((d) => yScale(d[1]))
            )
            .on("mousemove", function (event, d) {
                const [x, y] = d3.pointer(event);
                const year = Math.round(xScale.invert(x));
                const yearData = groupedData.find((g) => g.year === year);

                if (yearData) {
                    const value = d.key in yearData ? yearData[d.key] : 0;
                    tooltip
                        .style("opacity", 1)
                        .style("left", `${event.pageX + 10}px`)
                        .style("top", `${event.pageY - 20}px`)
                        .html(
                            `<strong>${d.key}</strong><br/>Year: ${year}<br/>Value: ${value.toFixed(
                                2
                            )}`
                        );
                }
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });

        // Add legend
        // Add legend
        const legend = svg
            .append("g")
            .attr(
                "transform",
                `translate(${width - margin.right + 10},${margin.top})` // Adjust the position to fit additional labels
            );

        legend
            .selectAll("rect")
            .data(ageGroups)
            .join("rect")
            .attr("x", 0)
            .attr("y", (d, i) => i * 40) // Increase spacing for additional labels
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", (d) => colorScale(d));

        legend
            .selectAll("text")
            .data(ageGroups)
            .join("text")
            .attr("x", 20)
            .attr("y", (d, i) => i * 40 + 12) // Match vertical alignment with rectangles
            .attr("font-size", "12px")
            .each(function (d) {
                // Add main label
                d3.select(this)
                    .append("tspan")
                    .text(() => {
                        if (d === "<20 years") return "<20 years";
                        if (d === "20-35 years") return "20-35 years";
                        if (d === ">35 years") return ">35 years";
                    });

                // Add secondary explanatory label
                d3.select(this)
                    .append("tspan")
                    .text(() => {
                        if (d === "<20 years") return " (Adolescent Pregnancy Age)";
                        if (d === ">35 years") return " (Advanced Maternal Age)";
                        return ""; // No secondary label for "20-35 years"
                    })
                    .attr("x", 20) // Align with main label
                    .attr("dy", "15"); // Move to the next line
            });

    }, [data, selectedCountry, dimensions]);

    return (
        <svg
            ref={svgRef}
            width={dimensions.width + 125} // Add extra width for the legend
            height={dimensions.height}
            preserveAspectRatio="xMinYMin meet"
        ></svg>
    );

};

export default StackAreaChart;
