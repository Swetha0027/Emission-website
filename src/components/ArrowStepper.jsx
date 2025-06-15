import React, { useState } from 'react';
import { Box } from '@mui/material';

const steps = ['Input Data', 'Analysis', 'Results'];

// Determine step status
const getStatus = (currentIndex, index) => {
  if (index < currentIndex) return 'completed';
  if (index === currentIndex) return 'active';
  return 'default';
};

// Set colors based on status
const getColors = (status) => {
  switch (status) {
    case 'completed':
      return { stroke: '#4caf50', fill: '#ffffff', text: '#4caf50' };
    case 'active':
      return { stroke: '#1976d2', fill: '#e3f2fd', text: '#1976d2' };
    default:
      return { stroke: '#ccc', fill: '#f9f9f9', text: '#888' };
  }
};

// SVG path for step shape
const getPath = (index, total) => {
  const width = 188;
  const height = 25;
  const arrowWidth = 20;

  const isFirst = index === 0;
  const isLast = index === total - 1;

  if (isFirst) {
    return `M0,0 H${width - arrowWidth} L${width},${height / 2} L${width - arrowWidth},${height} H0 Z`;
  } else if (isLast) {
    return `M0,0 H${width} V${height} H0 L${arrowWidth},${height / 2} Z`;
  } else {
    return `M0,0 H${width - arrowWidth} L${width},${height / 2} L${width - arrowWidth},${height} H0 L${arrowWidth},${height / 2} Z`;
  }
};

const ArrowStepper = () => {
  const [activeStep, setActiveStep] = useState(0);

  const height = 25;
  const width = 188;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" gap={1} mt={2}>
      {steps.map((label, index) => {
        const status = getStatus(activeStep, index);
        const { stroke, fill, text } = getColors(status);
        const path = getPath(index, steps.length);

        return (
          <svg
            key={index}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            style={{ flexShrink: 0, cursor: 'pointer' }}
            onClick={() => setActiveStep(index)}
          >
            <path d={path} fill={fill} stroke={stroke} strokeWidth="2" />
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill={text}
              fontWeight="bold"
              fontSize="10"
            >
              {label}
            </text>
          </svg>
        );
      })}
    </Box>
  );
};

export default ArrowStepper;
