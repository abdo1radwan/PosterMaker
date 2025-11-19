
import React from 'react';
import { ChartConfig, PosterTheme } from '../types';

interface SimpleBarChartProps {
  config: ChartConfig;
  theme: PosterTheme;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ config, theme }) => {
  if (!config.data || config.data.length === 0) return null;

  // Dimensions matching the visual placeholder area in PosterPreview (approx)
  const width = 800;
  const height = 500;
  const padding = { top: 80, right: 40, bottom: 80, left: 100 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...config.data.map(d => d.value)) * 1.1; // 10% buffer
  const barWidth = (chartWidth / config.data.length) * 0.6;
  const gap = (chartWidth / config.data.length) * 0.4;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-sm p-4">
      <h3 
        className="text-[32px] font-bold mb-4 text-center"
        style={{ color: theme.colors.primary, fontFamily: theme.fontFamily.heading }}
      >
        {config.title}
      </h3>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
          const y = padding.top + chartHeight - (tick * chartHeight);
          return (
            <g key={tick}>
              <line 
                x1={padding.left} 
                y1={y} 
                x2={width - padding.right} 
                y2={y} 
                stroke="#e5e7eb" 
                strokeWidth="2" 
              />
              <text 
                x={padding.left - 15} 
                y={y + 8} 
                textAnchor="end" 
                className="text-[20px] fill-gray-500"
                style={{ fontFamily: theme.fontFamily.body }}
              >
                {Math.round(tick * maxValue)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {config.data.map((d, i) => {
          const barHeight = (d.value / maxValue) * chartHeight;
          const x = padding.left + (i * (barWidth + gap)) + (gap / 2);
          const y = padding.top + chartHeight - barHeight;
          
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={theme.colors.accent}
                stroke={theme.colors.primary}
                strokeWidth="2"
              />
              <text
                x={x + barWidth / 2}
                y={y - 10}
                textAnchor="middle"
                className="text-[24px] font-bold"
                style={{ fill: theme.colors.primary, fontFamily: theme.fontFamily.body }}
              >
                {d.value}
              </text>
              <text
                x={x + barWidth / 2}
                y={padding.top + chartHeight + 30}
                textAnchor="middle"
                className="text-[20px] font-medium"
                style={{ fill: theme.colors.text, fontFamily: theme.fontFamily.body }}
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* Axes Labels */}
        <text 
          x={width / 2} 
          y={height - 15} 
          textAnchor="middle" 
          className="text-[24px] font-bold uppercase"
          style={{ fill: theme.colors.text, fontFamily: theme.fontFamily.heading }}
        >
          {config.xAxisLabel}
        </text>
        
        <text 
          transform={`translate(30, ${height / 2}) rotate(-90)`} 
          textAnchor="middle" 
          className="text-[24px] font-bold uppercase"
          style={{ fill: theme.colors.text, fontFamily: theme.fontFamily.heading }}
        >
          {config.yAxisLabel}
        </text>
      </svg>
    </div>
  );
};
