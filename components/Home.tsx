
import React from 'react';

interface HomeProps {
  onStart: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="relative w-full h-full min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center font-sans selection:bg-blue-500 selection:text-white">
      {/* Abstract Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <div className="z-10 max-w-4xl w-full px-6 flex flex-col items-center text-center space-y-8">
        
        {/* Header Section */}
        <div className="space-y-2">
          <h2 className="text-xs font-mono text-blue-400 tracking-[0.3em] uppercase mb-4">Physics Engine v4.3</h2>
          <h1 className="text-6xl md:text-8xl font-light tracking-tighter">
            CYMATICS <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">LED</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light tracking-wide max-w-2xl mx-auto mt-4">
            Simulatore professionale di onde di Faraday e interferometria ottica.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12 text-left">
          <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm hover:border-blue-500/50 transition-colors group">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Fisica Reale</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Simulazione basata su equazioni d'onda capillari reali. Dispersione di frequenza non lineare, tensione superficiale e risonanza modale caotica.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm hover:border-purple-500/50 transition-colors group">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Dual Ring System</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Configurazione ottica avanzata con doppio anello LED. Controllo indipendente di raggio, altezza, densità, colore e diffusione del riflesso.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm hover:border-green-500/50 transition-colors group">
             <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">4K Export & Stack</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Rendering offline ad alta definizione (3840x3840). Supporto per "Frame Stacking" (fino a 10x) per creare scie luminose a lunga esposizione.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-12">
          <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-white text-black font-bold tracking-widest text-sm rounded-full overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <span className="relative flex items-center gap-3">
              ENTRA NEL SIMULATORE
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
          </button>
        </div>

        <div className="absolute bottom-6 text-[10px] text-gray-600 font-mono">
          WEBGL 2.0 • REACT 19 • TYPESCRIPT
        </div>
      </div>
    </div>
  );
};
