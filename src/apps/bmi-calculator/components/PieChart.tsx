import React from 'react';

interface PieChartSegment {
  percentage: number;
  color: string; // Should be a hex color string for SVG
  label?: string;
}

interface PieChartProps {
  segments: PieChartSegment[];
  size?: number; 
  strokeWidth?: number;
}

const PieChart: React.FC<PieChartProps> = ({ segments, size = 150, strokeWidth = 20 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercentage = 0;

  // Center the chart within the SVG viewport
  const center = size / 2;

  return (
    <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`} 
        className="transform -rotate-90 rounded-full"
    >
      {segments.map((segment, index) => {
        if (segment.percentage === 0) return null;
        
        const segmentCircumference = (segment.percentage / 100) * circumference;
        // Cap the segment at full circumference to avoid overdraw issues with small percentages summing > 100 due to rounding
        const finalSegmentCircumference = Math.min(segmentCircumference, circumference - (accumulatedPercentage / 100) * circumference);

        const strokeDasharray = `${finalSegmentCircumference} ${circumference}`;
        const strokeDashoffset = - (accumulatedPercentage / 100) * circumference;
        accumulatedPercentage += segment.percentage;

        return (
          <circle
            key={index}
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={segment.color} // Ensure this is a valid SVG color string (e.g. hex)
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            data-testid={`pie-segment-${index}`}
            strokeLinecap="round" // Makes segment ends rounded
          />
        );
      })}
    </svg>
  );
};

export default PieChart;
