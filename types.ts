
export type ContainerShape = 'circle' | 'square' | 'triangle' | 'hexagon';

export interface SimulationParams {
  frequency: number;     // Wave density, Speed AND Symmetry
  amplitude: number;     // Physical wave height
  damping: number;       // Edge attenuation
  reflectionSpread: number; // Width of the LED reflection on crests
  simulationSpeed: number; // Time scale modifier (Slow motion)
  ledCount: number;      // Discrete LED points
  ledBrightness: number; // Bloom intensity
  
  // Ring 1 (Main)
  ledColor: string;      
  ledSize: number;       
  ledHeight: number;     
  ledRadius: number;     
  
  // Ring 2 (Secondary)
  led2Color: string;     
  led2Size: number;      
  led2Height: number;    
  led2Radius: number;    

  cameraHeight: number;  // Z-position of the camera/eye
  exposure: number;      // Camera gain
  liquidColor: string;   // Base absorption color
  depth: number;         // Water depth in cm
  diameter: number;      // Container diameter in cm
  containerShape: ContainerShape; // Shape of the vessel

  exportFrameStack: number; // New: Number of frames to blend for export
}

export interface Preset {
  name: string;
  params: SimulationParams;
}

export const DEFAULT_PARAMS: SimulationParams = {
  frequency: 10.0,       
  amplitude: 0.01,
  damping: 0.15,
  reflectionSpread: 1.0, 
  simulationSpeed: 1.0,  
  ledCount: 85,          
  ledBrightness: 4.0,    
  
  // Ring 1
  ledColor: "#ffffff",   
  ledSize: 0.30,          
  ledHeight: 5.0,        
  ledRadius: 4.5,       
  
  // Ring 2
  led2Color: "#ffaa55",  
  led2Size: 0.20,         
  led2Height: 5.0,       
  led2Radius: 3.5,       

  cameraHeight: 17.0,    
  exposure: 1.2,
  liquidColor: "#010308",
  depth: 5.0,            
  diameter: 9.0,
  containerShape: 'circle',
  
  exportFrameStack: 1 // Default to single frame
};
