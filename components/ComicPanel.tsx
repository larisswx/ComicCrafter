import React from 'react';
import type { Panel } from '../types';
import Loader from './Loader';

interface ComicPanelProps {
  panel: Panel;
  onRemove: (id: number) => void;
}

// A simple but effective speech bubble using a pseudo-element
const DialogueBubble: React.FC<{ text: string }> = ({ text }) => (
    <div className="relative bg-white text-black font-semibold p-3 rounded-xl shadow-md" style={{ fontFamily: "'Inter', sans-serif" }}>
        {text}
        <div className="absolute left-4 -bottom-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white"></div>
    </div>
);

const NarrationBox: React.FC<{ text:string }> = ({ text }) => (
    <div className="bg-slate-800/80 text-white p-2 text-center italic border-2 border-slate-600 rounded-md shadow-lg" style={{ fontFamily: "'Inter', sans-serif"}}>
        {text}
    </div>
);

const SfxText: React.FC<{ text: string }> = ({ text }) => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h2 className="text-6xl md:text-8xl font-black text-amber-400 transform -rotate-12"
            style={{
                fontFamily: "'Bangers', cursive",
                WebkitTextStroke: '4px #c2410c',
                paintOrder: 'stroke fill'
            }}
        >
            {text.toUpperCase()}
        </h2>
    </div>
);

const ComicPanel: React.FC<ComicPanelProps> = ({ panel, onRemove }) => {
  const dialogueItems = panel.textItems.filter(item => item.type === 'dialogue');
  const narrationItems = panel.textItems.filter(item => item.type === 'narration');
  const sfxItems = panel.textItems.filter(item => item.type === 'sfx');

  return (
    <div className="relative w-full h-full bg-slate-800 rounded-md overflow-hidden shadow-2xl group"
      style={{ boxShadow: 'inset 0 0 0 4px white' }}
    >
      {panel.isLoading ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800/50">
            <Loader />
            <p className="mt-4 text-slate-400 text-center text-sm px-2">Generating panel... <br/> This can take a moment.</p>
        </div>
      ) : (
        <>
          <img src={panel.imageUrl} alt={panel.scene} className="w-full h-full object-cover" />
          
          {sfxItems.length > 0 && sfxItems.map(item => <SfxText text={item.text} key={item.id} />)}

          {dialogueItems.length > 0 && (
            <div className="absolute bottom-4 left-4 right-4 flex flex-col-reverse items-start gap-2 pointer-events-none">
              {dialogueItems.map(item => <div className="max-w-[80%] pointer-events-auto"><DialogueBubble text={item.text} key={item.id} /></div>)}
            </div>
          )}

          {narrationItems.length > 0 && (
            <div className="absolute top-2 left-2 right-2 flex flex-col items-center gap-2 pointer-events-none">
              {narrationItems.map(item => <div className="pointer-events-auto"><NarrationBox text={item.text} key={item.id} /></div>)}
            </div>
          )}
          
          <button 
            onClick={() => onRemove(panel.id)}
            className="absolute top-2 right-2 bg-red-600/80 text-white rounded-full h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110 z-10"
            aria-label="Remove panel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </>
      )}
    </div>
  );
};

export default ComicPanel;