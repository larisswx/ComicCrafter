
import React, { useState, useCallback, useEffect } from 'react';
import type { Character, Panel, PanelData, Page, Project } from './types';
import { generateCharacterSheet, generatePanelImage } from './services/geminiService';
import Header from './components/Header';
import CharacterArchitect from './components/CharacterArchitect';
import PanelCreator from './components/PanelCreator';
import ComicPage from './components/ComicPage';
import ProjectManager from './components/ProjectManager';
import { toPng } from 'html-to-image';
import ExportManager from './components/ExportManager';
import { exportProjectToPdf, exportProjectToCbz } from './services/exportService';

type Theme = 'light' | 'dark';

const PageControls: React.FC<{
  currentPageIndex: number;
  totalPages: number;
  onAddPage: () => void;
  onRemovePage: () => void;
  onPageChange: (newIndex: number) => void;
}> = ({ currentPageIndex, totalPages, onAddPage, onRemovePage, onPageChange }) => (
  <div className="flex items-center justify-center gap-2 mb-6 p-2 bg-slate-100 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-300 dark:border-slate-700">
    <button onClick={() => onPageChange(currentPageIndex - 1)} disabled={currentPageIndex === 0} className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
      &larr;
    </button>
    <span className="font-bold text-slate-600 dark:text-slate-300">Page {currentPageIndex + 1} / {totalPages}</span>
    <button onClick={() => onPageChange(currentPageIndex + 1)} disabled={currentPageIndex >= totalPages - 1} className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
      &rarr;
    </button>
    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2"></div>
    <button onClick={onAddPage} className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors font-semibold text-sm text-white">
      Add Page
    </button>
    <button onClick={onRemovePage} disabled={totalPages <= 1} className="px-4 py-2 bg-red-800/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-800/80 transition-colors text-sm text-red-300">
      Delete Page
    </button>
  </div>
);

