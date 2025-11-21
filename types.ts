
export type ContainerShape = 'circle' | 'square' | 'triangle' | 'hexagon';

export interface SimulationParams {
  frequency: number;     
  amplitude: number;     
  damping: number;       
  simulationSpeed: number; 
  
  // Ring 1 (Main)
  ledColor: string;      
  ledSize: number;       
  ledHeight: number;     
  ledRadius: number;     
  ledSpread: number;     // Specific Spread for Ring 1
  ledIntensity: number;  // Specific Intensity for Ring 1
  ledCount: number;      // Specific Count for Ring 1
  
  // Ring 2 (Secondary)
  led2Color: string;     
  led2Size: number;      
  led2Height: number;    
  led2Radius: number;    
  led2Spread: number;    // Specific Spread for Ring 2
  led2Intensity: number; // Specific Intensity for Ring 2
  led2Count: number;     // Specific Count for Ring 2

  cameraHeight: number;  
  exposure: number;      
  liquidColor: string;   
  depth: number;         
  diameter: number;      
  containerShape: ContainerShape; 

  exportFrameStack: number; 
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
  ledSpread: 1.0,
  ledIntensity: 4.0,
  ledCount: 85,
  
  // Ring 2
  led2Color: "#ffaa55",  
  led2Size: 0.20,         
  led2Height: 5.0,       
  led2Radius: 3.5,  
  led2Spread: 1.0,
  led2Intensity: 3.0,
  led2Count: 60,

  cameraHeight: 17.0,    
  exposure: 1.2,
  liquidColor: "#010308",
  depth: 5.0,            
  diameter: 9.0,
  containerShape: 'circle',
  
  exportFrameStack: 1 
};
