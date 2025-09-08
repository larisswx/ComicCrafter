import React from 'react';
import { useState } from 'react';
import type { PanelData, TextItem } from '../types';

interface PanelCreatorProps {
  onAddPanel: (panelData: PanelData) => void;
  isCharacterCreated: boolean;
}

const PanelCreator: React.FC<PanelCreatorProps> = ({ onAddPanel, isCharacterCreated }) => {
  const [scene, setScene] = useState<string>("Close-up on the detective's face, looking out a rainy window, deep in thought.");
  const [textItems, setTextItems] = useState<TextItem[]>([
    { id: Date.now(), type: 'dialogue', text: "Another night... another unsolved case." }
  ]);
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scene.trim()) {
      // Filter out empty text items before submitting
      const validTextItems = textItems.filter(item => item.text.trim() !== '');
      onAddPanel({ scene, textItems: validTextItems });
      // Reset for next panel
      setTextItems([]);
    }
  };

  const addItem = (type: TextItem['type']) => {
    setTextItems([...textItems, { id: Date.now(), type, text: '' }]);
  };

  const updateItemText = (id: number, text: string) => {
    setTextItems(textItems.map(item => item.id === id ? { ...item, text } : item));
  };
  
  const removeItem = (id: number) => {
    setTextItems(textItems.filter(item => item.id !== id));
  };

  const typeStyles = {
    dialogue: { label: 'Dialogue', color: 'border-sky-500' },
    narration: { label: 'Narration', color: 'border-amber-500' },
    sfx: { label: 'SFX', color: 'border-red-500' },
  }

  return (
    <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-teal-400">2. Panel Scripter</h2>
        <button onClick={() => setShowHelp(!showHelp)} className="text-slate-400 hover:text-white transition">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
      </div>

      {showHelp && (
        <div className="bg-slate-700/50 p-3 rounded-lg text-sm text-slate-300 mb-4 border border-slate-600">
          Describe the scene, then add any text elements you need. The AI will draw the character from your Character Sheet consistently.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="scene-description" className="block text-sm font-medium text-slate-300 mb-2">
            Scene Description
          </label>
          <textarea
            id="scene-description"
            rows={4}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            placeholder="What's happening in this panel?"
            value={scene}
            onChange={(e) => setScene(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">Text Items</label>
            {textItems.map((item) => (
              <div key={item.id} className={`flex items-center space-x-2 border-l-4 p-2 bg-slate-700/40 rounded-r-md ${typeStyles[item.type].color}`}>
                <input
                  type="text"
                  className="flex-grow bg-slate-700/50 border border-slate-600 rounded-lg p-2 text-slate-200 placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder={`${typeStyles[item.type].label}...`}
                  value={item.text}
                  onChange={(e) => updateItemText(item.id, e.target.value)}
                />
                 <button type="button" onClick={() => removeItem(item.id)} className="p-1 text-slate-400 hover:text-red-500 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
              </div>
            ))}
            <div className="flex gap-2 justify-center pt-2">
                <button type="button" onClick={() => addItem('dialogue')} className="text-xs bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 font-semibold py-1 px-3 rounded-full transition">+ Dialogue</button>
                <button type="button" onClick={() => addItem('narration')} className="text-xs bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 font-semibold py-1 px-3 rounded-full transition">+ Narration</button>
                <button type="button" onClick={() => addItem('sfx')} className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-300 font-semibold py-1 px-3 rounded-full transition">+ SFX</button>
            </div>
        </div>

        <button
          type="submit"
          disabled={!isCharacterCreated}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
        >
          Add Panel
        </button>
      </form>
    </div>
  );
};

export default PanelCreator;