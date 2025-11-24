import React, { useState } from 'react';

interface HomeProps {
  onStart: () => void;
}

type HomeSection = 'main' | 'info' | 'contacts';

export const Home: React.FC<HomeProps> = ({ onStart }) => {
  const [section, setSection] = useState<HomeSection>('main');

  const renderMain = () => (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-12 animate-fade-in">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h2 className="text-xs font-mono text-blue-400 tracking-[0.3em] uppercase mb-2">Physics Engine v4.6</h2>
        <h1 className="text-5xl md:text-7xl font-light tracking-tighter">
          CYMATICS <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">STUDIO LAB</span>
        </h1>
      </div>

      {/* Main CTA */}
      <button 
        onClick={onStart}
        className="group relative px-12 py-6 bg-white text-black font-bold tracking-[0.2em] text-sm rounded-full overflow-hidden hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95"
      >
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
        <span className="relative flex items-center gap-3">
          ENTRA NEL SIMULATORE
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </span>
      </button>

      {/* Menu Navigation */}
      <div className="flex flex-col md:flex-row gap-4 mt-8">
        <button 
          onClick={() => setSection('info')}
          className="px-8 py-3 rounded-lg border border-gray-800 bg-gray-900/40 hover:bg-gray-800 hover:border-blue-500/50 text-gray-300 hover:text-white transition-all text-xs tracking-widest font-bold uppercase flex items-center gap-2"
        >
          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Info & Cimatica
        </button>
        <button 
          onClick={() => setSection('contacts')}
          className="px-8 py-3 rounded-lg border border-gray-800 bg-gray-900/40 hover:bg-gray-800 hover:border-purple-500/50 text-gray-300 hover:text-white transition-all text-xs tracking-widest font-bold uppercase flex items-center gap-2"
        >
          <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          Contatti
        </button>
      </div>

      {/* Small Copyright Footer */}
      <div className="absolute bottom-6 text-[10px] text-gray-600 font-mono">
        © 2024 Germano Pozzati. All rights reserved.
      </div>
    </div>
  );

  const renderInfo = () => (
    <div className="flex flex-col items-center w-full max-w-5xl px-6 py-12 animate-fade-in space-y-8">
      <div className="w-full flex justify-start">
        <button onClick={() => setSection('main')} className="flex items-center gap-2 text-gray-400 hover:text-white text-xs uppercase tracking-widest transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Torna alla Home
        </button>
      </div>

      <h2 className="text-3xl font-light text-white mb-6">INFO & CIMATICA</h2>

       {/* Feature Icons Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
          {/* Feature 1 */}
          <div className="flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-800 bg-gray-900/30 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h5l3 5l5-10l3 5h4" /></svg>
            </div>
            <div className="text-center px-2">
              <h3 className="text-sm font-bold text-gray-200 tracking-wider uppercase">Motore Fisico</h3>
              <p className="text-[11px] text-gray-400 mt-2 leading-tight">
                Simulazione interferenza onde stazionarie e fluidodinamica viscosa.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-800 bg-gray-900/30 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            </div>
            <div className="text-center px-2">
              <h3 className="text-sm font-bold text-gray-200 tracking-wider uppercase">Dual Ring Light</h3>
              <p className="text-[11px] text-gray-400 mt-2 leading-tight">
                Illuminazione a doppio anello indipendente per riflessi complessi.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-800 bg-gray-900/30 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
            <div className="text-center px-2">
              <h3 className="text-sm font-bold text-gray-200 tracking-wider uppercase">4K Export</h3>
              <p className="text-[11px] text-gray-400 mt-2 leading-tight">
                Rendering HD (3840px) con funzione lunga esposizione.
              </p>
            </div>
          </div>
        </div>

        {/* Text Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left">
          <div className="space-y-4 p-6 rounded-2xl bg-gray-900/30 border border-gray-800 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-blue-200 flex items-center gap-3">
              <span className="w-6 h-1 bg-blue-500 rounded-full"></span>
              Cos'è la Cimatica
            </h3>
            <p className="text-gray-400 leading-relaxed text-xs md:text-sm text-justify">
              La Cimatica è lo studio della forma visibile del suono. Quando un liquido in un recipiente viene eccitato acusticamente, la sua superficie forma complessi pattern geometrici (onde di Faraday) che rispondono a precise leggi di risonanza. Ogni frequenza genera un mandala unico.
            </p>
          </div>

          <div className="space-y-4 p-6 rounded-2xl bg-gray-900/30 border border-gray-800 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-purple-200 flex items-center gap-3">
              <span className="w-6 h-1 bg-purple-500 rounded-full"></span>
              Obiettivo
            </h3>
            <p className="text-gray-400 leading-relaxed text-xs md:text-sm text-justify">
              Questo simulatore replica fedelmente il fenomeno fisico reale utilizzando equazioni d'onda avanzate. Simula l'interazione tra liquido viscoso e luce LED riflessa, permettendo di esplorare l'infinita varietà di forme sonore senza un laboratorio fisico.
            </p>
          </div>
        </div>
    </div>
  );

  const renderContacts = () => (
    <div className="flex flex-col items-center justify-center h-full w-full px-6 animate-fade-in">
       <div className="w-full max-w-md mb-12 flex justify-start">
        <button onClick={() => setSection('main')} className="flex items-center gap-2 text-gray-400 hover:text-white text-xs uppercase tracking-widest transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Torna alla Home
        </button>
      </div>

      <div className="flex items-center gap-5 px-8 py-8 rounded-xl border border-gray-700 bg-gray-900/80 backdrop-blur-md shadow-2xl w-full max-w-md">
             {/* Icon Container */}
             <div className="w-16 h-16 flex-shrink-0 rounded-full bg-gradient-to-br from-gray-800 to-black border border-gray-700 flex items-center justify-center text-blue-400 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
             </div>
             
             {/* Text Info */}
             <div className="text-left flex flex-col justify-center overflow-hidden">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-1">Created & Designed by</div>
                <div className="text-xl font-bold text-white tracking-wide mb-2">Germano Pozzati</div>
                <a href="mailto:pliplomail@gmail.com" className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-mono flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                   pliplomail@gmail.com
                </a>
             </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-full bg-black text-white overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <div className="relative z-10 w-full h-full overflow-y-auto">
        {section === 'main' && renderMain()}
        {section === 'info' && renderInfo()}
        {section === 'contacts' && renderContacts()}
      </div>
    </div>
  );
};