import React, { useEffect, useRef } from "react";
import { geoEqualEarth, geoPath, geoNaturalEarth1 } from "d3-geo";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const GeoMap = ({ geoJsonUrl, csvData, year, onCountryClick, selectedCountry }) => {
    const svgRef = useRef();
    const width = 820;
    const height = 450;

    useEffect(() => {
        const fetchData = async () => {
            // Fetch and parse GeoJSON or TopoJSON
            const response = await fetch(geoJsonUrl);
            const topoJsonData = await response.json();
            const geoData = topojson.feature(topoJsonData, topoJsonData.objects.countries);

            // Set up projection and path generator
            const projection = geoEqualEarth().fitSize([width, height], geoData);
            const pathGenerator = geoPath(projection);

            // Prepare the data map for coloring
            const dataMap = csvData.reduce((acc, row) => {
                if (row.year === year) {
                    acc[row.location_name] = row.val;
                }
                return acc;
            }, {});

            // Create a threshold color scale
            const thresholds = [0, 10, 25, 50, 100, 250, 500, 1000];
            const colorScale = d3.scaleThreshold()
                .domain(thresholds)
                .range(
                    [
                        "#fff5eb",
                        "#fee6ce",
                        "#fdd0a2",
                        "#fdae6b",
                        "#fd8d3c",
                        "#f16913",
                        "#d94801",
                        "#8c2d04",
                    ]
                );

            const formatValue = d3.format(".3f"); // Format to three decimal places

            // Render the map
            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove();

            svg
                .selectAll("path")
                .data(geoData.features)
                .join("path")
                .attr("d", pathGenerator)
                .attr("fill", (d) => {
                    const countryName = d.properties.name;
                    const value = dataMap[countryName];
                    return value !== undefined ? colorScale(value) : "#ccc"; // Default for missing data
                })
                .attr("stroke", "#999")
                .attr("stroke-width", (d) => (d.properties.name === selectedCountry ? 1.5 : 0.5))
                .attr("opacity", (d) => {
                    // No blurring when "Global" is selected
                    if (selectedCountry === "Global") return 1;
                    return d.properties.name === selectedCountry ? 1 : 0.3;
                })
                .attr("transform", (d) =>
                    d.properties.name === selectedCountry ? "scale(1.3)" : "scale(1)"
                )
                .attr("transform-origin", (d) => {
                    if (d.properties.name === selectedCountry) {
                        const [x, y] = pathGenerator.centroid(d); // Get centroid of the country
                        return `${x}px ${y}px`; // Set the transformation origin
                    }
                    return null;
                })
                .on("click", (event, d) => {
                    if (selectedCountry === d.properties.name) {
                        onCountryClick("Global"); // Deselect
                    } else {
                        onCountryClick(d.properties.name); // Select
                    }
                })
                .append("title") // Tooltip
                .text((d) => {
                    const countryName = d.properties.name;
                    const value = dataMap[countryName];
                    return value !== undefined
                        ? `${countryName}: ${formatValue(value)}`
                        : `${countryName}: No Data`;
                });
        };

        fetchData();
    }, [geoJsonUrl, csvData, year, onCountryClick, selectedCountry]);

    return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default GeoMap;
