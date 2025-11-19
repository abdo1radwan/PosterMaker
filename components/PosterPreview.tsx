
import React from 'react';
import { PosterData, PosterTheme, PosterLayout } from '../types';
import { SimpleBarChart } from './SimpleBarChart';

interface PosterPreviewProps {
  data: PosterData;
  theme: PosterTheme;
  layout: PosterLayout;
  scale?: number;
}

const DecorativeHeader: React.FC<{ theme: PosterTheme }> = ({ theme }) => {
  // SVG patterns based on theme ID
  const color = theme.colors.accent;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {theme.id === 'eco' && (
            <svg className="absolute right-0 top-0 h-full w-auto opacity-20" viewBox="0 0 400 400" fill={color}>
                <path d="M200,0 C90,0 0,90 0,200 C0,310 90,400 200,400 C310,400 400,310 400,200 C400,90 310,0 200,0 Z M200,350 C117,350 50,283 50,200 C50,117 117,50 200,50 C283,50 350,117 350,200 C350,283 283,350 200,350 Z" />
                <path d="M200,100 L200,300 M100,200 L300,200" stroke={color} strokeWidth="20" />
            </svg>
        )}
        {theme.id === 'ocean' && (
            <svg className="absolute right-10 bottom-0 h-3/4 w-auto opacity-15" viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="2">
                <path d="M0,50 Q25,0 50,50 T100,50" />
                <path d="M0,60 Q25,10 50,60 T100,60" />
                <path d="M0,70 Q25,20 50,70 T100,70" />
            </svg>
        )}
        {(theme.id === 'slate' || theme.id === 'minimal' || theme.id === 'ice') && (
            <svg className="absolute right-0 top-0 h-full w-auto opacity-10" viewBox="0 0 200 200">
                 <circle cx="100" cy="100" r="80" stroke={color} strokeWidth="2" fill="none"/>
                 <circle cx="100" cy="100" r="60" stroke={color} strokeWidth="2" fill="none"/>
                 <line x1="100" y1="20" x2="100" y2="180" stroke={color} strokeWidth="2" />
                 <line x1="20" y1="100" x2="180" y2="100" stroke={color} strokeWidth="2" />
            </svg>
        )}
        {(theme.id === 'crimson' || theme.id === 'brick') && (
             <svg className="absolute right-0 top-0 h-full w-auto opacity-15" viewBox="0 0 100 100">
                 <path d="M10,50 L50,10 L90,50 L50,90 Z" fill="none" stroke={color} strokeWidth="1" />
                 <path d="M50,10 L50,90 M10,50 L90,50" stroke={color} strokeWidth="0.5" />
             </svg>
        )}
         {theme.id === 'nature' && (
             <svg className="absolute right-0 top-0 h-full w-auto opacity-20" viewBox="0 0 100 100">
                 <path d="M50,100 Q25,50 50,0 Q75,50 50,100 Z" fill={color} />
             </svg>
        )}
    </div>
  );
};

// Reusable Section Component
const Section: React.FC<{ title: string; content: string; theme: PosterTheme; isRefs?: boolean; className?: string; variant?: 'default' | 'filled' }> = ({ title, content, theme, isRefs, className, variant = 'default' }) => (
    <div className={`flex flex-col h-full ${className}`}>
        {variant === 'default' && (
            <>
                <div 
                    className="border-b-4 mb-4 text-center py-2 rounded-t-sm"
                    style={{ 
                        backgroundColor: theme.colors.secondary, 
                        borderColor: theme.colors.primary,
                        borderBottomColor: theme.colors.primary
                    }}
                >
                    <h2 
                        className="text-[40px] font-black uppercase tracking-tighter"
                        style={{ color: theme.colors.primary, fontFamily: theme.fontFamily.heading }}
                    >
                        {title}
                    </h2>
                </div>
                <div 
                    className={`bg-white p-6 shadow-sm flex-grow text-[28px] leading-snug text-justify border-l-4 rounded-b-sm ${isRefs ? 'text-[24px]' : ''}`}
                    style={{ 
                        borderLeftColor: theme.colors.secondary,
                        fontFamily: theme.fontFamily.body 
                    }}
                >
                    {content.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-6 last:mb-0">{paragraph}</p>
                    ))}
                </div>
            </>
        )}
        {variant === 'filled' && (
            <div 
                className="h-full rounded-xl overflow-hidden flex flex-col"
                style={{ backgroundColor: theme.colors.background }}
            >
                <div className="p-4" style={{ backgroundColor: theme.colors.primary }}>
                    <h2 className="text-[32px] font-bold text-white uppercase">{title}</h2>
                </div>
                <div 
                    className={`p-6 flex-grow text-[24px] leading-snug text-justify`}
                    style={{ backgroundColor: `${theme.colors.primary}15` }} // 10% opacity
                >
                    {content.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-6 last:mb-0">{paragraph}</p>
                    ))}
                </div>
            </div>
        )}
    </div>
);

