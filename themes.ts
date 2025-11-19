import { PosterTheme } from "./types";

export const THEMES: PosterTheme[] = [
  {
    id: 'eco',
    name: 'Scientific Eco',
    colors: {
      primary: '#4a5d23',
      secondary: '#e5e7eb',
      accent: '#fef08a',
      text: '#1f2937',
      background: '#ffffff',
      sidebarBackground: '#4a5d23',
      sidebarText: '#ffffff',
    },
    fontFamily: {
      heading: 'Arial, sans-serif',
      body: 'Arial, sans-serif',
    }
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    colors: {
      primary: '#0f4c81',
      secondary: '#dbeafe',
      accent: '#38bdf8',
      text: '#0f172a',
      background: '#f0f9ff',
      sidebarBackground: '#0c3b63',
      sidebarText: '#ffffff',
    },
    fontFamily: {
      heading: 'Verdana, sans-serif',
      body: 'Verdana, sans-serif',
    }
  },
  {
    id: 'crimson',
    name: 'Ivy League',
    colors: {
      primary: '#8a1c1c',
      secondary: '#f3e8e8',
      accent: '#d4a373',
      text: '#2d1b1b',
      background: '#faf5f5',
      sidebarBackground: '#6b1616',
      sidebarText: '#ffffff',
    },
    fontFamily: {
      heading: 'Times New Roman, serif',
      body: 'Times New Roman, serif',
    }
  },
  {
    id: 'slate',
    name: 'Modern Tech',
    colors: {
      primary: '#334155',
      secondary: '#e2e8f0',
      accent: '#0ea5e9',
      text: '#0f172a',
      background: '#f8fafc',
      sidebarBackground: '#1e293b',
      sidebarText: '#ffffff',
    },
    fontFamily: {
      heading: 'system-ui, sans-serif',
      body: 'system-ui, sans-serif',
    }
  },
  {
    id: 'minimal',
    name: 'Clean Minimal',
    colors: {
      primary: '#000000',
      secondary: '#f5f5f5',
      accent: '#737373',
      text: '#171717',
      background: '#ffffff',
      sidebarBackground: '#262626',
      sidebarText: '#ffffff',
    },
    fontFamily: {
      heading: 'Helvetica, sans-serif',
      body: 'Helvetica, sans-serif',
    }
  }
];

export const DEFAULT_THEME = THEMES[0];