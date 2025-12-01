
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

type Tab = 'GEN' | 'GEO' | 'WAVE' | 'LIGHT';

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  params, 
  onChange, 
  isHidden, 
  toggleHidden,
  isPlaying,
  onTogglePlay,
  onExport
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('GEN');
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(-1);

  // Load presets on mount
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={path} />
        </svg>
      </button>
    );
  };

  const baseFreq = Math.floor(params.frequency / 10) * 10;
  const fineFreq = params.frequency % 10;
  const handleBaseFreqChange = (base: number) => { handleChange('frequency', base + fineFreq); };
  const handleFineFreqChange = (fine: number) => { handleChange('frequency', baseFreq + fine); };

  // --- RENDER SECTIONS ---

  const renderGeneral = () => (
    <div className="space-y-6">
       {/* PRESETS */}
       <div className="p-4 bg-gray-900/60 rounded-lg border border-gray-800">
        <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3">Libreria Preset</h3>
        <div className="flex gap-2 mb-3">
          <input 
            type="text" 
            placeholder="Nome preset..." 
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            className="bg-gray-800 text-white text-xs rounded px-2 py-2 flex-grow border border-gray-700 focus:border-blue-500 outline-none w-full"
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
            className="bg-gray-800 text-white text-xs rounded px-2 py-2 flex-grow border border-gray-700 outline-none w-full"
          >
            <option value={-1}>-- Carica Preset --</option>
            {presets.map((p, idx) => (
              <option key={idx} value={idx}>{p.name}</option>
            ))}
          </select>
          <button onClick={handleLoadPreset} disabled={selectedPresetIndex === -1} className="bg-green-600/20 text-green-400 border border-green-600/50 px-3 rounded text-xs font-bold disabled:opacity-30">Load</button>
          <button onClick={handleDeletePreset} disabled={selectedPresetIndex === -1} className="bg-red-600/20 text-red-400 border border-red-600/50 px-3 rounded text-xs font-bold disabled:opacity-30">X</button>
        </div>
      </div>

      {/* TIME CONTROL */}
      <div className="space-y-4">
          <button
            onClick={onTogglePlay}
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 border ${
              isPlaying 
                ? 'bg-red-500/10 border-red-500/50 text-red-400 hover:bg-red-500/20' 
                : 'bg-green-500/10 border-green-500/50 text-green-400 hover:bg-green-500/20'
            }`}
          >
            {isPlaying ? <span className="text-xs font-bold tracking-wider">FERMA SIMULAZIONE</span> : <span className="text-xs font-bold tracking-wider">AVVIA SIMULAZIONE</span>}
          </button>
          
          <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-gray-400 uppercase font-bold">Frame Stacking</label>
                <span className="text-xs font-mono text-cyan-400">{params.exportFrameStack}x</span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleChange('exportFrameStack', num)}
                      className={`py-2 text-[10px] rounded border ${
                        params.exportFrameStack === num ? 'bg-cyan-500 text-black border-cyan-500 font-bold' : 'bg-gray-900 text-gray-500 border-gray-700'
                      }`}
                    >
                      {num}
                    </button>
                 ))}
              </div>
              <button
                onClick={onExport}
                disabled={isPlaying}
                className={`w-full py-3 mt-2 rounded-lg flex items-center justify-center gap-2 border ${
                  isPlaying 
                    ? 'bg-gray-800/50 border-gray-800 text-gray-600 cursor-not-allowed' 
                    : 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 cursor-pointer'
                }`}
              >
                <span className="text-xs font-bold tracking-wider">{isPlaying ? 'PAUSA PER SCARICARE' : 'SCARICA SNAPSHOT'}</span>
              </button>
          </div>

          <div className="group pt-2">
            <div className="flex justify-between mb-2">
              <label className="text-xs text-gray-400">Velocità Simulazione</label>
              <span className="text-xs font-mono text-green-400">{params.simulationSpeed.toFixed(2)}x</span>
            </div>
            <input
              type="range" min="0.0" max="2.0" step="0.05"
              value={params.simulationSpeed}
              onChange={(e) => handleChange('simulationSpeed', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>
      </div>
    </div>
  );

  const renderGeometry = () => (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between mb-3">
            <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">Forma</label>
            <span className="text-xs font-mono text-orange-400 uppercase">{params.containerShape || 'circle'}</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <ShapeButton shape="circle" current={params.containerShape || 'circle'} onClick={() => handleChange('containerShape', 'circle')} />
          <ShapeButton shape="square" current={params.containerShape || 'circle'} onClick={() => handleChange('containerShape', 'square')} />
          <ShapeButton shape="triangle" current={params.containerShape || 'circle'} onClick={() => handleChange('containerShape', 'triangle')} />
          <ShapeButton shape="hexagon" current={params.containerShape || 'circle'} onClick={() => handleChange('containerShape', 'hexagon')} />
        </div>
      </div>

      <div className="space-y-5">
          <div className="group">
            <div className="flex justify-between mb-2">
              <label className="text-xs text-gray-400">Diametro (cm)</label>
              <span className="text-xs font-mono text-orange-400">{params.diameter.toFixed(1)} cm</span>
            </div>
            <input type="range" min="1" max="50" step="0.5" value={params.diameter} onChange={(e) => handleChange('diameter', parseFloat(e.target.value))} className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500" />
          </div>

          <div className="group">
            <div className="flex justify-between mb-2">
              <label className="text-xs text-gray-400">Profondità Acqua (cm)</label>
              <span className="text-xs font-mono text-orange-400">{params.depth.toFixed(1)} cm</span>
            </div>
            <input type="range" min="0.5" max="30" step="0.5" value={params.depth} onChange={(e) => handleChange('depth', parseFloat(e.target.value))} className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500" />
          </div>

          <div className="group">
            <div className="flex justify-between mb-2">
              <label className="text-xs text-gray-400">Densità Liquido (Viscosità)</label>
              <span className="text-xs font-mono text-orange-400">{params.liquidDensity ? params.liquidDensity.toFixed(1) : "1.0"}</span>
            </div>
            <input type="range" min="1.0" max="10.0" step="0.1" value={params.liquidDensity || 1.0} onChange={(e) => handleChange('liquidDensity', parseFloat(e.target.value))} className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500" />
          </div>

           <div className="flex items-center justify-between pt-2">
            <label className="text-xs text-gray-400">Colore Fluido</label>
            <div className="relative overflow-hidden w-8 h-8 rounded-full border border-gray-600">
                <input type="color" value={params.liquidColor} onChange={(e) => handleChange('liquidColor', e.target.value)} className="absolute -top-2 -left-2 w-12 h-12 p-0 border-none cursor-pointer" />
            </div>
          </div>
      </div>
    </div>
  );

  const renderWave = () => (
    <div className="space-y-6">
       <div className="group">
            <div className="flex justify-between mb-2 items-end">
              <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">Frequenza (Hz)</label>
              <span className="text-xl font-mono text-blue-400 font-bold">{params.frequency.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-5 gap-1 mb-3">
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90].map((val) => (
                <button
                  key={val}
                  onClick={() => handleBaseFreqChange(val)}
                  className={`py-2 text-[10px] font-mono rounded border transition-colors ${
                    baseFreq === val
                      ? 'bg-blue-600 text-white border-blue-500 font-bold'
                      : 'bg-gray-800 text-gray-500 border-gray-700 hover:border-blue-500/50 hover:text-blue-400'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            <div className="relative pt-1">
               <div className="flex justify-between text-[9px] text-gray-500 mb-1 px-1 uppercase tracking-wider font-bold"><span>+0.00</span><span>Fine Tuning</span><span>+9.99</span></div>
               <input type="range" min="0.00" max="9.99" step="0.01" value={fineFreq.toFixed(2)} onChange={(e) => handleFineFreqChange(parseFloat(e.target.value))} className="w-full h-4 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500 border border-gray-700/50" />
            </div>
       </div>

       <div className="space-y-5">
          <div className="group">
            <div className="flex justify-between mb-2">
              <label className="text-xs text-gray-400">Altezza Onda (Ampiezza)</label>
              <span className="text-xs font-mono text-blue-400">{params.amplitude.toFixed(2)}</span>
            </div>
            <input type="range" min="0.01" max="1.0" step="0.01" value={params.amplitude} onChange={(e) => handleChange('amplitude', parseFloat(e.target.value))} className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
          </div>

          <div className="group">
            <div className="flex justify-between mb-2">
              <label className="text-xs text-gray-400">Amplificazione (Gain)</label>
              <span className="text-xs font-mono text-blue-400">{params.frequencyAmplification ? params.frequencyAmplification.toFixed(1) : "1.0"}x</span>
            </div>
            <input type="range" min="1.0" max="5.0" step="0.1" value={params.frequencyAmplification || 1.0} onChange={(e) => handleChange('frequencyAmplification', parseFloat(e.target.value))} className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
          </div>
       </div>
    </div>
  );

  const renderLighting = () => (
    <div className="space-y-8 pb-10">
        <div className="group">
          <div className="flex justify-between mb-2">
            <label className="text-xs text-gray-400 uppercase font-bold">Altezza Camera</label>
            <span className="text-xs font-mono text-purple-400">{params.cameraHeight.toFixed(1)}</span>
          </div>
          <input type="range" min="2.0" max="30.0" step="0.5" value={params.cameraHeight} onChange={(e) => handleChange('cameraHeight', parseFloat(e.target.value))} className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
        </div>

        {/* --- RING 1 --- */}
        <div className="border-l-2 border-purple-500/30 pl-4 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs uppercase font-bold text-purple-300">Anello 1 (Main)</label>
              <div className="relative overflow-hidden w-5 h-5 rounded-full border border-gray-600">
                <input type="color" value={params.ledColor} onChange={(e) => handleChange('ledColor', e.target.value)} className="absolute -top-2 -left-2 w-10 h-10 p-0 border-none cursor-pointer" />
              </div>
            </div>
            
            {/* ORDER: HEIGHT, RADIUS, SIZE, DENSITY, SPREAD, INTENSITY */}
            
            <div className="group">
              <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 uppercase">Altezza</label><span className="text-[10px] font-mono text-gray-400">{params.ledHeight.toFixed(1)}</span></div>
              <input type="range" min="0.2" max="10.0" step="0.1" value={params.ledHeight} onChange={(e) => handleChange('ledHeight', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
            </div>

            <div className="group">
              <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 uppercase">Raggio</label><span className="text-[10px] font-mono text-gray-400">{params.ledRadius.toFixed(1)} cm</span></div>
              <input type="range" min="1.0" max="30.0" step="0.1" value={params.ledRadius} onChange={(e) => handleChange('ledRadius', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
            </div>

            <div className="group">
              <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 uppercase">Dimensione Led</label><span className="text-[10px] font-mono text-gray-400">{params.ledSize.toFixed(2)}</span></div>
              <input type="range" min="0.05" max="2.0" step="0.05" value={params.ledSize} onChange={(e) => handleChange('ledSize', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
            </div>

            <div className="group">
              <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 uppercase">Densità</label><span className="text-[10px] font-mono text-gray-400">{params.ledCount.toFixed(0)}</span></div>
              <input type="range" min="10" max="144" step="1" value={params.ledCount} onChange={(e) => handleChange('ledCount', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
            </div>

            <div className="group">
              <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 uppercase">Estensione Riflesso</label><span className="text-[10px] font-mono text-gray-400">{params.ledSpread.toFixed(1)}</span></div>
              <input type="range" min="0.2" max="4.0" step="0.1" value={params.ledSpread} onChange={(e) => handleChange('ledSpread', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
            </div>

            <div className="group">
              <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 uppercase">Intensità</label><span className="text-[10px] font-mono text-gray-400">{params.ledIntensity.toFixed(1)}</span></div>
              <input type="range" min="0.0" max="10.0" step="0.1" value={params.ledIntensity} onChange={(e) => handleChange('ledIntensity', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
            </div>
        </div>

        {/* --- RING 2 --- */}
        <div className="border-l-2 border-pink-500/30 pl-4 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs uppercase font-bold text-pink-300">Anello 2</label>
               <div className="relative overflow-hidden w-5 h-5 rounded-full border border-gray-600">
                <input type="color" value={params.led2Color} onChange={(e) => handleChange('led2Color', e.target.value)} className="absolute -top-2 -left-2 w-10 h-10 p-0 border-none cursor-pointer" />
              </div>
            </div>
            
            <div className="group">
              <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 uppercase">Altezza</label><span className="text-[10px] font-mono text-gray-400">{params.led2Height.toFixed(1)}</span></div>
              <input type="range" min="0.2" max="10.0" step="0.1" value={params.led2Height} onChange={(e) => handleChange('led2Height', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>
             <div className="group">
              <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 uppercase">Raggio</label><span className="text-[10px] font-mono text-gray-400">{params.led2Radius.toFixed(1)} cm</span></div>
              <input type="range" min="1.0" max="30.0" step="0.1" value={params.led2Radius} onChange={(e) => handleChange('led2Radius', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>
             <div className="group">
              <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 uppercase">Dimensione Led</label><span className="text-[10px] font-mono text-gray-400">{params.led2Size.toFixed(2)}</span></div>
              <input type="range" min="0.05" max="2.0" step="0.05" value={params.led2Size} onChange={(e) => handleChange('led2Size', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>
             <div className="group">
              <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 uppercase">Densità</label><span className="text-[10px] font-mono text-gray-400">{params.led2Count.toFixed(0)}</span></div>
              <input type="range" min="10" max="144" step="1" value={params.led2Count} onChange={(e) => handleChange('led2Count', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>
             <div className="group">
              <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 uppercase">Estensione Riflesso</label><span className="text-[10px] font-mono text-gray-400">{params.led2Spread.toFixed(1)}</span></div>
              <input type="range" min="0.2" max="4.0" step="0.1" value={params.led2Spread} onChange={(e) => handleChange('led2Spread', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>
            <div className="group">
              <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 uppercase">Intensità</label><span className="text-[10px] font-mono text-gray-400">{params.led2Intensity.toFixed(1)}</span></div>
              <input type="range" min="0.0" max="10.0" step="0.1" value={params.led2Intensity} onChange={(e) => handleChange('led2Intensity', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>
        </div>

        {/* --- RING 3 --- */}
        <div className="border-l-2 border-emerald-500/30 pl-4 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs uppercase font-bold text-emerald-300">Anello 3</label>
               <div className="relative overflow-hidden w-5 h-5 rounded-full border border-gray-600">
                <input type="color" value={params.led3Color} onChange={(e) => handleChange('led3Color', e.target.value)} className="absolute -top-2 -left-2 w-10 h-10 p-0 border-none cursor-pointer" />
              </div>
            </div>
            
            <div className="group">
              <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 uppercase">Altezza</label><span className="text-[10px] font-mono text-gray-400">{params.led3Height.toFixed(1)}</span></div>
              <input type="range" min="0.2" max="10.0" step="0.1" value={params.led3Height} onChange={(e) => handleChange('led3Height', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </div>
            <div className="group">
              <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 uppercase">Raggio</label><span className="text-[10px] font-mono text-gray-400">{params.led3Radius.toFixed(1)} cm</span></div>
              <input type="range" min="1.0" max="30.0" step="0.1" value={params.led3Radius} onChange={(e) => handleChange('led3Radius', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </div>
            <div className="group">
              <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 uppercase">Dimensione Led</label><span className="text-[10px] font-mono text-gray-400">{params.led3Size.toFixed(2)}</span></div>
              <input type="range" min="0.05" max="2.0" step="0.05" value={params.led3Size} onChange={(e) => handleChange('led3Size', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </div>
            <div className="group">
              <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 uppercase">Densità</label><span className="text-[10px] font-mono text-gray-400">{params.led3Count.toFixed(0)}</span></div>
              <input type="range" min="10" max="144" step="1" value={params.led3Count} onChange={(e) => handleChange('led3Count', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </div>
            <div className="group">
              <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 uppercase">Estensione Riflesso</label><span className="text-[10px] font-mono text-gray-400">{params.led3Spread.toFixed(1)}</span></div>
              <input type="range" min="0.2" max="4.0" step="0.1" value={params.led3Spread} onChange={(e) => handleChange('led3Spread', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </div>
            <div className="group">
              <div className="flex justify-between mb-1"><label className="text-[10px] text-gray-500 uppercase">Intensità</label><span className="text-[10px] font-mono text-gray-400">{params.led3Intensity.toFixed(1)}</span></div>
              <input type="range" min="0.0" max="10.0" step="0.1" value={params.led3Intensity} onChange={(e) => handleChange('led3Intensity', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </div>
        </div>

        {/* CALIBRATION (LAB) */}
        <div className="pt-6 border-t border-gray-800 space-y-4">
            <h3 className="text-[10px] uppercase tracking-widest text-yellow-500 font-bold mb-2">Taratura Strumentale (Lab)</h3>
            
            <div className="group">
                <div className="flex justify-between mb-1">
                    <label className="text-[10px] text-gray-400 group-hover:text-white transition-colors uppercase">K-Factor</label>
                    <span className="text-[10px] font-mono text-yellow-400">{params.calibrationKFactor ? params.calibrationKFactor.toFixed(2) : "1.00"}</span>
                </div>
                <input type="range" min="0.5" max="2.0" step="0.01" value={params.calibrationKFactor || 1.0} onChange={(e) => handleChange('calibrationKFactor', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
            </div>

            <div className="group">
                <div className="flex justify-between mb-1">
                    <label className="text-[10px] text-gray-400 group-hover:text-white transition-colors uppercase">Mode Offset</label>
                    <span className="text-[10px] font-mono text-yellow-400">{params.calibrationModeOffset ? params.calibrationModeOffset.toFixed(2) : "0.00"}</span>
                </div>
                <input type="range" min="0.0" max="10.0" step="0.1" value={params.calibrationModeOffset || 0.0} onChange={(e) => handleChange('calibrationModeOffset', parseFloat(e.target.value))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
            </div>
        </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col bg-black/95">
       {/* TAB NAVIGATION (MOBILE/LANDSCAPE SIDEBAR BOTTOM) */}
       <div className="flex justify-around items-center border-t border-gray-800 bg-gray-900 order-last h-16 shrink-0">
          <button onClick={() => setActiveTab('GEN')} className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${activeTab === 'GEN' ? 'text-white bg-gray-800' : 'text-gray-500 hover:text-gray-300'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            <span className="text-[9px] font-bold tracking-widest">GEN</span>
          </button>
          <button onClick={() => setActiveTab('GEO')} className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${activeTab === 'GEO' ? 'text-orange-400 bg-gray-800' : 'text-gray-500 hover:text-orange-400'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
            <span className="text-[9px] font-bold tracking-widest">GEO</span>
          </button>
          <button onClick={() => setActiveTab('WAVE')} className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${activeTab === 'WAVE' ? 'text-blue-400 bg-gray-800' : 'text-gray-500 hover:text-blue-400'}`}>
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            <span className="text-[9px] font-bold tracking-widest">WAVE</span>
          </button>
          <button onClick={() => setActiveTab('LIGHT')} className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${activeTab === 'LIGHT' ? 'text-purple-400 bg-gray-800' : 'text-gray-500 hover:text-purple-400'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/></svg>
            <span className="text-[9px] font-bold tracking-widest">LIGHT</span>
          </button>
       </div>

       {/* CONTENT SCROLL AREA */}
       <div className="flex-grow overflow-y-auto p-6 pr-10">
          {activeTab === 'GEN' && renderGeneral()}
          {activeTab === 'GEO' && renderGeometry()}
          {activeTab === 'WAVE' && renderWave()}
          {activeTab === 'LIGHT' && renderLighting()}
          
          <div className="mt-8 text-[9px] text-gray-700 text-center uppercase tracking-widest">
            Studio Lab v7.0
          </div>
       </div>
    </div>
  );
};