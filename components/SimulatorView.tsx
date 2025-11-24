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
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans text-white select-none">
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
          <h1 className="text-3xl font-light tracking-tighter text-white opacity-90">
            CYMATICS <span className="font-bold text-blue-500">STUDIO LAB</span> <span className="text-xs text-gray-600">v4.6</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 tracking-wide">
            SIMULATORE DI ONDE DI FARADAY
          </p>
        </div>
      </div>

      {/* Instructions overlay if needed, or status info */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none opacity-60">
        <div className="flex flex-col gap-1 text-[10px] font-mono text-gray-400">
          <div>FREQ: {params.frequency.toFixed(2)} HZ</div>
          <div>GEOMETRY: <span className="text-blue-400">{currentMode}</span></div>
          <div>DIAM: {params.diameter.toFixed(1)} CM</div>
          <div>DEPTH: {params.depth.toFixed(1)} CM</div>
          <div>CAM Z: {params.cameraHeight.toFixed(1)}</div>
          <div className="flex items-center gap-2">
            RING 1: <span className="inline-block w-2 h-2 rounded-full" style={{backgroundColor: params.ledColor}}></span> R{params.ledRadius.toFixed(1)} / I:{params.ledIntensity.toFixed(1)}
          </div>
          <div className="flex items-center gap-2">
            RING 2: <span className="inline-block w-2 h-2 rounded-full" style={{backgroundColor: params.led2Color}}></span> R{params.led2Radius.toFixed(1)} / I:{params.led2Intensity.toFixed(1)}
          </div>
          <div>SPEED: {params.simulationSpeed.toFixed(2)}x</div>
          <div>STATUS: {isPlaying ? 'RUNNING' : 'PAUSED'}</div>
        </div>
      </div>

      {/* Controls */}
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
  );
};