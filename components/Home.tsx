
import React from 'react';

interface HomeProps {
  onStart: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="relative w-full h-full bg-black text-white overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start md:justify-center font-sans selection:bg-blue-500 selection:text-white">
      {/* Abstract Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <div className="z-10 max-w-5xl w-full px-6 flex flex-col items-center text-center space-y-8 py-16 md:py-10">
        
        {/* Header Section */}
        <div className="space-y-2 animate-fade-in-down">
          <h2 className="text-xs font-mono text-blue-400 tracking-[0.3em] uppercase mb-4">Physics Engine v4.3</h2>
          <h1 className="text-5xl md:text-8xl font-light tracking-tighter">
            CYMATICS <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">LED</span>
          </h1>
        </div>

        {/* Feature Icons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-6">
          {/* Feature 1 */}
          <div className="flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-800 bg-gray-900/30 backdrop-blur-sm hover:border-blue-500/50 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h5l3 5l5-10l3 5h4" /></svg>
            </div>
            <div className="text-center px-2">
              <h3 className="text-sm font-bold text-gray-200 tracking-wider uppercase">Motore Fisico</h3>
              <p className="text-[11px] text-gray-400 mt-2 leading-tight">
                Algoritmo avanzato che simula l'interferenza delle onde stazionarie, la dispersione capillare e la fisica dei fluidi viscosi.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-800 bg-gray-900/30 backdrop-blur-sm hover:border-purple-500/50 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            </div>
            <div className="text-center px-2">
              <h3 className="text-sm font-bold text-gray-200 tracking-wider uppercase">Dual Ring Light</h3>
              <p className="text-[11px] text-gray-400 mt-2 leading-tight">
                Sistema di illuminazione a doppio anello indipendente per creare riflessi geometrici complessi e separazione cromatica.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-800 bg-gray-900/30 backdrop-blur-sm hover:border-cyan-500/50 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 group-hover:scale-110 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
            <div className="text-center px-2">
              <h3 className="text-sm font-bold text-gray-200 tracking-wider uppercase">4K Export</h3>
              <p className="text-[11px] text-gray-400 mt-2 leading-tight">
                Rendering off-screen ad alta definizione (3840px) con funzione di lunga esposizione per creare scie luminose.
              </p>
            </div>
          </div>
        </div>

        {/* Description Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left">
          
          {/* Cos'è la Cimatica */}
          <div className="space-y-4 p-6 rounded-2xl bg-gray-900/30 border border-gray-800 backdrop-blur-sm hover:bg-gray-900/50 transition-colors">
            <h3 className="text-lg font-bold text-blue-200 flex items-center gap-3">
              <span className="w-6 h-1 bg-blue-500 rounded-full"></span>
              Cos'è la Cimatica
            </h3>
            <p className="text-gray-400 leading-relaxed text-xs md:text-sm text-justify">
              La Cimatica è lo studio della forma visibile del suono e delle vibrazioni. Quando un liquido contenuto in un recipiente viene eccitato acusticamente, la sua superficie si increspa formando complessi pattern geometrici noti come onde di Faraday. Queste geometrie non sono casuali, ma rispondono a precise leggi fisiche di risonanza, dove ogni frequenza genera un "mandala" unico di nodi e ventri.
            </p>
          </div>

          {/* Obiettivo del Simulatore */}
          <div className="space-y-4 p-6 rounded-2xl bg-gray-900/30 border border-gray-800 backdrop-blur-sm hover:bg-gray-900/50 transition-colors">
            <h3 className="text-lg font-bold text-purple-200 flex items-center gap-3">
              <span className="w-6 h-1 bg-purple-500 rounded-full"></span>
              Obiettivo del Simulatore
            </h3>
            <p className="text-gray-400 leading-relaxed text-xs md:text-sm text-justify">
              Questo software si prefigge di replicare fedelmente il fenomeno fisico reale utilizzando equazioni d'onda avanzate. Simula l'interazione tra la tensione superficiale di un liquido viscoso (come l'acqua nera) e la luce di anelli LED riflessa sulla sua superficie increspata. Permette di esplorare l'infinita varietà di forme create dal suono senza la necessità di un complesso laboratorio fisico.
            </p>
          </div>

        </div>

        {/* CTA Button */}
        <div className="pt-8 pb-4">
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
        </div>

        {/* Contact / Copyright Card */}
        <div className="mt-4 pb-8 flex justify-center w-full">
          <div className="flex items-center gap-5 px-6 py-4 rounded-xl border border-gray-700 bg-gray-900/60 backdrop-blur-md hover:bg-gray-800/80 hover:border-blue-500/40 transition-all duration-300 shadow-2xl group w-full max-w-md md:w-auto">
             {/* Icon Container */}
             <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-gray-800 to-black border border-gray-700 flex items-center justify-center text-blue-400 shadow-inner group-hover:scale-105 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
             </div>
             
             {/* Text Info */}
             <div className="text-left flex flex-col justify-center overflow-hidden">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-0.5 truncate">Created & Designed by</div>
                <div className="text-lg font-bold text-white tracking-wide truncate">Germano Pozzati</div>
                <a href="mailto:pliplomail@gmail.com" className="text-xs text-blue-400/80 hover:text-blue-300 transition-colors font-mono flex items-center gap-2 mt-1 truncate">
                   <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                   pliplomail@gmail.com
                </a>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};
