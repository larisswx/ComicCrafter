import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/60 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-slate-800">
      <div className="container mx-auto px-4 lg:px-6 py-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Comic<span className="text-teal-400">Crafter</span>
        </h1>
        <p className="text-slate-400 mt-1 text-sm">Your AI-Powered Comic Book Architect</p>
      </div>
    </header>
  );
};

export default Header;