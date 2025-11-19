
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PptxGenJS from 'pptxgenjs';
import { PosterData, PosterTheme, PosterLayout } from '../types';

export const exportToPDF = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: [48, 36]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 48, 36);
    pdf.save('science-poster.pdf');
  } catch (error) {
    console.error("PDF Export failed", error);
    alert("Failed to export PDF");
  }
};

export const exportToPPTX = (data: PosterData, theme: PosterTheme, layout: PosterLayout) => {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'POSTER', width: 48, height: 36 });
  pptx.layout = 'POSTER';

  const slide = pptx.addSlide();

  // Common Colors
  const primaryColor = theme.colors.primary.replace('#', '');
  const secondaryColor = theme.colors.secondary.replace('#', '');
  const sidebarColor = theme.colors.sidebarBackground.replace('#', '');
  const textColor = theme.colors.text.replace('#', '');
  const titleColor = theme.colors.sidebarText.replace('#', '');
  const accentColor = theme.colors.accent.replace('#', '');
  const fontFace = theme.fontFamily.heading.includes('Times') ? 'Times New Roman' : 'Arial';

  // Header (Universal)
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 48, h: 5, fill: { color: primaryColor } });
  slide.addText(data.title, { x: 2, y: 0.5, w: 44, h: 2, fontSize: 72, color: titleColor, bold: true, align: 'center', fontFace });
  slide.addText(data.authors, { x: 2, y: 2.5, w: 44, h: 1, fontSize: 36, color: titleColor, align: 'center', fontFace });
  slide.addText(data.affiliation, { x: 2, y: 3.5, w: 44, h: 1, fontSize: 28, color: titleColor, align: 'center', fontFace });

  // Helper
  const addSection = (title: string, text: string, x: number, y: number, w: number, h: number) => {
    slide.addText(title, { x, y, w, h: 1, fontSize: 28, bold: true, align: 'center', fontFace, fill: { color: secondaryColor }, color: primaryColor });
    slide.addText(text, { x, y: y + 1, w, h: h - 1, fontSize: 18, align: 'left', valign: 'top', fontFace, fill: { color: "FFFFFF" }, color: textColor });
  };

  const addChart = (x: number, y: number, w: number, h: number) => {
      if (data.resultsChart && data.resultsChart.data.length > 0) {
        const chartData = [{
            name: data.resultsChart.title,
            labels: data.resultsChart.data.map(d => d.label),
            values: data.resultsChart.data.map(d => d.value)
        }];
        slide.addChart(pptx.ChartType.bar, chartData, {
            x, y, w, h,
            barDir: 'col',
            barGapWidthPct: 25,
            chartColors: [accentColor],
            showValue: true,
            title: data.resultsChart.title,
            titleFontSize: 18,
            titleColor: primaryColor,
            valAxisLabel: data.resultsChart.yAxisLabel,
            catAxisLabel: data.resultsChart.xAxisLabel
        });
      } else {
        slide.addShape(pptx.ShapeType.rect, { x, y, w, h, fill: { color: "F3F4F6" }, line: { color: "CCCCCC", width: 1 } });
        slide.addText("Chart Placeholder", { x, y: y + h/2, w, h: 1, align: 'center' });
      }
  };

  // --- Layout Logic ---

  if (layout === 'classic') {
      // Sidebar
      slide.addShape(pptx.ShapeType.rect, { x: 0, y: 5, w: 10, h: 31, fill: { color: sidebarColor } });
      slide.addText("ABSTRACT", { x: 0.5, y: 6, w: 9, h: 1, fontSize: 24, color: titleColor, bold: true, align: 'center' });
      slide.addText(data.abstract, { x: 0.5, y: 7.2, w: 9, h: 10, fontSize: 16, color: titleColor, valign: 'top' });
      slide.addText("CONTACT", { x: 0.5, y: 25, w: 9, h: 1, fontSize: 24, color: titleColor, bold: true, align: 'center' });
      slide.addText(`${data.contactName}\n${data.contactOrg}\n${data.contactEmail}`, { x: 0.5, y: 26.2, w: 9, h: 5, fontSize: 16, color: titleColor, valign: 'top' });

      // 3 Cols
      const colW = 12;
      const startX = 10.5;
      const gap = 0.5;
      
      addSection("INTRODUCTION", data.introduction, startX, 6, colW, 10);
      addSection("METHODS", data.methods, startX, 17, colW, 10);
      addSection("RESULTS", data.results, startX + colW + gap, 6, colW, 15);
      addChart(startX + colW + gap, 22, colW, 8);
      addSection("DISCUSSION", data.discussion, startX + (colW + gap) * 2, 6, colW, 8);
      addSection("CONCLUSIONS", data.conclusions, startX + (colW + gap) * 2, 15, colW, 6);
      addSection("REFERENCES", data.references, startX + (colW + gap) * 2, 22, colW, 8);

  } else if (layout === 'standard') {
      // 3 Equal Cols (Abstract in Col 1)
      const colW = 15; // Wider cols
      const gap = 1;
      const startX = 1;

      // Col 1
      addSection("ABSTRACT", data.abstract, startX, 6, colW, 8);
      addSection("INTRODUCTION", data.introduction, startX, 15, colW, 10);
      addSection("METHODS", data.methods, startX, 26, colW, 9);

      // Col 2
      addSection("RESULTS", data.results, startX + colW + gap, 6, colW, 12);
      addChart(startX + colW + gap, 19, colW, 10);
      addSection("DISCUSSION", data.discussion, startX + colW + gap, 30, colW, 5);

      // Col 3
      addSection("CONCLUSIONS", data.conclusions, startX + (colW + gap) * 2, 6, colW, 8);
      addSection("REFERENCES", data.references, startX + (colW + gap) * 2, 15, colW, 10);
      // Contact Box
      slide.addShape(pptx.ShapeType.rect, { x: startX + (colW + gap) * 2, y: 26, w: colW, h: 5, fill: { color: secondaryColor } });
      slide.addText("CONTACT", { x: startX + (colW + gap) * 2, y: 26.5, w: colW, h: 1, align: 'center', bold: true, color: primaryColor });
      slide.addText(`${data.contactName}\n${data.contactEmail}`, { x: startX + (colW + gap) * 2, y: 28, w: colW, h: 2, align: 'center' });

  } else if (layout === 'visual') {
      // Col 1 (Narrow), Center (Wide), Col 3 (Narrow)
      const sideW = 11;
      const centerW = 22;
      const gap = 1;
      const startX = 1;

      // Left
      addSection("ABSTRACT", data.abstract, startX, 6, sideW, 8);
      addSection("INTRODUCTION", data.introduction, startX, 15, sideW, 10);
      addSection("METHODS", data.methods, startX, 26, sideW, 9);

      // Center (Visuals Heavy)
      addChart(startX + sideW + gap, 6, centerW, 12);
      addSection("RESULTS & ANALYSIS", data.results, startX + sideW + gap, 19, centerW, 16);

      // Right
      addSection("DISCUSSION", data.discussion, startX + sideW + gap + centerW + gap, 6, sideW, 10);
      addSection("CONCLUSIONS", data.conclusions, startX + sideW + gap + centerW + gap, 17, sideW, 8);
      addSection("REFERENCES", data.references, startX + sideW + gap + centerW + gap, 26, sideW, 9);
  }

  pptx.writeFile({ fileName: `SciencePoster_${layout}.pptx` });
};
