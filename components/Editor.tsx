
import React, { useState } from 'react';
import { PosterData, PosterTheme, ChartDataPoint, PosterLayout } from '../types';
import { THEMES } from '../themes';
import { generatePosterContent } from '../services/geminiService';
import { Sparkles, Download, Loader2, FileText, Presentation, ChevronRight, ChevronDown, Palette, LayoutTemplate, Wand2, BarChart3, Plus, Trash2, Info, Columns, RectangleHorizontal, Sidebar, CircleDashed, LayoutGrid, Table2 } from 'lucide-react';
import { exportToPDF, exportToPPTX } from '../services/exportService';

interface EditorProps {
  data: PosterData;
  theme: PosterTheme;
  layout: PosterLayout;
  onDataChange: (data: PosterData) => void;
  onThemeChange: (theme: PosterTheme) => void;
  onLayoutChange: (layout: PosterLayout) => void;
}

export const Editor: React.FC<EditorProps> = ({ data, theme, layout, onDataChange, onThemeChange, onLayoutChange }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'gen' | 'edit' | 'design'>('gen');
  const [expandedSection, setExpandedSection] = useState<string | null>('basic');

  const handleInputChange = (key: keyof PosterData, value: string) => {
    onDataChange({ ...data, [key]: value });
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const generatedData = await generatePosterContent(prompt);
      onDataChange({ ...data, ...generatedData });
      setActiveTab('edit');
    } catch (e) {
      alert("Error generating content. Please check your API Key or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Chart Helpers
  const updateChartField = (field: string, value: string) => {
    if (!data.resultsChart) return;
    onDataChange({ ...data, resultsChart: { ...data.resultsChart, [field]: value } });
  };

  const updateChartPoint = (index: number, field: keyof ChartDataPoint, value: string | number) => {
    if (!data.resultsChart) return;
    const newData = [...data.resultsChart.data];
    newData[index] = { ...newData[index], [field]: value };
    onDataChange({ ...data, resultsChart: { ...data.resultsChart, data: newData } });
  };

  const addChartPoint = () => {
    if (!data.resultsChart) return;
    onDataChange({ 
        ...data, 
        resultsChart: { 
            ...data.resultsChart, 
            data: [...data.resultsChart.data, { label: 'New', value: 0 }] 
        } 
    });
  };

  const removeChartPoint = (index: number) => {
      if (!data.resultsChart) return;
      const newData = data.resultsChart.data.filter((_, i) => i !== index);
      onDataChange({ ...data, resultsChart: { ...data.resultsChart, data: newData } });
  };

  const initChart = () => {
      onDataChange({
          ...data,
          resultsChart: {
              title: "Analysis Results",
              xAxisLabel: "Category",
              yAxisLabel: "Value",
              data: [{ label: "A", value: 10 }, { label: "B", value: 20 }]
          }
      });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 shadow-2xl z-20">
      {/* Branding Header */}
      <div className="p-5 bg-slate-950 text-white border-b border-slate-800">
        <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-purple-500 p-2 rounded-lg shadow-lg shadow-blue-900/20">
                <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
                <h1 className="font-bold text-lg tracking-tight text-slate-100">SciPoster AI</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">ISEF Edition</p>
            </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900">
        <TabButton 
            active={activeTab === 'gen'} 
            onClick={() => setActiveTab('gen')} 
            icon={<Wand2 className="w-4 h-4" />} 
            label="Create" 
        />
        <TabButton 
            active={activeTab === 'edit'} 
            onClick={() => setActiveTab('edit')} 
            icon={<LayoutTemplate className="w-4 h-4" />} 
            label="Edit" 
        />
        <TabButton 
            active={activeTab === 'design'} 
            onClick={() => setActiveTab('design')} 
            icon={<Palette className="w-4 h-4" />} 
            label="Design" 
        />
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900">
        
        {/* --- GENERATE TAB --- */}
        {activeTab === 'gen' && (
            <div className="p-6 space-y-6">
                <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 p-5 rounded-xl border border-blue-800/50 shadow-sm">
                    <h3 className="text-blue-200 font-semibold mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-400" /> AI Assistant
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Enter your research topic, abstract, or raw notes. Gemini will structure it into a professional scientific poster.
                    </p>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Prompt / Topic</label>
                    <textarea
                        className="w-full h-48 p-4 border border-slate-700 rounded-xl bg-slate-800 text-slate-200 focus:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm shadow-inner placeholder-slate-500"
                        placeholder="e.g., The effects of microplastics on soil biodiversity. I found that..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-900/20 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 transition-all duration-200 border border-blue-500/50"
                >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-blue-200" />}
                    Generate Poster Content
                </button>
            </div>
        )}

        {/* --- EDIT TAB --- */}
        {activeTab === 'edit' && (
            <div className="p-4 space-y-3">
                <AccordionSection 
                    title="Header & Authors" 
                    isOpen={expandedSection === 'basic'} 
                    onClick={() => toggleSection('basic')}
                >
                    <Input label="Title" value={data.title} onChange={(v) => handleInputChange('title', v)} />
                    <Input label="Authors" value={data.authors} onChange={(v) => handleInputChange('authors', v)} />
                    <Input label="Affiliation" value={data.affiliation} onChange={(v) => handleInputChange('affiliation', v)} />
                </AccordionSection>

                <AccordionSection 
                    title="Visuals & Charts" 
                    isOpen={expandedSection === 'visuals'} 
                    onClick={() => toggleSection('visuals')}
                >
                   {!data.resultsChart ? (
                       <div className="text-center py-4">
                           <p className="text-sm text-slate-500 mb-4">No chart configured.</p>
                           <button onClick={initChart} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm font-medium text-blue-400 border border-slate-700">
                               + Add Bar Chart
                           </button>
                       </div>
                   ) : (
                       <div className="space-y-4">
                           <div className="flex justify-between items-center">
                               <h4 className="text-xs font-bold text-slate-500 uppercase">Chart Config</h4>
                               <button onClick={() => onDataChange({...data, resultsChart: null})} className="text-red-400 hover:text-red-300 p-1">
                                   <Trash2 className="w-3 h-3" />
                               </button>
                           </div>
                           <Input label="Chart Title" value={data.resultsChart.title} onChange={(v) => updateChartField('title', v)} />
                           <div className="grid grid-cols-2 gap-2">
                                <Input label="X Axis" value={data.resultsChart.xAxisLabel} onChange={(v) => updateChartField('xAxisLabel', v)} />
                                <Input label="Y Axis" value={data.resultsChart.yAxisLabel} onChange={(v) => updateChartField('yAxisLabel', v)} />
                           </div>
                           
                           <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                               <div className="flex justify-between mb-2">
                                   <label className="text-[10px] font-bold text-slate-600 uppercase">Data Points</label>
                                   <button onClick={addChartPoint} className="text-green-500 hover:text-green-400"><Plus className="w-3 h-3" /></button>
                               </div>
                               <div className="space-y-2">
                                   {data.resultsChart.data.map((point, idx) => (
                                       <div key={idx} className="flex gap-2 items-center">
                                           <input 
                                                className="flex-1 p-1 text-xs border border-slate-700 rounded bg-slate-800 text-slate-300" 
                                                value={point.label} 
                                                onChange={(e) => updateChartPoint(idx, 'label', e.target.value)}
                                                placeholder="Label"
                                           />
                                           <input 
                                                className="w-16 p-1 text-xs border border-slate-700 rounded bg-slate-800 text-slate-300" 
                                                type="number"
                                                value={point.value} 
                                                onChange={(e) => updateChartPoint(idx, 'value', Number(e.target.value))}
                                                placeholder="Val"
                                           />
                                           <button onClick={() => removeChartPoint(idx)} className="text-slate-600 hover:text-red-400">
                                               <Trash2 className="w-3 h-3" />
                                           </button>
                                       </div>
                                   ))}
                               </div>
                           </div>
                       </div>
                   )}
                </AccordionSection>

                <AccordionSection 
                    title="Sidebar/Intro" 
                    isOpen={expandedSection === 'sidebar'} 
                    onClick={() => toggleSection('sidebar')}
                >
                    <Input area label="Abstract" value={data.abstract} onChange={(v) => handleInputChange('abstract', v)} />
                    <Input label="Contact Name" value={data.contactName} onChange={(v) => handleInputChange('contactName', v)} />
                    <Input label="Contact Org" value={data.contactOrg} onChange={(v) => handleInputChange('contactOrg', v)} />
                    <Input label="Contact Email" value={data.contactEmail} onChange={(v) => handleInputChange('contactEmail', v)} />
                </AccordionSection>

                <AccordionSection 
                    title="Main Content 1" 
                    isOpen={expandedSection === 'col1'} 
                    onClick={() => toggleSection('col1')}
                >
                     <Input area label="Introduction" value={data.introduction} onChange={(v) => handleInputChange('introduction', v)} />
                     <Input area label="Methods" value={data.methods} onChange={(v) => handleInputChange('methods', v)} />
                </AccordionSection>

                <AccordionSection 
                    title="Results" 
                    isOpen={expandedSection === 'col2'} 
                    onClick={() => toggleSection('col2')}
                >
                     <Input area label="Results Text" value={data.results} onChange={(v) => handleInputChange('results', v)} />
                </AccordionSection>

                <AccordionSection 
                    title="Discussion & Conclusion" 
                    isOpen={expandedSection === 'col3'} 
                    onClick={() => toggleSection('col3')}
                >
                     <Input area label="Discussion" value={data.discussion} onChange={(v) => handleInputChange('discussion', v)} />
                     <Input area label="Conclusions" value={data.conclusions} onChange={(v) => handleInputChange('conclusions', v)} />
                     <Input area label="References" value={data.references} onChange={(v) => handleInputChange('references', v)} />
                </AccordionSection>
            </div>
        )}

        {/* --- DESIGN TAB --- */}
        {activeTab === 'design' && (
            <div className="p-6 space-y-8">
                
                {/* Layout Selector */}
                 <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Layout Template</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <LayoutButton layoutId="classic" current={layout} onClick={onLayoutChange} icon={Sidebar} label="Classic" />
                        <LayoutButton layoutId="standard" current={layout} onClick={onLayoutChange} icon={Columns} label="Standard" />
                        <LayoutButton layoutId="visual" current={layout} onClick={onLayoutChange} icon={RectangleHorizontal} label="Visual" />
                        <LayoutButton layoutId="cycle" current={layout} onClick={onLayoutChange} icon={CircleDashed} label="Cycle" />
                        <LayoutButton layoutId="geometric" current={layout} onClick={onLayoutChange} icon={LayoutGrid} label="Geometric" />
                        <LayoutButton layoutId="research" current={layout} onClick={onLayoutChange} icon={Table2} label="Research" />
                    </div>
                </div>

                {/* Theme Selector */}
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Color Themes</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {THEMES.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => onThemeChange(t)}
                                className={`relative group flex items-center p-3 rounded-xl border-2 transition-all ${theme.id === t.id ? 'border-blue-500 bg-slate-800' : 'border-transparent hover:border-slate-700 hover:bg-slate-800'}`}
                            >
                                <div className="flex-shrink-0 w-10 h-10 rounded-full shadow-sm border border-slate-600 flex overflow-hidden mr-4">
                                    <div className="w-1/2 h-full" style={{ backgroundColor: t.colors.primary }}></div>
                                    <div className="w-1/2 h-full" style={{ backgroundColor: t.colors.secondary }}></div>
                                </div>
                                <div className="text-left flex-1">
                                    <div className={`font-medium text-sm ${theme.id === t.id ? 'text-blue-100' : 'text-slate-300'}`}>{t.name}</div>
                                    <div className="text-xs text-slate-500 flex gap-2 mt-1">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.colors.accent }}></span>
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.colors.sidebarBackground }}></span>
                                    </div>
                                </div>
                                {theme.id === t.id && (
                                    <div className="absolute right-4 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/30 text-xs text-blue-300">
                    <div className="flex gap-2 items-start">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <p>Layouts change how your content flows. Themes change fonts, colors, and header decorations.</p>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Export Actions */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 grid grid-cols-2 gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.2)]">
        <button 
            onClick={() => exportToPDF('poster-preview')}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
            <Download className="w-4 h-4 text-red-400" /> PDF
        </button>
        <button 
             onClick={() => exportToPPTX(data, theme, layout)}
             className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#D24726] hover:bg-[#b03a1e] text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
            <Presentation className="w-4 h-4" /> PPTX
        </button>
      </div>
    </div>
  );
};