export default function App(): React.JSX.Element {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isCharacterLoading, setIsCharacterLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            return 'dark';
        }
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  // Load projects from localStorage on initial render
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem('comicCrafterProjects');
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
      const savedCurrentProjectId = localStorage.getItem('comicCrafterCurrentProjectId');
      if (savedCurrentProjectId) {
        setCurrentProjectId(JSON.parse(savedCurrentProjectId));
      }
    } catch (err) {
      console.error("Failed to load projects from local storage", err);
      setError("Could not load saved projects.");
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('comicCrafterProjects', JSON.stringify(projects));
      if (currentProjectId) {
         localStorage.setItem('comicCrafterCurrentProjectId', JSON.stringify(currentProjectId));
      } else {
         localStorage.removeItem('comicCrafterCurrentProjectId');
      }
    } catch (err) {
      console.error("Failed to save projects to local storage", err);
      setError("There was an issue saving your work.");
    }
  }, [projects, currentProjectId]);

  const currentProject = projects.find(p => p.id === currentProjectId);
  const currentPage = currentProject?.pages[currentPageIndex];

  const handleCreateProject = (name: string) => {
    const newProject: Project = { id: Date.now(), name, character: null, pages: [{ id: Date.now(), panels: [] }] };
    setProjects(prev => [...prev, newProject]);
    setCurrentProjectId(newProject.id);
    setCurrentPageIndex(0);
  };

  const handleSwitchProject = (id: number) => {
    setCurrentProjectId(id);
    setCurrentPageIndex(0);
  };

  const handleDeleteProject = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (currentProjectId === id) {
      setCurrentProjectId(null);
    }
  };

  const handleCharacterCreation = async (prompt: string, style: string) => {
    if (!currentProject) return;
    setIsCharacterLoading(true);
    setError(null);

    // Clear previous character data within the project
    setProjects(prev => prev.map(p => p.id === currentProjectId ? { ...p, character: null, pages: [{id: Date.now(), panels:[]}] } : p));
    setCurrentPageIndex(0);

    try {
      const fullPrompt = `${prompt}, in the style of ${style}. Character sheet, full body view, multiple angles, neutral background.`;
      const { base64, mimeType } = await generateCharacterSheet(fullPrompt);
      const newCharacter: Character = { prompt, style, imageBase64: base64, mimeType };
      setProjects(prev => prev.map(p => p.id === currentProjectId ? { ...p, character: newCharacter } : p));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during character generation.');
    } finally {
      setIsCharacterLoading(false);
    }
  };

  const handleAddPanel = async (panelData: PanelData) => {
    if (!currentProject?.character) {
      setError('Please create a character for this project first.');
      return;
    }
    setError(null);
    const newPanelId = Date.now();
    const newPanel: Panel = { ...panelData, id: newPanelId, imageUrl: '', isLoading: true };

    setProjects(prev => prev.map(p => {
        if (p.id !== currentProjectId) return p;
        const updatedPages = p.pages.map((page, index) => 
            index === currentPageIndex ? { ...page, panels: [...page.panels, newPanel] } : page
        );
        return { ...p, pages: updatedPages };
    }));

    try {
      const { base64 } = await generatePanelImage(currentProject.character, panelData.scene);
      setProjects(prev => prev.map(p => {
          if (p.id !== currentProjectId) return p;
          const updatedPages = p.pages.map((page, index) => {
              if (index !== currentPageIndex) return page;
              const updatedPanels = page.panels.map(panel =>
                  panel.id === newPanelId ? { ...panel, imageUrl: `data:image/png;base64,${base64}`, isLoading: false } : panel
              );
              return { ...page, panels: updatedPanels };
          });
          return { ...p, pages: updatedPages };
      }));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during panel generation.');
      setProjects(prev => prev.map(p => {
        if (p.id !== currentProjectId) return p;
        const updatedPages = p.pages.map((page, index) => {
            if (index !== currentPageIndex) return page;
            return { ...page, panels: page.panels.filter(panel => panel.id !== newPanelId) };
        });
        return { ...p, pages: updatedPages };
      }));
    }
  };
  
  const handleRemovePanel = (id: number) => {
    setProjects(prev => prev.map(p => {
        if (p.id !== currentProjectId) return p;
        const updatedPages = p.pages.map((page, index) => {
            if (index !== currentPageIndex) return page;
            return { ...page, panels: page.panels.filter(p => p.id !== id) };
        });
        return { ...p, pages: updatedPages };
    }));
  };

  const handleAddPage = () => {
    const newPage: Page = { id: Date.now(), panels: [] };
    setProjects(prev => prev.map(p => 
        p.id === currentProjectId ? { ...p, pages: [...p.pages, newPage] } : p
    ));
    setCurrentPageIndex(currentProject ? currentProject.pages.length : 0);
  };
  
  const handleRemoveCurrentPage = () => {
    if (!currentProject || currentProject.pages.length <= 1) return;
    const newPages = currentProject.pages.filter((_, index) => index !== currentPageIndex);
    setProjects(prev => prev.map(p => p.id === currentProjectId ? { ...p, pages: newPages } : p));
    setCurrentPageIndex(prevIndex => Math.max(0, Math.min(prevIndex, newPages.length - 1)));
  };
  
  const handlePageChange = (newIndex: number) => {
    if (currentProject && newIndex >= 0 && newIndex < currentProject.pages.length) {
      setCurrentPageIndex(newIndex);
    }
  };
  
  const handleExportPng = useCallback(() => {
    const node = document.getElementById('comic-page-export');
    if (!node) {
      setError("Could not find comic page element to export.");
      return;
    }

    toPng(node, { 
        cacheBust: true, 
        backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
        pixelRatio: 1.5 
      })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${currentProject?.name.replace(/ /g, '_')}_page_${currentPageIndex + 1}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
        setError("Failed to export the comic page.");
      });
  }, [currentPageIndex, currentProject, theme]);

  const handleExportPdf = async () => {
    if (!currentProject) return;
    setIsExporting(true);
    setError(null);
    try {
      await exportProjectToPdf(currentProject, setExportProgress, theme);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during PDF export.');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  const handleExportCbz = async () => {
    if (!currentProject) return;
    setIsExporting(true);
    setError(null);
    try {
      await exportProjectToCbz(currentProject, setExportProgress, theme);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during CBZ export.');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header onToggleTheme={handleThemeToggle} theme={theme} />
      <main className="container mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
            <ProjectManager 
              projects={projects}
              currentProjectId={currentProjectId}
              onCreateProject={handleCreateProject}
              onSwitchProject={handleSwitchProject}
              onDeleteProject={handleDeleteProject}
            />
            {currentProject && (
              <>
                <CharacterArchitect 
                  onCharacterCreate={handleCharacterCreation} 
                  character={currentProject.character}
                  isLoading={isCharacterLoading}
                />
                <PanelCreator 
                  onAddPanel={handleAddPanel} 
                  isCharacterCreated={!!currentProject.character} 
                />
                <ExportManager
                    project={currentProject}
                    currentPageIndex={currentPageIndex}
                    onExportPng={handleExportPng}
                    onExportPdf={handleExportPdf}
                    onExportCbz={handleExportCbz}
                    isExporting={isExporting}
                    exportProgress={exportProgress}
                />
              </>
            )}
          </aside>

          <div className="lg:col-span-8 xl:col-span-9">
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-200 px-4 py-3 rounded-xl relative mb-6" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {currentProject && currentPage ? (
              <>
                <PageControls 
                  currentPageIndex={currentPageIndex}
                  totalPages={currentProject.pages.length}
                  onAddPage={handleAddPage}
                  onRemovePage={handleRemoveCurrentPage}
                  onPageChange={handlePageChange}
                />
                <ComicPage panels={currentPage.panels} onRemovePanel={handleRemovePanel}/>
              </>
            ) : (
                <div className="h-full min-h-[600px] flex items-center justify-center text-center bg-slate-100/50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                    <div>
                        <h2 className="text-2xl font-bold text-teal-600 dark:text-teal-400">Welcome to ComicCrafter</h2>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">Please create a new project or select an existing one to begin.</p>
                    </div>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}