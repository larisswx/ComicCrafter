
import React, { useState } from 'react';
import type { Project } from '../types';

interface ProjectManagerProps {
    projects: Project[];
    currentProjectId: number | null;
    onCreateProject: (name: string) => void;
    onSwitchProject: (id: number) => void;
    onDeleteProject: (id: number) => void;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ projects, currentProjectId, onCreateProject, onSwitchProject, onDeleteProject }) => {
    const [newProjectName, setNewProjectName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (newProjectName.trim()) {
            onCreateProject(newProjectName.trim());
            setNewProjectName('');
            setIsCreating(false);
        }
    };
    
    const confirmDelete = (e: React.MouseEvent, id: number, name: string) => {
        e.stopPropagation(); // prevent switching to the project
        if (window.confirm(`Are you sure you want to delete the project "${name}"? This cannot be undone.`)) {
            onDeleteProject(id);
        }
    };

    return (
        <div className="p-6 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-2xl">
            <h2 className="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4">Projects</h2>
            <div className="space-y-2">
                {projects.map(project => (
                    <div
                        key={project.id}
                        onClick={() => onSwitchProject(project.id)}
                        className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${currentProjectId === project.id ? 'bg-indigo-600/80 ring-2 ring-indigo-400 text-white' : 'bg-slate-200 dark:bg-slate-700/50 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
                    >
                        <span className="font-semibold">{project.name}</span>
                        <button 
                            onClick={(e) => confirmDelete(e, project.id, project.name)} 
                            className="p-1 text-slate-500 dark:text-slate-400 hover:text-red-500 rounded-full transition-colors opacity-50 hover:opacity-100"
                            aria-label={`Delete project ${project.name}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                ))}
            </div>

            {isCreating ? (
                <form onSubmit={handleCreate} className="mt-4 flex gap-2">
                    <input
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="New project name..."
                        className="flex-grow bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        autoFocus
                    />
                    <button type="submit" className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors font-semibold text-sm text-white">Create</button>
                    <button type="button" onClick={() => setIsCreating(false)} className="px-2 py-2 bg-slate-200 dark:bg-slate-600/50 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm">X</button>
                </form>
            ) : (
                <button
                    onClick={() => setIsCreating(true)}
                    className="w-full mt-4 bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-2 px-4 rounded-lg transition-colors duration-300 border-2 border-dashed border-slate-300 dark:border-slate-600"
                >
                    + New Project
                </button>
            )}
        </div>
    );
};

export default ProjectManager;