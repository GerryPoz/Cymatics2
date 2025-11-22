
import React, { useState, useEffect } from 'react';
import { SimulationParams, Preset, DEFAULT_PARAMS, ContainerShape } from '../types.ts';

interface ControlPanelProps {
  params: SimulationParams;
  onChange: (newParams: SimulationParams) => void;
  isHidden: boolean;
  toggleHidden: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onExport: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  params, 
  onChange, 
  isHidden, 
  toggleHidden,
  isPlaying,
  onTogglePlay,
  onExport
}) => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(-1);

  useEffect(() => {
    const saved = localStorage.getItem('cymatics_presets');
    if (saved) {
      try {
        setPresets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load presets", e);
      }
    }
  }, []);

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    const newPreset: Preset = {
      name: presetName.trim(),
      params: { ...params }
    };
    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem('cymatics_presets', JSON.stringify(updatedPresets));
    setPresetName('');
    setSelectedPresetIndex(updatedPresets.length - 1);
  };

  const handleLoadPreset = () => {
    if (selectedPresetIndex >= 0 && selectedPresetIndex < presets.length) {
      const loadedParams = {
        ...DEFAULT_PARAMS,
        ...presets[selectedPresetIndex].params
      };
      onChange(loadedParams);
    }
  };

  const handleDeletePreset = () => {
    if (selectedPresetIndex >= 0 && selectedPresetIndex < presets.length) {
      const updatedPresets = presets.filter((_, i) => i !== selectedPresetIndex);
      setPresets(updatedPresets);
      localStorage.setItem('cymatics_presets', JSON.stringify(updatedPresets));
      setSelectedPresetIndex(-1);
    }
  };

  const handleChange = (key: keyof SimulationParams, value: number | string) => {
    onChange({ ...params, [key]: value });
  };

  const ShapeButton = ({ shape, current, onClick }: { shape: ContainerShape, current: ContainerShape, onClick: () => void }) => {
    let path = "";
    if (shape === 'circle') path = "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z";
    if (shape === 'square') path = "M3 3H21V21H3V3Z";
    if (shape === 'triangle') path = "M12 3L22 21H2L12 3Z";
    if (shape === 'hexagon') path = "M12 2L21 7V17L12 22L3 17V7L12 2Z";

    return (
      <button
        onClick={onClick}
        className={`p-2 rounded border transition-all ${
          current === shape 
            ? 'bg-orange-500/20 border-orange-500 text-orange-400' 
            : 'bg-gray-800 border-gray-700 text-gray-500 hover:text-white hover:border-gray-500'
        }`}
        title={shape.charAt(0).toUpperCase() + shape.slice(1)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={path} />
        </svg>
      </button>
    );
  };

  // Logic for Split Frequency Control
  const baseFreq = Math.floor(params.frequency / 10) * 10;
  const fineFreq = params.frequency % 10;

  const handleBaseFreqChange = (base: number) => {
    handleChange('frequency', base + fineFreq);
  };

  const handleFineFreqChange = (fine: number) => {
    handleChange('frequency', baseFreq + fine);
  };

  if (isHidden) {
    return (
      <button
        onClick={toggleHidden}
        className="fixed top-4 right-4 z-50 bg-black/60 text-white p-3 rounded-full backdrop-blur-md border border-gray-800 hover:bg-gray-900 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-black/90 backdrop-blur-md border-l border-gray-900 p-6 overflow-y-auto transition-transform z-40 shadow-2xl">
      <div className="flex justify-between items-center mb-6 pt-2">
        <h2 className="text-lg font-light tracking-widest text-white border-b border-blue-900/50 pb-2 w-full">
          CONTROLLI <span className="text-blue-500 font-bold">CIMATICA</span>
        </h2>
        <button onClick={toggleHidden} className="absolute right-6 top-8 text-gray-500 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* PRESET LIBRARY SECTION */}
      <div className="mb-8 p-4 bg-gray-900/60 rounded-lg border border-gray-800">
        <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3">Libreria Preset</h3>
        <div className="flex gap-2 mb-3">
          <input 
            type="text" 
            placeholder="Nome nuovo preset..." 
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            className="bg-gray-800 text-white text-xs rounded px-2 py-1 flex-grow border border-gray-700 focus:border-blue-500 outline-none"
          />
          <button 
            onClick={handleSavePreset}
            disabled={!presetName.trim()}
            className="bg-blue-600/20 text-blue-400 border border-blue-600/50 hover:bg-blue-600/40 text-[10px] uppercase font-bold px-3 rounded disabled:opacity-30"
          >
            Salva
          </button>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedPresetIndex} 
            onChange={(e) => setSelectedPresetIndex(parseInt(e.target.value))}
            className="bg-gray-800 text-white text-xs rounded px-2 py-1 flex-grow border border-gray-700 outline-none"
          >
            <option value={-1}>-- Seleziona Preset --</option>
            {presets.map((p, idx) => (
              <option key={idx} value={idx}>{p.name}</option>
            ))}
          </select>
          <button 
            onClick={handleLoadPreset}
            disabled={selectedPresetIndex === -1}
            className="bg-green-600/20 text-green-400 border border-green-600/50 hover:bg-green-600/40 text-[10px] uppercase font-bold px-2 rounded disabled:opacity-30"
          >
            Load
          </button>
          <button 
            onClick={handleDeletePreset}
            disabled={selectedPresetIndex === -1}
            className="bg-red-600/20 text-red-400 border border-red-600/50 hover:bg-red-600/40 text-[10px] uppercase font-bold px-2 rounded disabled:opacity-30"
          >
            X
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Time Control Group */}
        <div className="space-y-5">
          <h3 className="text-[10px] uppercase tracking-widest text-green-500 font-bold mb-2">Flusso Temporale</h3>
          <button
            onClick={onTogglePlay}
            className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 border ${
              isPlaying 
                ? 'bg-red-500/10 border-red-500/50 text-red-400 hover:bg-red-500/20' 
                : 'bg-green-500/10 border-green-500/50 text-green-400 hover:bg-green-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                <span className="text-xs font-bold tracking-wider">FERMA SIMULAZIONE</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M5 3l14 9-14 9V3z" /></svg>
                <span className="text-xs font-bold tracking-wider">AVVIA SIMULAZIONE</span>
              </>
            )}
          </button>
          
          <div className={`transition-opacity duration-300 ${isPlaying ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex flex-col gap-2 mb-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-gray-400 uppercase font-bold">Esposizione (Frames)</label>
                <span className="text-xs font-mono text-cyan-400">{params.exportFrameStack}x</span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleChange('exportFrameStack', num)}
                      className={`py-1 text-[10px] rounded border ${
                        params.exportFrameStack === num
                          ? 'bg-cyan-500 text-black border-cyan-500 font-bold'
                          : 'bg-gray-900 text-gray-500 border-gray-700 hover:border-cyan-500/50 hover:text-cyan-400'
                      }`}
                    >
                      {num}
                    </button>
                 ))}
              </div>
            </div>
            <button
              onClick={onExport}
              disabled={isPlaying}
              className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 border ${
                isPlaying 
                  ? 'bg-gray-800/50 border-gray-800 text-gray-600 cursor-not-allowed' 
                  : 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 cursor-pointer'
              }`}
            >
              <span className="text-xs font-bold tracking-wider">
                {isPlaying ? 'PAUSA PER SCARICARE' : 'SCARICA SNAPSHOT'}
              </span>
            </button>
          </div>

          <div className="group mt-4">
            <div className="flex justify-between mb-2">
              <label className="text-xs text-gray-400 group-hover:text-white transition-colors">Velocità</label>
              <span className="text-xs font-mono text-green-400">{params.simulationSpeed.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.05"
              value={params.simulationSpeed}
              onChange={(e) => handleChange('simulationSpeed', parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400"
            />
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

        {/* Container Geometry Group */}
        <div className="space-y-5">
          <h3 className="text-[10px] uppercase tracking-widest text-orange-500 font-bold mb-2">Geometria Recipiente</h3>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
               <label className="text-xs text-gray-400">Forma</label>
               <span className="text-xs font-mono text-orange-400 uppercase">{params.containerShape || 'circle'}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <ShapeButton shape="circle" current={params.containerShape || 'circle'} onClick={() => handleChange('containerShape', 'circle')} />
              <ShapeButton shape="square" current={params.containerShape || 'circle'} onClick={() => handleChange('containerShape', 'square')} />
              <ShapeButton shape="triangle" current={params.containerShape || 'circle'} onClick={() => handleChange('containerShape', 'triangle')} />
              <ShapeButton shape="hexagon" current={params.containerShape || 'circle'} onClick={() => handleChange('containerShape', 'hexagon')} />
            </div>
          </div>

          <div className="group">
            <div className="flex justify-between mb-2">
              <label className="text-xs text-gray-400 group-hover:text-white transition-colors">Diametro (cm)</label>
              <span className="text-xs font-mono text-orange-400">{params.diameter.toFixed(1)} cm</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="0.5"
              value={params.diameter}
              onChange={(e) => handleChange('diameter', parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400"
            />
          </div>

          <div className="group">
            <div className="flex justify-between mb-2">
              <label className="text-xs text-gray-400 group-hover:text-white transition-colors">Profondità Acqua (cm)</label>
              <span className="text-xs font-mono text-orange-400">{params.depth.toFixed(1)} cm</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="30"
              step="0.5"
              value={params.depth}
              onChange={(e) => handleChange('depth', parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400"
            />
          </div>
           <div className="flex items-center justify-between">
            <label className="text-xs text-gray-400">Colore Fluido</label>
            <div className="relative overflow-hidden w-8 h-8 rounded-full border border-gray-600">
                <input
                type="color"
                value={params.liquidColor}
                onChange={(e) => handleChange('liquidColor', e.target.value)}
                className="absolute -top-2 -left-2 w-12 h-12 p-0 border-none cursor-pointer"
                />
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

        {/* Wave Physics Group */}
        <div className="space-y-5">
          <h3 className="text-[10px] uppercase tracking-widest text-blue-500 font-bold mb-2">Risonanza Liquida</h3>
          
          {/* NEW FREQUENCY CONTROL */}
          <div className="group">
            <div className="flex justify-between mb-2 items-end">
              <label className="text-xs text-gray-400 group-hover:text-white transition-colors">Frequenza (Hz)</label>
              <span className="text-lg font-mono text-blue-400 font-bold">{params.frequency.toFixed(2)} <span className="text-xs text-gray-500 font-normal">Hz</span></span>
            </div>
            
            {/* Macro Buttons (Tens) */}
            <div className="grid grid-cols-5 gap-1 mb-3">
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90].map((val) => (
                <button
                  key={val}
                  onClick={() => handleBaseFreqChange(val)}
                  className={`py-1 text-[10px] font-mono rounded border transition-colors ${
                    baseFreq === val
                      ? 'bg-blue-600 text-white border-blue-500 font-bold shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                      : 'bg-gray-800 text-gray-500 border-gray-700 hover:border-blue-500/50 hover:text-blue-400'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>

            {/* Micro Slider (Cents) */}
            <div className="relative pt-1">
               <div className="flex justify-between text-[9px] text-gray-500 mb-1 px-1 uppercase tracking-wider font-bold">
                  <span>+0.00</span>
                  <span>Fine Tuning</span>
                  <span>+9.99</span>
               </div>
               <input
                type="range"
                min="0.00"
                max="9.99"
                step="0.01"
                value={fineFreq}
                onChange={(e) => handleFineFreqChange(parseFloat(e.target.value))}
                className="w-full h-4 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 border border-gray-700/50"
              />
            </div>
          </div>

          <div className="group mt-6">
            <div className="flex justify-between mb-2">
              <label className="text-xs text-gray-400 group-hover:text-white transition-colors">Altezza Onda (Ampiezza)</label>
              <span className="text-xs font-mono text-blue-400">{params.amplitude.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="1.0"
              step="0.01"
              value={params.amplitude}
              onChange={(e) => handleChange('amplitude', parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
            />
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

        {/* Lighting Group */}
        <div className="space-y-5">
          <h3 className="text-[10px] uppercase tracking-widest text-purple-500 font-bold mb-2">Setup Ottico</h3>
          <div className="group">
            <div className="flex justify-between mb-2">
              <label className="text-xs text-gray-400 group-hover:text-white transition-colors">Altezza Camera</label>
              <span className="text-xs font-mono text-purple-400">{params.cameraHeight.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="30.0"
              step="0.5"
              value={params.cameraHeight}
              onChange={(e) => handleChange('cameraHeight', parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400"
            />
          </div>

          {/* RING 1 */}
           <div className="group border-l-2 border-purple-500/30 pl-3 mt-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] uppercase font-bold text-purple-300">Anello 1 (Principale)</label>
              <div className="relative overflow-hidden w-4 h-4 rounded-full border border-gray-600">
                <input type="color" value={params.ledColor} onChange={(e) => handleChange('ledColor', e.target.value)} className="absolute -top-2 -left-2 w-8 h-8 p-0 border-none cursor-pointer" />
              </div>
            </div>
            
            <div className="flex justify-between mb-1"><label className="text-xs text-gray-500">Altezza</label><span className="text-xs font-mono text-gray-400">{params.ledHeight.toFixed(1)}</span></div>
            <input type="range" min="0.2" max="10.0" step="0.1" value={params.ledHeight} onChange={(e) => handleChange('ledHeight', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500 mb-2" />

            <div className="flex justify-between mb-1"><label className="text-xs text-gray-500">Raggio</label><span className="text-xs font-mono text-gray-400">{params.ledRadius.toFixed(1)} cm</span></div>
            <input type="range" min="1.0" max="30.0" step="0.5" value={params.ledRadius} onChange={(e) => handleChange('ledRadius', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500 mb-2" />
            
             <div className="flex justify-between mb-1"><label className="text-xs text-gray-500">Dimensione LED</label><span className="text-xs font-mono text-gray-400">{params.ledSize.toFixed(2)}</span></div>
            <input type="range" min="0.05" max="2.0" step="0.05" value={params.ledSize} onChange={(e) => handleChange('ledSize', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500 mb-2" />

            <div className="flex justify-between mb-1"><label className="text-xs text-gray-500">Densità (Count)</label><span className="text-xs font-mono text-gray-400">{params.ledCount.toFixed(0)}</span></div>
            <input type="range" min="10" max="144" step="1" value={params.ledCount} onChange={(e) => handleChange('ledCount', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500 mb-2" />

             <div className="flex justify-between mb-1"><label className="text-xs text-gray-500">Intensità</label><span className="text-xs font-mono text-gray-400">{params.ledIntensity.toFixed(1)}</span></div>
            <input type="range" min="0.1" max="10.0" step="0.1" value={params.ledIntensity} onChange={(e) => handleChange('ledIntensity', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500 mb-2" />
            
             <div className="flex justify-between mb-1"><label className="text-xs text-gray-500">Estensione Riflesso</label><span className="text-xs font-mono text-gray-400">{params.ledSpread.toFixed(1)}</span></div>
            <input type="range" min="0.2" max="4.0" step="0.1" value={params.ledSpread} onChange={(e) => handleChange('ledSpread', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
          </div>

          {/* RING 2 */}
          <div className="group border-l-2 border-pink-500/30 pl-3 mt-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] uppercase font-bold text-pink-300">Anello 2 (Secondario)</label>
               <div className="relative overflow-hidden w-4 h-4 rounded-full border border-gray-600">
                <input type="color" value={params.led2Color} onChange={(e) => handleChange('led2Color', e.target.value)} className="absolute -top-2 -left-2 w-8 h-8 p-0 border-none cursor-pointer" />
              </div>
            </div>
            
            <div className="flex justify-between mb-1"><label className="text-xs text-gray-500">Altezza</label><span className="text-xs font-mono text-gray-400">{params.led2Height.toFixed(1)}</span></div>
            <input type="range" min="0.2" max="10.0" step="0.1" value={params.led2Height} onChange={(e) => handleChange('led2Height', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mb-2" />

            <div className="flex justify-between mb-1"><label className="text-xs text-gray-500">Raggio</label><span className="text-xs font-mono text-gray-400">{params.led2Radius.toFixed(1)} cm</span></div>
            <input type="range" min="1.0" max="30.0" step="0.5" value={params.led2Radius} onChange={(e) => handleChange('led2Radius', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mb-2" />
            
             <div className="flex justify-between mb-1"><label className="text-xs text-gray-500">Dimensione LED</label><span className="text-xs font-mono text-gray-400">{params.led2Size.toFixed(2)}</span></div>
            <input type="range" min="0.05" max="2.0" step="0.05" value={params.led2Size} onChange={(e) => handleChange('led2Size', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mb-2" />
            
             <div className="flex justify-between mb-1"><label className="text-xs text-gray-500">Densità (Count)</label><span className="text-xs font-mono text-gray-400">{params.led2Count.toFixed(0)}</span></div>
            <input type="range" min="10" max="144" step="1" value={params.led2Count} onChange={(e) => handleChange('led2Count', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mb-2" />

             <div className="flex justify-between mb-1"><label className="text-xs text-gray-500">Intensità</label><span className="text-xs font-mono text-gray-400">{params.led2Intensity.toFixed(1)}</span></div>
            <input type="range" min="0.1" max="10.0" step="0.1" value={params.led2Intensity} onChange={(e) => handleChange('led2Intensity', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500 mb-2" />

             <div className="flex justify-between mb-1"><label className="text-xs text-gray-500">Estensione Riflesso</label><span className="text-xs font-mono text-gray-400">{params.led2Spread.toFixed(1)}</span></div>
            <input type="range" min="0.2" max="4.0" step="0.1" value={params.led2Spread} onChange={(e) => handleChange('led2Spread', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500" />
          </div>

        </div>
      </div>
      
      <div className="mt-12 text-[10px] text-gray-700 text-center uppercase tracking-widest">
        Physics Engine v4.3 - Precision Freq Update
      </div>
    </div>
  );
};
