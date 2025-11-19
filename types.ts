
export interface PosterSection {
  title: string;
  content: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartConfig {
  title: string;
  data: ChartDataPoint[];
  xAxisLabel: string;
  yAxisLabel: string;
}

export interface PosterData {
  title: string;
  authors: string;
  affiliation: string;
  abstract: string;
  introduction: string;
  methods: string;
  results: string;
  discussion: string;
  conclusions: string;
  references: string;
  contactName: string;
  contactOrg: string;
  contactEmail: string;
  resultsChart: ChartConfig | null;
}

export interface PosterColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  sidebarBackground: string;
  sidebarText: string;
}

export interface PosterTheme {
  id: string;
  name: string;
  colors: PosterColors;
  fontFamily: {
    heading: string;
    body: string;
  };
}

export type PosterLayout = 'classic' | 'standard' | 'visual' | 'cycle' | 'geometric' | 'research';

export const INITIAL_POSTER_DATA: PosterData = {
  title: "PROJECT TITLE GOES HERE",
  authors: "John Doe¹, Jane Smith²",
  affiliation: "¹High School Name, ²University Mentor",
  abstract: "This is a placeholder for the abstract. Use the 'Generate with AI' button to fill this poster based on your topic or notes.",
  introduction: "Introduction text goes here. Explain the background and significance of your research.",
  methods: "Describe your experimental setup, materials used, and procedures followed.",
  results: "Present your key findings here. You can include descriptions of charts and tables.",
  discussion: "Interpret your results. Discuss implications, limitations, and future directions.",
  conclusions: "Summarize the main takeaways of your research.",
  references: "1. Author A. et al. (Year). Title. Journal.\n2. Author B. et al. (Year). Title. Journal.",
  contactName: "Your Name",
  contactOrg: "Your School/Org",
  contactEmail: "email@example.com",
  resultsChart: {
    title: "Comparative Analysis Results",
    xAxisLabel: "Test Groups",
    yAxisLabel: "Efficiency (%)",
    data: [
      { label: "Control", value: 15 },
      { label: "Variable A", value: 45 },
      { label: "Variable B", value: 32 },
      { label: "Variable C", value: 88 }
    ]
  }
};