
import React, { useState, useRef } from 'react';
import { CymaticSimulation, SimulationHandle } from './CymaticSimulation.tsx';
import { ControlPanel } from './ControlPanel.tsx';
import { DEFAULT_PARAMS, SimulationParams } from '../types.ts';

interface SimulatorViewProps {
  onBack: () => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({ onBack }) => {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [controlsHidden, setControlsHidden] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const simRef = useRef<SimulationHandle>(null);

  const getApproxMode = (f: number) => {
      if (f < 0.1) return "FLAT (0 Hz)";
      if (f >= 2.0 && f < 4.0) return "DIPOLE (2 LOBES)";
      if (f >= 4.0 && f < 6.0) return "TRIPOLE (3 LOBES)";
      if (f >= 6.0 && f < 8.0) return "QUADRUPOLE (4 LOBES)";
      if (f >= 8.0 && f < 10.0) return "PENTAGON (5 LOBES)";
      if (f >= 10.0 && f < 12.0) return "HEXAGON (6 LOBES)";
      
      const seed = Math.floor(f * 0.4) * 12.34;
      const val = (Math.abs(Math.sin(seed) * 43758.5453) % 1) * 10.0;
      if (val < 2.0) return "TRIANGULAR";
      if (val < 4.0) return "SQUARE GRID";
      if (val < 6.0) return "HEXAGONAL";
      if (val < 7.0) return "QUASI-CRYSTAL";
      if (val < 8.0) return "COMPLEX (7)";
      if (val < 9.0) return "OCTAGONAL";
      return "HIGH ORDER";
  };

  const currentMode = getApproxMode(params.frequency);

  const handleExport = () => {
    if (simRef.current) {
      simRef.current.triggerDownload();
    }
  };

  return (
    <div className="relative w-screen h-[100dvh] bg-black overflow-hidden font-sans text-white select-none flex flex-col md:block">
      
      {/* --- DESKTOP: FULLSCREEN CANVAS | MOBILE: TOP 55% --- */}
      <div className="flex-grow md:flex-grow-0 relative md:absolute md:inset-0 z-0 h-[55%] md:h-full">
         <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent to-black opacity-50 z-10" />
         <CymaticSimulation ref={simRef} params={params} isPlaying={isPlaying} />
         
         {/* HEADER OVERLAY */}
         <div className="absolute top-4 left-4 z-20 flex items-start gap-4 pointer-events-none">
            <button 
              onClick={onBack}
              className="pointer-events-auto mt-1 w-8 h-8 flex items-center justify-center rounded-full bg-gray-900/50 border border-gray-700 text-gray-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/20 transition-all"
              title="Torna alla Home"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            <div className="hidden md:block">
              <h1 className="text-3xl font-light tracking-tighter text-white opacity-90">
                CYMATICS <span className="font-bold text-blue-500">STUDIO LAB</span> <span className="text-xs text-gray-600">v6.9</span>
              </h1>
              <p className="text-xs text-gray-400 mt-1 tracking-wide">SIMULATORE DI ONDE DI FARADAY</p>
            </div>
            {/* Mobile Header Simplified */}
            <div className="md:hidden">
              <h1 className="text-lg font-bold text-blue-500">STUDIO LAB <span className="text-[9px] text-gray-600">v6.9</span></h1>
            </div>
         </div>

         {/* STATUS OVERLAY */}
         <div className="absolute bottom-4 left-4 z-20 pointer-events-none opacity-60">
            <div className="flex flex-col gap-1 text-[9px] md:text-[10px] font-mono text-gray-400">
              <div>FREQ: {params.frequency.toFixed(2)} Hz <span className="text-blue-400">[{currentMode}]</span></div>
              <div className="hidden md:block">DIAM: {params.diameter.toFixed(1)} CM | DEPTH: {params.depth.toFixed(1)} CM</div>
              <div>SPEED: {params.simulationSpeed.toFixed(2)}x</div>
            </div>
         </div>
      </div>

      {/* --- DESKTOP: SIDEBAR | MOBILE: BOTTOM 45% PANEL --- */}
      <div className="md:static h-[45%] md:h-auto relative z-30">
        <ControlPanel 
          params={params} 
          onChange={setParams} 
          isHidden={controlsHidden}
          toggleHidden={() => setControlsHidden(!controlsHidden)}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onExport={handleExport}
        />
      </div>

    </div>
  );
};
