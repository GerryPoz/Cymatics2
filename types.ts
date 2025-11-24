
export type ContainerShape = 'circle' | 'square' | 'triangle' | 'hexagon';

export interface SimulationParams {
  frequency: number;     
  amplitude: number;     
  frequencyAmplification: number; 
  damping: number;       
  simulationSpeed: number; 
  
  // Ring 1 (Main)
  ledColor: string;      
  ledSize: number;       
  ledHeight: number;     
  ledRadius: number;     
  ledSpread: number;     
  ledIntensity: number;  
  ledCount: number;      
  
  // Ring 2 (Secondary)
  led2Color: string;     
  led2Size: number;      
  led2Height: number;    
  led2Radius: number;    
  led2Spread: number;    
  led2Intensity: number; 
  led2Count: number;     

  // Ring 3 (Tertiary) - NEW
  led3Color: string;     
  led3Size: number;      
  led3Height: number;    
  led3Radius: number;    
  led3Spread: number;    
  led3Intensity: number; 
  led3Count: number;     

  cameraHeight: number;  
  exposure: number;      
  fillIntensity: number; // Ambient/Slope fill
  liquidColor: string;   
  liquidDensity: number; 
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
  frequencyAmplification: 1.0, 
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

  // Ring 3 - NEW
  led3Color: "#00ffcc",  
  led3Size: 0.15,         
  led3Height: 6.0,       
  led3Radius: 2.5,  
  led3Spread: 1.0,
  led3Intensity: 3.0,
  led3Count: 40,

  cameraHeight: 17.0,    
  exposure: 1.2,
  fillIntensity: 0.5,
  liquidColor: "#010308",
  liquidDensity: 1.0,    
  depth: 5.0,            
  diameter: 9.0,
  containerShape: 'circle',
  
  exportFrameStack: 1 
};