const LayoutButton: React.FC<{ layoutId: PosterLayout; current: PosterLayout; onClick: (l: PosterLayout) => void; icon: React.ElementType; label: string }> = ({ layoutId, current, onClick, icon: Icon, label }) => (
    <button 
        onClick={() => onClick(layoutId)}
        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${current === layoutId ? 'border-blue-500 bg-slate-800' : 'border-slate-700 hover:bg-slate-800'}`}
    >
        <Icon className={`w-6 h-6 ${current === layoutId ? 'text-blue-400' : 'text-slate-500'}`} />
        <span className="text-[10px] font-medium text-slate-400">{label}</span>
    </button>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex-1 py-4 text-xs font-bold uppercase tracking-wide transition-all flex flex-col items-center gap-1.5 ${active ? 'bg-slate-900 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
    >
        <span className={`${active ? 'text-blue-400' : 'text-slate-500'}`}>{icon}</span>
        {label}
    </button>
);

const AccordionSection: React.FC<{ title: string; isOpen: boolean; onClick: () => void; children: React.ReactNode }> = ({ title, isOpen, onClick, children }) => (
    <div className={`border transition-all duration-200 rounded-lg bg-slate-800 overflow-hidden ${isOpen ? 'border-blue-500/50 ring-1 ring-blue-500/20 shadow-sm' : 'border-slate-700'}`}>
        <button className="w-full px-4 py-3 flex items-center justify-between bg-slate-800 hover:bg-slate-700 text-left transition-colors" onClick={onClick}>
            <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200 text-sm">{title}</span>
                {title.includes('Visuals') && <BarChart3 className="w-3 h-3 text-slate-400" />}
            </div>
            {isOpen ? <ChevronDown className="w-4 h-4 text-blue-400" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
        </button>
        {isOpen && <div className="p-4 space-y-4 border-t border-slate-700 bg-slate-800">{children}</div>}
    </div>
);

const Input: React.FC<{ label: string; value: string; onChange: (v: string) => void; area?: boolean }> = ({ label, value, onChange, area }) => (
    <div>
        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">{label}</label>
        {area ? (
            <textarea 
                className="w-full p-3 border border-slate-700 rounded-lg text-sm text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none min-h-[120px] bg-slate-900 transition-all placeholder-slate-600"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        ) : (
            <input 
                className="w-full p-2.5 border border-slate-700 rounded-lg text-sm text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none bg-slate-900 transition-all placeholder-slate-600"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        )}
    </div>
);