
export type ContainerShape = 'circle' | 'square' | 'triangle' | 'hexagon';

export interface SimulationParams {
  frequency: number;     // Wave density, Speed AND Symmetry
  amplitude: number;     // Physical wave height
  damping: number;       // Edge attenuation
  simulationSpeed: number; // Time scale modifier (Slow motion)
  
  // Ring 1 (Main)
  ledColor: string;      
  ledSize: number;       
  ledHeight: number;     
  ledRadius: number;     
  ledCount: number;      // Specific count for Ring 1
  ledIntensity: number;  // Specific brightness for Ring 1
  ledSpread: number;     // Specific reflection spread for Ring 1
  
  // Ring 2 (Secondary)
  led2Color: string;     
  led2Size: number;      
  led2Height: number;    
  led2Radius: number;
  led2Count: number;     // Specific count for Ring 2
  led2Intensity: number; // Specific brightness for Ring 2
  led2Spread: number;    // Specific reflection spread for Ring 2

  cameraHeight: number;  // Z-position of the camera/eye
  exposure: number;      // Camera gain
  liquidColor: string;   // Base absorption color
  depth: number;         // Water depth in cm
  diameter: number;      // Container diameter in cm
  containerShape: ContainerShape; // Shape of the vessel

  exportFrameStack: number; // Number of frames to blend for export
}

export interface Preset {
  name: string;
  params: SimulationParams;
}

export const DEFAULT_PARAMS: SimulationParams = {
  frequency: 10.0,       
  amplitude: 0.01,
  damping: 0.15,
  simulationSpeed: 1.0,  
  
  // Ring 1
  ledColor: "#ffffff",   
  ledSize: 0.30,          
  ledHeight: 5.0,        
  ledRadius: 4.5,
  ledCount: 85,
  ledIntensity: 4.0,
  ledSpread: 1.0,
  
  // Ring 2
  led2Color: "#ffaa55",  
  led2Size: 0.20,         
  led2Height: 5.0,       
  led2Radius: 3.5,
  led2Count: 60,
  led2Intensity: 3.0,
  led2Spread: 1.5,

  cameraHeight: 17.0,    
  exposure: 1.2,
  liquidColor: "#010308",
  depth: 5.0,            
  diameter: 9.0,
  containerShape: 'circle',
  
  exportFrameStack: 1
};
