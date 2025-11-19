
import React from 'react';
import { VisualContent, PosterTheme } from '../types';

interface VisualRendererProps {
  visual: VisualContent;
  theme: PosterTheme;
}

export const VisualRenderer: React.FC<VisualRendererProps> = ({ visual, theme }) => {
  const width = 800;
  const height = 500;
  const padding = { top: 60, right: 40, bottom: 80, left: 100 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // --- Generic SVG Render ---
  if (visual.type === 'generic-svg' && visual.svgContent) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-sm p-4">
         <h3 
          className="text-[28px] font-bold mb-4 text-center"
          style={{ color: theme.colors.primary, fontFamily: theme.fontFamily.heading }}
        >
          {visual.title}
        </h3>
        <div 
            className="w-full flex-grow flex items-center justify-center overflow-hidden [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-[400px]"
            dangerouslySetInnerHTML={{ __html: visual.svgContent }} 
        />
      </div>
    );
  }

  // --- Charts Pre-calculation ---
  if (!visual.data || visual.data.length === 0) return null;

  const maxValue = Math.max(...visual.data.map(d => d.value)) * 1.1 || 100;

  // --- Bar Chart ---
  if (visual.type === 'bar') {
    const barWidth = (chartWidth / visual.data.length) * 0.6;
    const gap = (chartWidth / visual.data.length) * 0.4;

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-sm p-4">
        <h3 className="text-[28px] font-bold mb-2 text-center" style={{ color: theme.colors.primary, fontFamily: theme.fontFamily.heading }}>{visual.title}</h3>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
           {/* Grid */}
           {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
              const y = padding.top + chartHeight - (tick * chartHeight);
              return (
                <g key={tick}>
                  <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e5e7eb" strokeWidth="2" />
                  <text x={padding.left - 15} y={y + 8} textAnchor="end" className="text-[20px] fill-gray-500" style={{ fontFamily: theme.fontFamily.body }}>{Math.round(tick * maxValue)}</text>
                </g>
              );
            })}
            {/* Bars */}
            {visual.data.map((d, i) => {
              const barHeight = (d.value / maxValue) * chartHeight;
              const x = padding.left + (i * (barWidth + gap)) + (gap / 2);
              const y = padding.top + chartHeight - barHeight;
              return (
                <g key={i}>
                  <rect x={x} y={y} width={barWidth} height={barHeight} fill={theme.colors.accent} stroke={theme.colors.primary} strokeWidth="2" />
                  <text x={x + barWidth / 2} y={y - 10} textAnchor="middle" className="text-[24px] font-bold" style={{ fill: theme.colors.primary, fontFamily: theme.fontFamily.body }}>{d.value}</text>
                  <text x={x + barWidth / 2} y={padding.top + chartHeight + 30} textAnchor="middle" className="text-[20px] font-medium" style={{ fill: theme.colors.text, fontFamily: theme.fontFamily.body }}>{d.label}</text>
                </g>
              );
            })}
            <text x={width / 2} y={height - 15} textAnchor="middle" className="text-[24px] font-bold uppercase" style={{ fill: theme.colors.text, fontFamily: theme.fontFamily.heading }}>{visual.xAxisLabel}</text>
            <text transform={`translate(30, ${height / 2}) rotate(-90)`} textAnchor="middle" className="text-[24px] font-bold uppercase" style={{ fill: theme.colors.text, fontFamily: theme.fontFamily.heading }}>{visual.yAxisLabel}</text>
        </svg>
      </div>
    );
  }

  // --- Line Chart ---
  if (visual.type === 'line') {
    const stepX = chartWidth / (visual.data.length - 1 || 1);
    const points = visual.data.map((d, i) => {
        const x = padding.left + (i * stepX);
        const y = padding.top + chartHeight - ((d.value / maxValue) * chartHeight);
        return `${x},${y}`;
    }).join(' ');

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-sm p-4">
        <h3 className="text-[28px] font-bold mb-2 text-center" style={{ color: theme.colors.primary, fontFamily: theme.fontFamily.heading }}>{visual.title}</h3>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
           {/* Grid */}
           {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
              const y = padding.top + chartHeight - (tick * chartHeight);
              return (
                <g key={tick}>
                  <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e5e7eb" strokeWidth="2" />
                  <text x={padding.left - 15} y={y + 8} textAnchor="end" className="text-[20px] fill-gray-500" style={{ fontFamily: theme.fontFamily.body }}>{Math.round(tick * maxValue)}</text>
                </g>
              );
            })}
            
            {/* Line Path */}
            <polyline points={points} fill="none" stroke={theme.colors.accent} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Dots */}
            {visual.data.map((d, i) => {
               const x = padding.left + (i * stepX);
               const y = padding.top + chartHeight - ((d.value / maxValue) * chartHeight);
               return (
                 <g key={i}>
                    <circle cx={x} cy={y} r="8" fill={theme.colors.primary} stroke="white" strokeWidth="3" />
                    <text x={x} y={y - 20} textAnchor="middle" className="text-[20px] font-bold" style={{ fill: theme.colors.text, fontFamily: theme.fontFamily.body }}>{d.value}</text>
                    <text x={x} y={padding.top + chartHeight + 30} textAnchor="middle" className="text-[20px] font-medium" style={{ fill: theme.colors.text, fontFamily: theme.fontFamily.body }}>{d.label}</text>
                 </g>
               )
            })}

            <text x={width / 2} y={height - 15} textAnchor="middle" className="text-[24px] font-bold uppercase" style={{ fill: theme.colors.text, fontFamily: theme.fontFamily.heading }}>{visual.xAxisLabel}</text>
            <text transform={`translate(30, ${height / 2}) rotate(-90)`} textAnchor="middle" className="text-[24px] font-bold uppercase" style={{ fill: theme.colors.text, fontFamily: theme.fontFamily.heading }}>{visual.yAxisLabel}</text>
        </svg>
      </div>
    );
  }

  // --- Pie Chart ---
  if (visual.type === 'pie') {
      const total = visual.data.reduce((sum, d) => sum + d.value, 0);
      let currentAngle = 0;
      const radius = Math.min(chartWidth, chartHeight) / 2;
      const centerX = width / 2;
      const centerY = (height + padding.top) / 2;
      
      // Simple color palette generator
      const getSliceColor = (index: number) => {
          const colors = [theme.colors.accent, theme.colors.primary, theme.colors.sidebarBackground, '#94a3b8', '#cbd5e1'];
          return colors[index % colors.length];
      };

      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-sm p-4">
            <h3 className="text-[28px] font-bold mb-2 text-center" style={{ color: theme.colors.primary, fontFamily: theme.fontFamily.heading }}>{visual.title}</h3>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {visual.data.map((d, i) => {
                    const sliceAngle = (d.value / total) * 2 * Math.PI;
                    const x1 = centerX + radius * Math.cos(currentAngle);
                    const y1 = centerY + radius * Math.sin(currentAngle);
                    const x2 = centerX + radius * Math.cos(currentAngle + sliceAngle);
                    const y2 = centerY + radius * Math.sin(currentAngle + sliceAngle);
                    
                    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
                    
                    // Path command for wedge
                    const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                    
                    // Label position (midpoint of arc)
                    const labelAngle = currentAngle + sliceAngle / 2;
                    const labelR = radius * 0.7; // inside
                    const labelX = centerX + labelR * Math.cos(labelAngle);
                    const labelY = centerY + labelR * Math.sin(labelAngle);
                    
                    const legendY = padding.top + (i * 30);

                    currentAngle += sliceAngle;

                    return (
                        <g key={i}>
                            <path d={pathData} fill={getSliceColor(i)} stroke="white" strokeWidth="2" />
                            <text x={labelX} y={labelY} textAnchor="middle" alignmentBaseline="middle" fill="white" className="text-[20px] font-bold" style={{ textShadow: '0px 0px 4px rgba(0,0,0,0.5)' }}>
                                {Math.round((d.value / total) * 100)}%
                            </text>
                            
                            {/* Legend */}
                            <rect x={padding.left} y={legendY} width={20} height={20} fill={getSliceColor(i)} />
                            <text x={padding.left + 30} y={legendY + 16} className="text-[20px]" style={{ fill: theme.colors.text, fontFamily: theme.fontFamily.body }}>
                                {d.label} ({d.value})
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
      );
  }

  return null;
};
