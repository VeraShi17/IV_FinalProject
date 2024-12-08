import React from "react";

const Legend = ({ thresholds, colors, width = 320, height = 60 }) => {
    const boxWidth = width / (thresholds.length + 1); // Extra box for the last label
    const padding = 10; // Padding on all sides of the legend

    return (
        <svg width={width + padding * 2} height={height + padding * 2}>
            {/* Background Rectangle with White Border */}
            <rect
                x="0"
                y="0"
                width={width + padding * 2}
                height={height + padding * 2}
                fill="white" // Background color
                stroke="black" // Border color
                strokeWidth="1" // Border width
                rx="5" // Rounded corners
                ry="5"
            />

            {/* Render the gradient as discrete boxes */}
            {thresholds.map((threshold, index) => (
                <g key={index}>
                    {/* Color Box */}
                    <rect
                        x={padding + boxWidth * index}
                        y={padding + 10}
                        width={boxWidth}
                        height="20"
                        fill={colors[index]}
                    />
                    {/* Threshold Label */}
                    <text
                        x={padding + boxWidth * index + boxWidth / 2}
                        y={padding + 45}
                        fontSize="10"
                        textAnchor="middle"
                        dy="0.35em"
                    >
                        {threshold}
                    </text>
                </g>
            ))}

            {/* Last label for the last range */}
            <text
                x={padding + boxWidth * thresholds.length + boxWidth / 2}
                y={padding + 45}
                fontSize="10"
                textAnchor="middle"
                dy="0.35em"
            >
                {`≥ ${thresholds[thresholds.length - 1]}`}
            </text>
        </svg>
    );
};

export default Legend;