// Reusable Chart/Visual Wrapper
const ChartSection: React.FC<{ data: PosterData; theme: PosterTheme }> = ({ data, theme }) => (
    <div className="flex flex-col gap-2 h-full">
        <div 
            className="border-2 p-4 shadow-sm flex-grow flex flex-col items-center justify-center gap-4 rounded-sm bg-white"
            style={{ borderColor: '#e5e7eb' }}
        >
            {data.resultsChart ? (
                <SimpleBarChart config={data.resultsChart} theme={theme} />
            ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                        <p className="text-[30px] font-bold mb-2">No Chart Data</p>
                        <p className="text-[24px] italic">Add chart data in the Editor</p>
                    </div>
                </div>
            )}
        </div>
        <p className="text-[24px] italic text-center opacity-70" style={{color: theme.colors.text}}>Figure 1. Analysis of Key Metrics.</p>
    </div>
);

// Cycle Circle Component
const CycleCircle: React.FC<{ 
    title: string; 
    content: string; 
    x: string; 
    y: string; 
    w: string; 
    h: string; 
    theme: PosterTheme; 
}> = ({ title, content, x, y, w, h, theme }) => (
    <div 
        className="absolute rounded-[100px] flex flex-col overflow-hidden shadow-xl border-8"
        style={{ 
            left: x, top: y, width: w, height: h,
            backgroundColor: '#f3f4f6',
            borderColor: '#e5e7eb'
        }}
    >
        <div className="py-4 text-center border-b-2 border-gray-200" style={{ backgroundColor: theme.colors.secondary }}>
            <h2 className="text-[36px] font-bold uppercase" style={{ color: theme.colors.primary }}>{title}</h2>
        </div>
        <div className="p-8 text-[22px] leading-normal overflow-hidden text-center flex items-center justify-center h-full">
            <p className="line-clamp-[12]">{content}</p>
        </div>
    </div>
);

// Arrow SVG Component for Cycle Layout
const CycleArrow: React.FC<{ path: string; color: string }> = ({ path, color }) => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 10 }}>
        <path d={path} fill="none" stroke={color} strokeWidth="24" strokeLinecap="round" markerEnd="url(#arrowhead)" />
        <defs>
            <marker id="arrowhead" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                <path d="M0,0 L4,2 L0,4" fill={color} />
            </marker>
        </defs>
    </svg>
);


