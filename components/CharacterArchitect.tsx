import React from 'react';
import { useState } from 'react';
import type { Character } from '../types';
import Loader from './Loader';

interface CharacterArchitectProps {
  onCharacterCreate: (prompt: string, style: string) => void;
  character: Character | null;
  isLoading: boolean;
}

const artStyles = [
  "Classic comic book noir",
  "Modern manga",
  "American superhero comic",
  "Indie comic art",
  "European bande dessinée",
  "Saturday morning cartoon",
  "Gritty graphic novel",
];

const CharacterArchitect: React.FC<CharacterArchitectProps> = ({ onCharacterCreate, character, isLoading }) => {
  const [prompt, setPrompt] = useState<string>("A young detective with disheveled black hair and piercing blue eyes, wearing a brown trench coat.");
  const [style, setStyle] = useState<string>(artStyles[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && style.trim()) {
      onCharacterCreate(prompt, style);
    }
  };

  return (
    <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-2xl">
      <h2 className="text-xl font-bold text-teal-400 mb-4">1. Character Architect</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="char-description" className="block text-sm font-medium text-slate-300 mb-2">
            Character Description
          </label>
          <textarea
            id="char-description"
            rows={4}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
            placeholder="e.g., A grizzled space marine with a cybernetic arm..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="art-style" className="block text-sm font-medium text-slate-300 mb-2">
            Art Style
          </label>
          <select
            id="art-style"
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            {artStyles.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-teal-400/50"
        >
          {isLoading ? <Loader /> : 'Generate Character Sheet'}
        </button>
      </form>
      
      <div className="mt-6">
        <h3 className="font-semibold text-slate-300 mb-2">Character Sheet Preview</h3>
        <div className="w-full aspect-square bg-slate-700/30 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-600">
          {isLoading && !character && <div className="text-center"><Loader /><p className="mt-2 text-slate-400">Generating...</p></div>}
          {!isLoading && !character && <p className="text-slate-500 text-sm">Your character appears here</p>}
          {character && (
            <img 
              src={`data:${character.mimeType};base64,${character.imageBase64}`} 
              alt="Generated Character" 
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterArchitect;