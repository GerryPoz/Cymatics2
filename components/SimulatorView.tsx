
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

  // Display approximate mode for UI feedback based on the new hash logic
  const getApproxMode = (f: number) => {
      if (f < 0.1) return "FLAT (0 Hz)";
      if (f < 3.0) return "DIPOLE (2 LOBES)";
      if (f < 5.0) return "TRIPOLE (3 LOBES)";
      if (f < 8.0) return "QUADRUPOLE (4 LOBES)";
      if (f < 10.0) return "PENTAGONAL (5 LOBES)";
      if (f < 12.0) return "HEXAGONAL (6 LOBES)";
      
      const seed = Math.floor(f * 0.4) * 12.34;
      const val = (Math.abs(Math.sin(seed) * 43758.5453) % 1) * 10.0;
      if (val < 4.0) return "COMPLEX LATTICE";
      return "HIGH ORDER CHAOS";
  };

  const currentMode = getApproxMode(params.frequency);

  const handleExport = () => {
    if (simRef.current) {
      simRef.current.triggerDownload();
    }
  };

  return (
    // MAIN LAYOUT CONTAINER
    // Portrait: flex-col (Vertical stack)
    // Landscape: flex-row (Side-by-side)
    <div className="relative w-screen h-[100dvh] bg-black overflow-hidden font-sans text-white select-none flex flex-col landscape:flex-row">
      
      {/* 1. PATTERN AREA (Top in Portrait, Left in Landscape) */}
      <div className="relative flex-grow landscape:w-[60%] h-[55%] landscape:h-full order-1">
          {/* Background Gradient / Overlay for aesthetics */}
          <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent to-black opacity-50 z-10" />
          
          {/* WebGL Simulation Canvas */}
          <div className="absolute inset-0 z-0">
            <CymaticSimulation ref={simRef} params={params} isPlaying={isPlaying} />
          </div>

          {/* Header / Overlay UI */}
          <div className="absolute top-6 left-6 z-20 flex items-start gap-4 pointer-events-none">
            {/* Back Button (Pointer events re-enabled) */}
            <button 
              onClick={onBack}
              className="pointer-events-auto mt-1 w-8 h-8 flex items-center justify-center rounded-full bg-gray-900/50 border border-gray-700 text-gray-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/20 transition-all"
              title="Torna alla Home"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>

            <div>
              <h1 className="text-xl md:text-3xl font-light tracking-tighter text-white opacity-90 drop-shadow-md">
                CYMATICS <span className="font-bold text-blue-500">STUDIO LAB</span> <span className="text-[10px] md:text-xs text-gray-400">v7.0</span>
              </h1>
              <p className="text-[9px] md:text-xs text-gray-400 mt-1 tracking-wide opacity-80 hidden md:block">
                SIMULATORE DI ONDE DI FARADAY
              </p>
            </div>
          </div>

          {/* Status info (Desktop/Overlay) */}
          <div className="absolute bottom-6 left-6 z-20 pointer-events-none opacity-60 hidden md:block">
            <div className="flex flex-col gap-1 text-[10px] font-mono text-gray-400">
              <div>FREQ: {params.frequency.toFixed(2)} HZ</div>
              <div>GEOMETRY: <span className="text-blue-400">{currentMode}</span></div>
              <div>SPEED: {params.simulationSpeed.toFixed(2)}x</div>
            </div>
          </div>
      </div>

      {/* 2. MENU AREA (Bottom in Portrait, Right in Landscape) */}
      <div className="relative w-full landscape:w-[40%] h-[45%] landscape:h-full bg-black/90 border-t landscape:border-t-0 landscape:border-l border-gray-800 z-30 order-2 flex flex-col">
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