export const PosterPreview: React.FC<PosterPreviewProps> = ({ data, theme, layout, scale = 0.25 }) => {
  const styles = {
    container: {
      width: '4800px',
      height: '3600px',
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      marginBottom: `-${3600 * (1 - scale)}px`,
      marginRight: `-${4800 * (1 - scale)}px`,
      fontFamily: theme.fontFamily.body,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.sidebarText,
    },
    sidebar: {
      backgroundColor: theme.colors.sidebarBackground,
      color: theme.colors.sidebarText,
    },
    sidebarHeader: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderColor: 'rgba(255,255,255,0.2)',
    },
  };

  return (
    <div 
      className="origin-top-left shadow-2xl overflow-hidden select-none bg-white"
      id="poster-preview"
      style={styles.container}
    >
      {/* Universal Header */}
      <div 
        className="w-full h-[400px] flex items-center justify-center relative px-20 border-b-8 overflow-hidden"
        style={styles.header}
      >
         <DecorativeHeader theme={theme} />
         
         {/* Logo Left */}
         <div className="absolute left-20 top-10 bottom-10 w-[300px] bg-white/10 flex items-center justify-center border-2 border-white/20 text-center rounded-md z-10 backdrop-blur-sm">
            <span className="text-4xl font-bold opacity-70">LOGO</span>
         </div>
         
         {/* Logo Right (Optional balance) */}
         <div className="absolute right-20 top-10 bottom-10 w-[300px] bg-white/10 flex items-center justify-center border-2 border-white/20 text-center rounded-md z-10 backdrop-blur-sm">
             <span className="text-4xl font-bold opacity-70">LOGO</span>
         </div>

         <div className="text-center space-y-6 max-w-[3500px] z-10 relative">
            <h1 className="text-[100px] font-bold leading-tight uppercase tracking-wide drop-shadow-md" style={{ fontFamily: theme.fontFamily.heading }}>
                {data.title}
            </h1>
            <div className="flex flex-col gap-2">
                <p className="text-[40px] font-medium">{data.authors}</p>
                <p className="text-[32px] opacity-90 italic">{data.affiliation}</p>
            </div>
         </div>
      </div>

      {/* Layout Switcher */}
      <div className="h-[3200px] w-full relative">
          
          {/* --- CLASSIC LAYOUT (Sidebar Left) --- */}
          {layout === 'classic' && (
            <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-[1000px] flex flex-col p-12 gap-12 border-r-8" style={styles.sidebar}>
                    <div className="flex flex-col gap-4">
                        <div className="p-4 text-center border-2 rounded-sm" style={styles.sidebarHeader}>
                            <h2 className="text-[50px] font-bold uppercase tracking-wider">Abstract</h2>
                        </div>
                        <div className="text-[32px] leading-relaxed text-justify">{data.abstract}</div>
                    </div>
                    <div className="flex-grow"></div>
                    <div className="flex flex-col gap-4 mb-20">
                        <div className="p-4 text-center border-2 rounded-sm" style={styles.sidebarHeader}>
                            <h2 className="text-[50px] font-bold uppercase tracking-wider">Contact</h2>
                        </div>
                        <div className="text-[32px] leading-relaxed">
                            <p className="font-bold">{data.contactName}</p>
                            <p>{data.contactOrg}</p>
                            <p>{data.contactEmail}</p>
                        </div>
                    </div>
                </div>

                {/* 3 Columns */}
                <div className="flex-1 p-12 grid grid-cols-3 gap-12 content-start bg-white">
                    <div className="flex flex-col gap-12">
                        <Section title="Introduction" content={data.introduction} theme={theme} />
                        <Section title="Methods" content={data.methods} theme={theme} />
                    </div>
                    <div className="flex flex-col gap-12">
                         <Section title="Results" content={data.results} theme={theme} />
                         <ChartSection data={data} theme={theme} />
                    </div>
                    <div className="flex flex-col gap-12">
                        <Section title="Discussion" content={data.discussion} theme={theme} />
                        <Section title="Conclusions" content={data.conclusions} theme={theme} />
                        <Section title="References" content={data.references} theme={theme} isRefs />
                    </div>
                </div>
            </div>
          )}

          {/* --- STANDARD LAYOUT (3 Equal Cols) --- */}
          {layout === 'standard' && (
              <div className="p-12 h-full grid grid-cols-3 gap-16 bg-white">
                  {/* Column 1 */}
                  <div className="flex flex-col gap-12">
                      <Section title="Abstract" content={data.abstract} theme={theme} />
                      <Section title="Introduction" content={data.introduction} theme={theme} />
                      <Section title="Methods" content={data.methods} theme={theme} />
                  </div>
                  {/* Column 2 */}
                  <div className="flex flex-col gap-12">
                      <Section title="Results" content={data.results} theme={theme} />
                      <div className="h-[800px]">
                        <ChartSection data={data} theme={theme} />
                      </div>
                      <Section title="Discussion" content={data.discussion} theme={theme} />
                  </div>
                  {/* Column 3 */}
                  <div className="flex flex-col gap-12">
                      <Section title="Conclusions" content={data.conclusions} theme={theme} />
                      <Section title="References" content={data.references} theme={theme} isRefs />
                      <div className="mt-auto p-8 rounded-lg border-4" style={{ borderColor: theme.colors.primary, backgroundColor: theme.colors.secondary }}>
                          <h3 className="text-[36px] font-bold mb-4 text-center" style={{ color: theme.colors.primary }}>Contact Information</h3>
                          <div className="text-[28px] text-center">
                                <p className="font-bold">{data.contactName}</p>
                                <p>{data.contactOrg}</p>
                                <p>{data.contactEmail}</p>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* --- VISUAL LAYOUT (Center Focus) --- */}
          {layout === 'visual' && (
              <div className="p-12 h-full grid grid-cols-4 gap-12 bg-white">
                  {/* Left Col (1 Col width) */}
                  <div className="flex flex-col gap-10">
                      <Section title="Abstract" content={data.abstract} theme={theme} />
                      <Section title="Introduction" content={data.introduction} theme={theme} />
                      <Section title="Methods" content={data.methods} theme={theme} />
                  </div>

                  {/* Center (2 Cols width) */}
                  <div className="col-span-2 flex flex-col gap-10">
                      <div className="flex-grow border-8 p-4 rounded-lg" style={{ borderColor: theme.colors.secondary }}>
                          <ChartSection data={data} theme={theme} />
                      </div>
                      <Section title="Results & Analysis" content={data.results} theme={theme} />
                  </div>

                  {/* Right Col (1 Col width) */}
                  <div className="flex flex-col gap-10">
                      <Section title="Discussion" content={data.discussion} theme={theme} />
                      <Section title="Conclusions" content={data.conclusions} theme={theme} />
                      <Section title="References" content={data.references} theme={theme} isRefs />
                      <div className="text-center mt-auto">
                          <p className="text-[24px] font-bold" style={{color: theme.colors.primary}}>{data.contactName} | {data.contactEmail}</p>
                      </div>
                  </div>
              </div>
          )}

          {/* --- CYCLE LAYOUT (Circular Flow) --- */}
          {layout === 'cycle' && (
            <div className="w-full h-full relative bg-white">
                {/* Background Arrows - Hardcoded for 4800x3200 canvas */}
                <CycleArrow path="M 1200 800 Q 800 2000 1000 2500" color={theme.colors.accent === '#fef08a' ? '#fca5a5' : theme.colors.accent} />
                <CycleArrow path="M 1500 2700 Q 2400 2900 2200 2500" color={theme.colors.accent === '#fef08a' ? '#fca5a5' : theme.colors.accent} />
                <CycleArrow path="M 2600 2500 Q 3200 2900 3600 2500" color={theme.colors.accent === '#fef08a' ? '#fca5a5' : theme.colors.accent} />
                <CycleArrow path="M 3900 2200 Q 4200 1500 3600 900" color={theme.colors.accent === '#fef08a' ? '#fca5a5' : theme.colors.accent} />

                {/* Circles */}
                {/* Intro - Top Left */}
                <CycleCircle title="Introduction" content={data.introduction} x="500px" y="200px" w="1200px" h="800px" theme={theme} />
                
                {/* Conclusion - Top Right */}
                <CycleCircle title="Conclusion" content={data.conclusions} x="3100px" y="200px" w="1200px" h="800px" theme={theme} />

                {/* Materials - Bottom Left */}
                <CycleCircle title="Materials" content={data.methods.substring(0, 300) + "..."} x="300px" y="1800px" w="1000px" h="800px" theme={theme} />

                {/* Methodology - Bottom Center */}
                <CycleCircle title="Methodology" content={data.methods} x="1600px" y="2000px" w="1400px" h="900px" theme={theme} />

                {/* Results - Bottom Right */}
                <CycleCircle title="Results" content={data.results} x="3300px" y="1800px" w="1200px" h="900px" theme={theme} />
                
                {/* Center Chart */}
                <div className="absolute top-[1200px] left-[1800px] w-[1000px] h-[600px] z-10 shadow-lg border-4 border-white rounded-xl bg-white p-4">
                    <ChartSection data={data} theme={theme} />
                </div>
            </div>
          )}

          {/* --- GEOMETRIC LAYOUT (Colored Blocks) --- */}
          {layout === 'geometric' && (
              <div className="p-12 h-full grid grid-cols-4 gap-8 bg-white">
                  {/* Col 1 */}
                  <div className="flex flex-col gap-8">
                      <div className="bg-rose-50 h-[500px] p-8 border-l-8 border-rose-400 rounded-r-xl shadow-sm">
                          <h3 className="text-[40px] font-bold text-rose-800 mb-4">Abstract</h3>
                          <p className="text-[24px]">{data.abstract}</p>
                      </div>
                      <Section title="Introduction" content={data.introduction} theme={theme} variant="filled" />
                  </div>

                  {/* Col 2 (Wide) */}
                  <div className="col-span-2 flex flex-col gap-8">
                      <div className="h-[1400px] rounded-xl overflow-hidden flex flex-col bg-slate-100 border-t-8 border-slate-400">
                          <div className="p-4 bg-slate-200">
                              <h2 className="text-[32px] font-bold text-slate-700 uppercase">Methodology</h2>
                          </div>
                          <div className="p-8 text-[26px] leading-relaxed">{data.methods}</div>
                          <div className="flex-grow p-8">
                              <ChartSection data={data} theme={theme} />
                          </div>
                      </div>
                      <div className="flex-grow rounded-xl overflow-hidden flex flex-col bg-indigo-50 border-t-8 border-indigo-400">
                           <div className="p-4 bg-indigo-100">
                              <h2 className="text-[32px] font-bold text-indigo-800 uppercase">Results</h2>
                          </div>
                          <div className="p-8 text-[26px] leading-relaxed">{data.results}</div>
                      </div>
                  </div>

                  {/* Col 3 */}
                  <div className="flex flex-col gap-8">
                       <div className="bg-emerald-50 flex-grow p-8 border-l-8 border-emerald-500 rounded-r-xl shadow-sm flex flex-col">
                          <h3 className="text-[40px] font-bold text-emerald-800 mb-4">Conclusion</h3>
                          <p className="text-[24px]">{data.conclusions}</p>
                      </div>
                      <div className="bg-amber-50 h-[800px] p-8 border-l-8 border-amber-400 rounded-r-xl shadow-sm">
                          <h3 className="text-[40px] font-bold text-amber-800 mb-4">Discussion</h3>
                          <p className="text-[24px]">{data.discussion}</p>
                      </div>
                      <Section title="References" content={data.references} theme={theme} isRefs />
                  </div>
              </div>
          )}

          {/* --- RESEARCH LAYOUT (4 Column Density) --- */}
          {layout === 'research' && (
              <div className="p-16 h-full grid grid-cols-4 gap-12 bg-white">
                  <div className="flex flex-col gap-10">
                      <div className="bg-gray-100 p-6 border-b-4 border-gray-400">
                          <h3 className="text-[32px] font-bold">Abstract</h3>
                          <p className="text-[20px] mt-2">{data.abstract}</p>
                      </div>
                      <Section title="Introduction" content={data.introduction} theme={theme} />
                  </div>
                  <div className="flex flex-col gap-10">
                      <Section title="Methods" content={data.methods} theme={theme} />
                      <div className="flex-grow border-4 border-dashed border-gray-300 p-4 rounded-lg">
                          <ChartSection data={data} theme={theme} />
                      </div>
                  </div>
                  <div className="flex flex-col gap-10">
                       <Section title="Results" content={data.results} theme={theme} />
                       <Section title="Discussion" content={data.discussion} theme={theme} />
                  </div>
                  <div className="flex flex-col gap-10">
                      <Section title="Conclusions" content={data.conclusions} theme={theme} />
                      <Section title="References" content={data.references} theme={theme} isRefs />
                      <div className="mt-auto border-t-4 pt-6" style={{borderColor: theme.colors.primary}}>
                          <h4 className="text-[24px] font-bold mb-2">Acknowledgements</h4>
                          <p className="text-[20px]">We thank the school administration and our mentors for their support.</p>
                      </div>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};