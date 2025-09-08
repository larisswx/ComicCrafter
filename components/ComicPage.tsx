import React from 'react';
import type { Panel } from '../types';
import ComicPanel from './ComicPanel';

interface ComicPageProps {
  panels: Panel[];
  onRemovePanel: (id: number) => void;
}

const ComicPage: React.FC<ComicPageProps> = ({ panels, onRemovePanel }) => {
  return (
    <div 
      id="comic-page-export" 
      className="p-4 bg-slate-900 min-h-[600px] rounded-lg shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]"
      style={{ boxShadow: 'inset 0 0 0 4px #334155' }} // slate-700
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
        {panels.length === 0 && (
          <div className="col-span-1 md:col-span-2 h-full min-h-[500px] flex items-center justify-center text-center text-slate-500 border-2 border-dashed border-slate-700 rounded-md">
            <div>
              <h3 className="text-xl font-semibold text-slate-400">Your Comic Page Awaits</h3>
              <p>Create a character and add panels to begin your story.</p>
            </div>
          </div>
        )}
        {panels.map((panel, index) => (
          <div key={panel.id} className={`${panels.length === 1 || (panels.length > 2 && index === panels.length - 1 && panels.length % 2 !== 0) ? 'md:col-span-2' : 'md:col-span-1'} aspect-[4/3]`}>
            <ComicPanel panel={panel} onRemove={onRemovePanel} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComicPage;