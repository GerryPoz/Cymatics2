
import React, { useState } from 'react';

interface HomeProps {
  onStart: () => void;
}

type HomeSection = 'main' | 'info' | 'contacts' | 'applications';

export const Home: React.FC<HomeProps> = ({ onStart }) => {
  const [section, setSection] = useState<HomeSection>('main');

  const renderMain = () => (
    <div className="min-h-full flex flex-col items-center justify-between p-6 animate-fade-in w-full max-w-4xl mx-auto">
      
      {/* Spacer top to push content to center */}
      <div className="flex-grow flex flex-col items-center justify-center w-full space-y-10 md:space-y-16 py-10">
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <h2 className="text-[10px] md:text-xs font-mono text-blue-400 tracking-[0.3em] uppercase mb-2">Physics Engine v5.0</h2>
          <h1 className="text-4xl md:text-7xl font-light tracking-tighter leading-tight">
            CYMATICS <br className="md:hidden" /> 
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">STUDIO LAB</span>
          </h1>
        </div>

        {/* Main Actions Container */}
        <div className="flex flex-col items-center gap-8 w-full">
          {/* Main CTA */}
          <button 
            onClick={onStart}
            className="group relative px-10 py-5 md:px-12 md:py-6 bg-white text-black font-bold tracking-[0.2em] text-xs md:text-sm rounded-full overflow-hidden hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95 w-full md:w-auto max-w-xs"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <span className="relative flex items-center justify-center gap-3">
              ENTRA NEL SIMULATORE
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
          </button>

          {/* Menu Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto px-4">
            <button 
              onClick={() => setSection('info')}
              className="px-4 py-3 rounded-lg border border-gray-800 bg-gray-900/40 hover:bg-gray-800 hover:border-blue-500/50 text-gray-300 hover:text-white transition-all text-[10px] md:text-xs tracking-widest font-bold uppercase flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Info & Cimatica
            </button>
            <button 
              onClick={() => setSection('applications')}
              className="px-4 py-3 rounded-lg border border-gray-800 bg-gray-900/40 hover:bg-gray-800 hover:border-emerald-500/50 text-gray-300 hover:text-white transition-all text-[10px] md:text-xs tracking-widest font-bold uppercase flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              Applicazioni
            </button>
            <button 
              onClick={() => setSection('contacts')}
              className="px-4 py-3 rounded-lg border border-gray-800 bg-gray-900/40 hover:bg-gray-800 hover:border-purple-500/50 text-gray-300 hover:text-white transition-all text-[10px] md:text-xs tracking-widest font-bold uppercase flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Contatti
            </button>
          </div>
        </div>
      </div>

      {/* Footer - Now part of flex flow (mt-auto pushes it down, but safe from overlap) */}
      <div className="mt-auto py-6 text-[10px] text-gray-600 font-mono text-center w-full">
        © 2024 Germano Pozzati. All rights reserved.
      </div>
    </div>
  );

  const renderInfo = () => (
    <div className="min-h-full flex flex-col items-center w-full max-w-5xl mx-auto px-6 py-12 animate-fade-in space-y-8">
      <div className="w-full flex justify-start">
        <button onClick={() => setSection('main')} className="flex items-center gap-2 text-gray-400 hover:text-white text-xs uppercase tracking-widest transition-colors py-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Torna alla Home
        </button>
      </div>

      <h2 className="text-2xl md:text-3xl font-light text-white mb-6 text-center md:text-left">INFO & CIMATICA</h2>

       {/* Feature Icons Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-4">
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
              <h3 className="text-sm font-bold text-gray-200 tracking-wider uppercase">Triple Ring Light</h3>
              <p className="text-[11px] text-gray-400 mt-2 leading-tight">
                Illuminazione a triplo anello indipendente per riflessi complessi 3D.
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

        {/* MATH SECTION */}
        <div className="w-full p-6 rounded-2xl bg-emerald-900/10 border border-emerald-800/50 backdrop-blur-sm mb-2">
          <h3 className="text-lg font-bold text-emerald-200 flex items-center gap-3 mb-4">
            <span className="w-6 h-1 bg-emerald-500 rounded-full"></span>
            Il Cuore Matematico
          </h3>
          <p className="text-gray-300 leading-relaxed text-xs md:text-sm text-justify mb-4">
            Questo simulatore si distingue perché non utilizza animazioni pre-registrate o texture statiche. Tutto ciò che vedi è <strong>calcolato in tempo reale</strong>, fotogramma per fotogramma, applicando rigorosi principi fisici.
          </p>
          <ul className="space-y-3 text-xs md:text-sm text-gray-400 list-disc pl-5">
            <li>
              <strong className="text-emerald-400">Interferenza d'Onda:</strong> Il software calcola come le onde sonore si propagano, rimbalzano sulle pareti (rotonde, quadrate o esagonali) e si scontrano tra loro. Dove le onde si incontrano, si sommano o si annullano, creando i pattern geometrici, esattamente come accade in natura.
            </li>
            <li>
              <strong className="text-emerald-400">Simulazione dei Fluidi:</strong> Vengono riprodotte le proprietà fisiche del liquido, come la viscosità e la tensione superficiale. Modificando la densità, l'algoritmo altera il modo in cui l'energia si disperde, simulando il comportamento di fluidi diversi come acqua, olio o miele.
            </li>
            <li>
              <strong className="text-emerald-400">Ottica Vettoriale (Raytracing):</strong> Infine, simuliamo la luce. Per ogni singolo pixel, il motore calcola l'angolazione precisa della superficie dell'acqua per determinare se rifletterà la luce dei LED verso la telecamera o se rimarrà in ombra, creando un effetto fotorealistico tridimensionale.
            </li>
          </ul>
        </div>

        {/* Text Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left pb-10">
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

  const renderApplications = () => (
    <div className="min-h-full flex flex-col items-center w-full max-w-6xl mx-auto px-6 py-12 animate-fade-in space-y-8">
      <div className="w-full flex justify-start">
        <button onClick={() => setSection('main')} className="flex items-center gap-2 text-gray-400 hover:text-white text-xs uppercase tracking-widest transition-colors py-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Torna alla Home
        </button>
      </div>

      <h2 className="text-2xl md:text-3xl font-light text-white mb-2 text-center md:text-left">POSSIBILI APPLICAZIONI</h2>
      <p className="text-gray-400 text-sm max-w-2xl text-center md:text-left">
        Cymatics Studio Lab è un potente strumento di visualizzazione che trova utilità in diversi campi professionali e creativi.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pb-10">
        
        {/* SCIENTIFIC */}
        <div className="bg-gray-900/40 border border-blue-900/30 p-6 rounded-2xl backdrop-blur-sm hover:border-blue-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-4 text-blue-400">
             <div className="p-2 bg-blue-500/10 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
             </div>
             <h3 className="font-bold tracking-wider">SCIENZA & RICERCA</h3>
          </div>
          <ul className="space-y-4 text-xs md:text-sm text-gray-400 leading-relaxed">
             <li>
               <strong className="text-blue-300 block mb-1">Acustica Architettonica</strong>
               Visualizzazione dei Modi di Risonanza in ambienti chiusi. Il simulatore mostra come le onde si accumulano in stanze di forma diversa (quadrata, esagonale), utile per comprendere l'acustica degli spazi.
             </li>
             <li>
               <strong className="text-blue-300 block mb-1">Analogie Quantistiche</strong>
               I pattern generati sono analoghi 2D delle funzioni d'onda degli orbitali atomici. Utile per visualizzare concetti astratti come il "caos quantistico" e la quantizzazione dell'energia.
             </li>
             <li>
               <strong className="text-blue-300 block mb-1">Fluidodinamica</strong>
               Studio visivo di come la viscosità (densità) e la tensione superficiale influenzano la propagazione dell'energia in un mezzo liquido.
             </li>
          </ul>
        </div>

        {/* EDUCATIONAL */}
        <div className="bg-gray-900/40 border border-emerald-900/30 p-6 rounded-2xl backdrop-blur-sm hover:border-emerald-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-4 text-emerald-400">
             <div className="p-2 bg-emerald-500/10 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
             </div>
             <h3 className="font-bold tracking-wider">DIDATTICA</h3>
          </div>
          <ul className="space-y-4 text-xs md:text-sm text-gray-400 leading-relaxed">
             <li>
               <strong className="text-emerald-300 block mb-1">Fisica Ondulatoria</strong>
               Strumento essenziale per insegnanti e studenti per visualizzare concetti altrimenti invisibili: nodi, ventri, interferenza costruttiva e distruttiva in tempo reale.
             </li>
             <li>
               <strong className="text-emerald-300 block mb-1">Relazione Frequenza/Materia</strong>
               Dimostrazione visiva immediata della relazione di dispersione: aumentando la frequenza, la lunghezza d'onda diminuisce e la complessità geometrica aumenta.
             </li>
          </ul>
        </div>

        {/* ARTISTIC */}
        <div className="bg-gray-900/40 border border-purple-900/30 p-6 rounded-2xl backdrop-blur-sm hover:border-purple-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-4 text-purple-400">
             <div className="p-2 bg-purple-500/10 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
             </div>
             <h3 className="font-bold tracking-wider">ARTE & CREATIVITÀ</h3>
          </div>
          <ul className="space-y-4 text-xs md:text-sm text-gray-400 leading-relaxed">
             <li>
               <strong className="text-purple-300 block mb-1">Visual Arts & Design</strong>
               Generazione di texture organiche e pattern geometrici unici per stampe, proiezioni o background digitali. L'esportazione 4K permette l'uso professionale delle immagini.
             </li>
             <li>
               <strong className="text-purple-300 block mb-1">Sinestesia Musicale</strong>
               Esplorazione del rapporto suono-immagine. Artisti e musicisti possono usare il simulatore per "vedere" le frequenze che compongono o per creare visualizer statici ad alta definizione.
             </li>
             <li>
               <strong className="text-purple-300 block mb-1">Meditazione</strong>
               L'effetto "mandala" generato dalle onde stazionarie ha un naturale potere ipnotico e rilassante, utile per installazioni artistiche ambientali.
             </li>
          </ul>
        </div>

      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="min-h-full flex flex-col items-center justify-center w-full px-6 py-12 animate-fade-in">
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
                <a href="mailto:pliplomail@gmail.com" className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-mono flex items-center gap-2 break-all">
                   <svg className="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                   pliplomail@gmail.com
                </a>
             </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-0 bg-black text-white overflow-y-auto font-sans selection:bg-blue-500 selection:text-white">
      {/* Background - Fixed position so it doesn't scroll away */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* Content Wrapper - min-h-[100dvh] to handle mobile address bars correctly */}
      <div className="relative z-10 w-full min-h-[100dvh] flex flex-col">
        {section === 'main' && renderMain()}
        {section === 'info' && renderInfo()}
        {section === 'applications' && renderApplications()}
        {section === 'contacts' && renderContacts()}
      </div>
    </div>
  );
};
