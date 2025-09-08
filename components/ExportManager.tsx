import React from 'react';
import type { Project } from '../types';
import Loader from './Loader';

interface ExportManagerProps {
  project: Project;
  currentPageIndex: number;
  onExportPng: () => void;
  onExportPdf: () => void;
  onExportCbz: () => void;
  isExporting: boolean;
  exportProgress: string;
}

const ExportManager: React.FC<ExportManagerProps> = ({
  project,
  currentPageIndex,
  onExportPng,
  onExportPdf,
  onExportCbz,
  isExporting,
  exportProgress,
}) => {
  const hasContent = project.pages.some(p => p.panels.length > 0);

  return (
    <div className="p-6 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl">
      <h2 className="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4">Export</h2>
      
      {isExporting && (
        <div className="flex items-center justify-center gap-2 p-3 bg-slate-200 dark:bg-slate-700/50 rounded-lg mb-4">
          <Loader />
          <span className="font-semibold text-slate-600 dark:text-slate-300">{exportProgress}</span>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={onExportPng}
          disabled={isExporting || project.pages[currentPageIndex]?.panels.length === 0}
          className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg disabled:bg-slate-200/50 dark:disabled:bg-slate-700/50 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-slate-500/50"
        >
          Download Page {currentPageIndex + 1} (.png)
        </button>
        
        <div className="w-full h-px bg-slate-300 dark:bg-slate-600 my-2"></div>

        <button
          onClick={onExportPdf}
          disabled={isExporting || !hasContent}
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg disabled:from-slate-500 disabled:to-slate-600 dark:disabled:from-slate-600 dark:disabled:to-slate-700 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-teal-400/50"
        >
          Export Project (.pdf)
        </button>

        <button
          onClick={onExportCbz}
          disabled={isExporting || !hasContent}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg disabled:from-slate-500 disabled:to-slate-600 dark:disabled:from-slate-600 dark:disabled:to-slate-700 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
        >
          Export Project (.cbz)
        </button>
      </div>
    </div>
  );
};

export default ExportManager;