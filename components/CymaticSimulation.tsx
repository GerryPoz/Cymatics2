
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle, useLayoutEffect } from 'react';
import { SimulationParams } from '../types.ts';

interface Props {
  params: SimulationParams;
  isPlaying: boolean;
}

export interface SimulationHandle {
  triggerDownload: () => void;
}

// --- SHADER SOURCES ---
const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5; 
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  varying vec2 v_uv;

  uniform vec2 u_resolution;
  uniform float u_time;
  
  // Interactive Zoom
  uniform float u_zoom;
  uniform vec2 u_zoomCenter;
  
  // Physics params
  uniform float u_frequency;
  uniform float u_amplitude;
  uniform float u_freqAmp; // Gain
  uniform float u_damping;
  uniform float u_depth;
  uniform float u_diameter;
  uniform float u_density; // Viscosity
  uniform int u_shape; 
  
  // Calibration
  uniform float u_calK;
  uniform float u_calMode;
  
  uniform float u_camHeight;
  uniform vec3 u_liquidColor;

  // Ring 1
  uniform vec3 u_ledColor;
  uniform float u_ledSize;
  uniform float u_ledHeight;
  uniform float u_ledRadius;
  uniform float u_ledSpread;
  uniform float u_ledIntensity;
  uniform float u_ledCount1;

  // Ring 2
  uniform vec3 u_led2Color;
  uniform float u_led2Size;
  uniform float u_led2Height;
  uniform float u_led2Radius;
  uniform float u_led2Spread;
  uniform float u_led2Intensity;
  uniform float u_ledCount2;

  // Ring 3
  uniform vec3 u_led3Color;
  uniform float u_led3Size;
  uniform float u_led3Height;
  uniform float u_led3Radius;
  uniform float u_led3Spread;
  uniform float u_led3Intensity;
  uniform float u_ledCount3;

  #define PI 3.14159265359
  
  // --- PHYSICS ENGINE ---

  float getShapeDist(vec2 p) {
      if (u_shape == 0) return length(p);
      if (u_shape == 1) return max(abs(p.x), abs(p.y));
      if (u_shape == 2) {
          p *= 1.2; 
          const float k = sqrt(3.0);
          p.x = abs(p.x) - 1.0;
          p.y = p.y + 1.0/k;
          if( p.x+k*p.y > 0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
          p.x -= clamp( p.x, -2.0, 0.0 );
          return -length(p)*sign(p.y) * 2.0 + 1.0; 
      }
      if (u_shape == 3) {
          vec2 q = abs(p);
          return max(q.y, q.x*0.866025 + q.y*0.5);
      }
      return length(p);
  }

  float hash(float n) {
      return fract(sin(n) * 43758.5453123);
  }

  float getModeFromHash(float h, float freq) {
      float val = h * 10.0;
      
      // Determine low frequency deterministic progression
      if (freq < 3.0) return 1.0; // Dipole (2 lobes, N=1)
      if (freq < 5.0) return 1.5; // Tripole (3 lobes, N=1.5 phased)
      if (freq < 8.0) return 2.0; // Quadrupole (4 lobes, N=2)
      if (freq < 10.0) return 2.5; // Pentagon (5 lobes, N=2.5 phased)
      if (freq < 12.0) return 3.0; // Hexagon (6 lobes, N=3)

      if (u_shape == 1) {
         if (val < 5.0) return 2.0; 
         return 4.0;
      }
      if (u_shape == 2 || u_shape == 3) return 3.0;

      if (val < 4.0) return 6.0; 
      if (val < 7.0) return 4.0; 
      if (val < 8.0) return 12.0; 
      if (val < 9.0) return 8.0; 
      return 3.0; 
  }

  float getWavenumber(float freq) {
      float k_phys = pow(freq, 0.6666); 
      float depthFactor = 1.0 + (1.5 / sqrt(u_depth + 0.1));
      // Calibration K Factor applied here
      return k_phys * u_diameter * 0.18 * depthFactor * u_calK; 
  }

  float calculateStandingWave(vec2 p, float k, float t, float N, float seed) {
      // N=1.5 SPECIAL CASE: PHASED TRIPOLE (3 Lobes)
      // Standard N=3 creates 6 lobes. To get 3, we sum 3 waves at 120 deg
      // BUT we phase shift them in time by 2PI/3 relative to each other.
      if (abs(N - 1.5) < 0.1) {
          float h = 0.0;
          for(int i=0; i<3; i++) {
             float angle = float(i) * (2.0 * PI / 3.0);
             vec2 dir = vec2(cos(angle), sin(angle));
             // Temporal phase shift is key here
             float timePhase = float(i) * (2.0 * PI / 3.0); 
             h += cos(dot(p, dir) * k * 0.8) * cos(t + timePhase);
          }
          return h / 1.5;
      }
      
      // N=2.5 SPECIAL CASE: PHASED PENTAGON (5 Lobes)
      // Standard N=5 creates 10 lobes. Using phase shift again.
      if (abs(N - 2.5) < 0.1) {
          float h = 0.0;
          for(int i=0; i<5; i++) {
             float angle = float(i) * (2.0 * PI / 5.0);
             vec2 dir = vec2(cos(angle), sin(angle));
             float timePhase = float(i) * (4.0 * PI / 5.0); 
             h += cos(dot(p, dir) * k * 0.8) * cos(t + timePhase);
          }
          return h / 2.0;
      }

      if (u_shape == 0) {
          float h = 0.0;
          float staticRot = 0.0; 
          
          // Use N directly. 
          // N=1 (loop 1 time) -> cos(x)*cos(t) -> Dipole (2 lobes)
          // N=2 (loop 2 times, 90 deg) -> Quadrupole (4 lobes)
          // N=3 (loop 3 times, 60 deg) -> Hexagon (6 lobes)
          
          float loopCount = floor(N); 
          if (loopCount < 1.0) loopCount = 1.0;
          
          for(float i = 0.0; i < 12.0; i++) {
              if(i >= loopCount) break;
              float angle = staticRot + (i / loopCount) * PI; 
              vec2 dir = vec2(cos(angle), sin(angle));
              float spatial = dot(p, dir) * k;
              h += cos(spatial) * cos(t);
          }
          return h / max(1.0, loopCount * 0.5);
      }
      if (u_shape == 1) {
          float rot = floor(seed) * (PI * 0.25); 
          float c = cos(rot);
          float s = sin(rot);
          vec2 pRot = vec2(p.x*c - p.y*s, p.x*s + p.y*c);
          float wx = cos(pRot.x * k * 0.7) * cos(t); 
          float wy = cos(pRot.y * k * 0.7) * cos(t);
          float mixFactor = fract(seed * 0.1);
          if (mixFactor > 0.5) return (wx + wy) * 0.5;
          return wx * wy; 
      }
      if (u_shape == 2 || u_shape == 3) {
          float h = 0.0;
          for(int i=0; i<3; i++) {
             float a = float(i) * 2.094395; 
             vec2 dir = vec2(cos(a), sin(a));
             h += cos(dot(p, dir) * k * 0.8) * cos(t);
          }
          return h / 3.0;
      }
      return 0.0;
  }

  float getSurfaceHeight(vec2 p, float shapeDist) {
      if (shapeDist > 1.0) return 0.0;
      if (u_frequency < 0.1) return 0.0;

      float effectiveFreq = u_frequency; // Decoupled from depth
      float stabilityScale = 0.5; 
      float f_scaled = effectiveFreq * stabilityScale;
      float f_index = floor(f_scaled);
      float f_fract = smoothstep(0.4, 0.6, fract(f_scaled)); 
      
      // Calibration Mode Offset applied to seeds
      float seedA = f_index * 12.34 + u_calMode;
      float nA = getModeFromHash(hash(seedA), u_frequency);
      float seedB = (f_index + 1.0) * 12.34 + u_calMode;
      float nB = getModeFromHash(hash(seedB), u_frequency);

      // Apply Manual Offset to N directly
      nA += u_calMode;
      nB += u_calMode;

      float k = getWavenumber(u_frequency);
      float w = u_time * u_frequency * 1.5;

      float hA = calculateStandingWave(p, k, w, nA, seedA);
      float hB = calculateStandingWave(p, k, w, nB, seedB);
      float mainWave = mix(hA, hB, f_fract);

      float k_micro = k * 3.0; 
      float w_micro = w * 1.2; 
      float hMicroA = calculateStandingWave(p, k_micro, w_micro, 12.0, seedA + 33.1);
      float hMicroB = calculateStandingWave(p, k_micro, w_micro, 12.0, seedB + 33.1);
      float microWave = mix(hMicroA, hMicroB, f_fract);

      // ORGANIC RIDGE LOGIC (Bone/Smoke structure for high viscosity)
      float densityFactor = max(1.0, u_density);
      float rawHeight = mainWave;
      
      // If density is high (> 6.0), invert shape to make ridges/tubes instead of peaks
      if (u_density > 6.0) {
          // Absolute value creates valleys/ridges from sine waves
          float organic = abs(mainWave); 
          // Smoothstep creates flat areas and sharp ridges
          organic = smoothstep(0.2, 0.8, organic);
          // Invert so high points are the ridges
          rawHeight = 1.0 - organic;
      } else {
          // Standard water physics
           rawHeight = mainWave + (microWave * 0.2 / densityFactor);
      }

      float bottomFriction = 1.0 + (1.0 / (u_depth + 0.1));
      float boundaryEnvelope = smoothstep(1.0, 0.90, shapeDist);
      float damping = 1.0 - (u_damping * 0.5 * shapeDist * shapeDist * bottomFriction);
      
      // SURFACE TENSION SHAPING
      float sharp;
      if (u_density > 6.0) {
          sharp = rawHeight; // Keep organic shape
      } else {
          float sharpExp = 1.8 + (u_density * 0.2); 
          sharp = exp(sharpExp * (rawHeight - 0.2));
      }
      
      float staticMeniscus = smoothstep(0.95, 1.0, shapeDist) * 0.2;

      return ((sharp - 0.5) * u_amplitude * u_freqAmp * damping * boundaryEnvelope) + staticMeniscus;
  }

  vec3 getNormal(vec2 p, float h, float shapeDist) {
      vec2 e = vec2(0.001, 0.0);
      float hx = getSurfaceHeight(p + e.xy, shapeDist); 
      float hy = getSurfaceHeight(p + e.yx, shapeDist);
      return normalize(vec3(h - hx, h - hy, e.x * 0.8));
  }

  float getLedRing(vec3 ro, vec3 rd, float ringRadius, float ringHeight, float dotSizeParam, float spreadParam, float intensityParam, float countParam) {
      if (abs(rd.z) < 0.001) return 0.0; 
      float t = (ringHeight - ro.z) / rd.z;
      if (t < 0.0) return 0.0; 
      
      vec3 hit = ro + rd * t;
      float r = length(hit.xy);
      float distToRing = abs(r - ringRadius);
      
      // Calculate ray steepness (1.0 is vertical, 0.0 is horizontal)
      float raySteepness = 1.0 - abs(rd.z);
      
      // RIBBON EFFECT:
      // If spreadParam is high, we allow reflections from steeper rays (sides of waves)
      // We effectively widen the "hit zone" based on how steep the ray is.
      float effectiveSpread = 0.15 * max(1.0, spreadParam * raySteepness * 4.0);
      
      // Check if ray hits the ring band
      float ringHit = step(distToRing, effectiveSpread);
      if (ringHit < 0.5) return 0.0;

      // GLOW DECAY
      float decay = 40.0 / max(0.01, spreadParam); 
      float glow = exp(-distToRing * decay); 
      
      // DOT PATTERN
      float angle = atan(hit.y, hit.x);
      float ledPhase = (angle / (2.0 * PI)) * countParam;
      float ledLocal = fract(ledPhase);
      
      // Keep dots round by using fixed dotSizeParam regardless of spread
      float dotSize = dotSizeParam * 0.5; 
      float dot = smoothstep(dotSize + 0.1, dotSize, abs(ledLocal - 0.5));
      
      float continuity = smoothstep(48.0, 120.0, countParam);
      
      return glow * mix(dot, 1.0, continuity) * intensityParam;
  }

  void main() {
      // 1. Normalize coords
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
      
      // 2. Apply Interactive Zoom
      uv = (uv - u_zoomCenter) / u_zoom + u_zoomCenter;
      
      // 3. Apply Base Scale
      uv *= 2.3; 

      float d = getShapeDist(uv);
      if (d > 1.0) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
          return;
      }

      float h = getSurfaceHeight(uv, d);
      vec3 pos = vec3(uv, h * 0.15); 
      vec3 norm = getNormal(uv, h, d);
      
      // Slope based ambient lighting
      float slope = 1.0 - norm.z;
      vec3 ambientFill = vec3(1.0) * slope * 0.0; 

      vec3 camPos = vec3(0.0, 0.0, u_camHeight);
      vec3 viewDir = normalize(pos - camPos);
      vec3 reflDir = reflect(viewDir, norm);
      
      vec3 dirR = normalize(reflDir + vec3(0.004, 0.0, 0.0));
      vec3 dirG = reflDir;
      vec3 dirB = normalize(reflDir - vec3(0.004, 0.0, 0.0));

      // Ring 1
      float r1 = getLedRing(pos, dirR, u_ledRadius, u_ledHeight, u_ledSize, u_ledSpread, u_ledIntensity, u_ledCount1);
      float g1 = getLedRing(pos, dirG, u_ledRadius, u_ledHeight, u_ledSize, u_ledSpread, u_ledIntensity, u_ledCount1);
      float b1 = getLedRing(pos, dirB, u_ledRadius, u_ledHeight, u_ledSize, u_ledSpread, u_ledIntensity, u_ledCount1);
      vec3 col1 = vec3(r1, g1, b1) * u_ledColor;

      // Ring 2
      float r2 = getLedRing(pos, dirR, u_led2Radius, u_led2Height, u_led2Size, u_led2Spread, u_led2Intensity, u_ledCount2);
      float g2 = getLedRing(pos, dirG, u_led2Radius, u_led2Height, u_led2Size, u_led2Spread, u_led2Intensity, u_ledCount2);
      float b2 = getLedRing(pos, dirB, u_led2Radius, u_led2Height, u_led2Size, u_led2Spread, u_led2Intensity, u_ledCount2);
      vec3 col2 = vec3(r2, g2, b2) * u_led2Color;

      // Ring 3
      float r3 = getLedRing(pos, dirR, u_led3Radius, u_led3Height, u_led3Size, u_led3Spread, u_led3Intensity, u_ledCount3);
      float g3 = getLedRing(pos, dirG, u_led3Radius, u_led3Height, u_led3Size, u_led3Spread, u_led3Intensity, u_ledCount3);
      float b3 = getLedRing(pos, dirB, u_led3Radius, u_led3Height, u_led3Size, u_led3Spread, u_led3Intensity, u_ledCount3);
      vec3 col3 = vec3(r3, g3, b3) * u_led3Color;

      vec3 reflection = col1 + col2 + col3;
      float reflectionMask = smoothstep(0.98, 0.92, d);
      reflection *= reflectionMask;

      vec3 baseColor = u_liquidColor * 0.02; // Very dark base
      vec3 finalColor = baseColor + reflection + ambientFill;

      gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// --- HELPER FUNCTIONS ---

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ] : [1, 1, 1];
};

// Renderer Class
class Renderer {
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    uLoc: any;
    buffer: WebGLBuffer | null;

    constructor(canvas: HTMLCanvasElement) {
        const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
        if (!gl) throw new Error("WebGL not supported");
        this.gl = gl;

        const createShader = (type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error("Shader Error:", gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!vertexShader || !fragmentShader) throw new Error("Shader Init Failed");

        const program = gl.createProgram();
        if (!program) throw new Error("Program Create Failed");
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Link Failed");
        gl.useProgram(program);
        this.program = program;

        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
            -1.0,  1.0,
             1.0, -1.0,
             1.0,  1.0,
        ]), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Cache Locations
        this.uLoc = {
            res: gl.getUniformLocation(program, "u_resolution"),
            time: gl.getUniformLocation(program, "u_time"),
            zoom: gl.getUniformLocation(program, "u_zoom"),
            zoomCenter: gl.getUniformLocation(program, "u_zoomCenter"),
            freq: gl.getUniformLocation(program, "u_frequency"),
            amp: gl.getUniformLocation(program, "u_amplitude"),
            freqAmp: gl.getUniformLocation(program, "u_freqAmp"),
            damp: gl.getUniformLocation(program, "u_damping"),
            depth: gl.getUniformLocation(program, "u_depth"),
            diam: gl.getUniformLocation(program, "u_diameter"),
            dens: gl.getUniformLocation(program, "u_density"),
            shape: gl.getUniformLocation(program, "u_shape"), 
            cHeight: gl.getUniformLocation(program, "u_camHeight"),
            wCol: gl.getUniformLocation(program, "u_liquidColor"),
            
            calK: gl.getUniformLocation(program, "u_calK"),
            calMode: gl.getUniformLocation(program, "u_calMode"),

            lCol: gl.getUniformLocation(program, "u_ledColor"),
            lSize: gl.getUniformLocation(program, "u_ledSize"),
            lHeight: gl.getUniformLocation(program, "u_ledHeight"),
            lRad: gl.getUniformLocation(program, "u_ledRadius"),
            lSpread: gl.getUniformLocation(program, "u_ledSpread"),
            lIntensity: gl.getUniformLocation(program, "u_ledIntensity"),
            lCount: gl.getUniformLocation(program, "u_ledCount1"),
            
            l2Col: gl.getUniformLocation(program, "u_led2Color"),
            l2Size: gl.getUniformLocation(program, "u_led2Size"),
            l2Height: gl.getUniformLocation(program, "u_led2Height"),
            l2Rad: gl.getUniformLocation(program, "u_led2Radius"),
            l2Spread: gl.getUniformLocation(program, "u_led2Spread"),
            l2Intensity: gl.getUniformLocation(program, "u_led2Intensity"),
            l2Count: gl.getUniformLocation(program, "u_ledCount2"),

            l3Col: gl.getUniformLocation(program, "u_led3Color"),
            l3Size: gl.getUniformLocation(program, "u_led3Size"),
            l3Height: gl.getUniformLocation(program, "u_led3Height"),
            l3Rad: gl.getUniformLocation(program, "u_led3Radius"),
            l3Spread: gl.getUniformLocation(program, "u_led3Spread"),
            l3Intensity: gl.getUniformLocation(program, "u_led3Intensity"),
            l3Count: gl.getUniformLocation(program, "u_ledCount3"),
        };
    }

    render(p: SimulationParams, time: number, width: number, height: number, zoomLevel: number, zoomCenter: {x: number, y: number}) {
        const gl = this.gl;
        gl.viewport(0, 0, width, height);
        gl.useProgram(this.program);

        gl.uniform2f(this.uLoc.res, width, height);
        gl.uniform1f(this.uLoc.time, time);
        gl.uniform1f(this.uLoc.zoom, zoomLevel);
        gl.uniform2f(this.uLoc.zoomCenter, zoomCenter.x, zoomCenter.y);
        gl.uniform1f(this.uLoc.freq, p.frequency);
        gl.uniform1f(this.uLoc.amp, p.amplitude);
        gl.uniform1f(this.uLoc.freqAmp, p.frequencyAmplification || 1.0); 
        gl.uniform1f(this.uLoc.damp, p.damping);
        gl.uniform1f(this.uLoc.depth, p.depth);
        gl.uniform1f(this.uLoc.diam, p.diameter);
        gl.uniform1f(this.uLoc.dens, p.liquidDensity || 1.0); 
        gl.uniform1f(this.uLoc.cHeight, p.cameraHeight);
        gl.uniform1f(this.uLoc.calK, p.calibrationKFactor || 1.0);
        gl.uniform1f(this.uLoc.calMode, p.calibrationModeOffset || 0.0);

        let shapeInt = 0;
        if (p.containerShape === 'square') shapeInt = 1;
        if (p.containerShape === 'triangle') shapeInt = 2;
        if (p.containerShape === 'hexagon') shapeInt = 3;
        gl.uniform1i(this.uLoc.shape, shapeInt);
        
        const containerRadius = p.diameter / 2.0;

        const lC1 = hexToRgb(p.ledColor);
        gl.uniform3f(this.uLoc.lCol, lC1[0], lC1[1], lC1[2]);
        gl.uniform1f(this.uLoc.lSize, p.ledSize);
        gl.uniform1f(this.uLoc.lHeight, p.ledHeight);
        gl.uniform1f(this.uLoc.lRad, p.ledRadius / containerRadius);
        gl.uniform1f(this.uLoc.lSpread, p.ledSpread);
        gl.uniform1f(this.uLoc.lIntensity, p.ledIntensity);
        gl.uniform1f(this.uLoc.lCount, p.ledCount);

        const lC2 = hexToRgb(p.led2Color);
        gl.uniform3f(this.uLoc.l2Col, lC2[0], lC2[1], lC2[2]);
        gl.uniform1f(this.uLoc.l2Size, p.led2Size);
        gl.uniform1f(this.uLoc.l2Height, p.led2Height);
        gl.uniform1f(this.uLoc.l2Rad, p.led2Radius / containerRadius);
        gl.uniform1f(this.uLoc.l2Spread, p.led2Spread);
        gl.uniform1f(this.uLoc.l2Intensity, p.led2Intensity);
        gl.uniform1f(this.uLoc.l2Count, p.led2Count);

        const lC3 = hexToRgb(p.led3Color);
        gl.uniform3f(this.uLoc.l3Col, lC3[0], lC3[1], lC3[2]);
        gl.uniform1f(this.uLoc.l3Size, p.led3Size);
        gl.uniform1f(this.uLoc.l3Height, p.led3Height);
        gl.uniform1f(this.uLoc.l3Rad, p.led3Radius / containerRadius);
        gl.uniform1f(this.uLoc.l3Spread, p.led3Spread);
        gl.uniform1f(this.uLoc.l3Intensity, p.led3Intensity);
        gl.uniform1f(this.uLoc.l3Count, p.led3Count);
        
        const wC = hexToRgb(p.liquidColor);
        gl.uniform3f(this.uLoc.wCol, wC[0], wC[1], wC[2]);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    dispose() {
        this.gl.deleteProgram(this.program);
        this.gl.deleteBuffer(this.buffer);
        const ext = this.gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
    }
}

export const CymaticSimulation = forwardRef<SimulationHandle, Props>(({ params, isPlaying }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  
  const paramsRef = useRef(params);
  const isPlayingRef = useRef(isPlaying);
  const timeRef = useRef(0);
  const animIdRef = useRef<number>(0);

  // ZOOM STATE
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [zoomCenter, setZoomCenter] = useState({x: 0, y: 0});
  const zoomLevelRef = useRef(1.0);
  const zoomCenterRef = useRef({x: 0, y: 0});

  useLayoutEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useLayoutEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useLayoutEffect(() => {
    zoomLevelRef.current = zoomLevel;
    zoomCenterRef.current = zoomCenter;
  }, [zoomLevel, zoomCenter]);

  // Click Handler for Zoom
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (zoomLevelRef.current > 1.0) {
        // Reset Zoom
        setZoomLevel(1.0);
        setZoomCenter({x: 0, y: 0});
    } else {
        // Zoom In
        const rect = canvasRef.current!.getBoundingClientRect();
        
        // Calculate coordinates centered around 0,0 relative to min dimension (normalized)
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const minDim = Math.min(rect.width, rect.height);
        
        // Coordinate system matching the shader's UV logic
        // Center X, Y relative to center of canvas
        const cx = x - rect.width * 0.5;
        const cy = (rect.height - y) - rect.height * 0.5; // Flip Y because fragCoord y is bottom-up
        
        // Normalize by min dimension
        const u = cx / minDim;
        const v = cy / minDim;
        
        // Apply 2.3 scale factor from shader
        const targetX = u * 2.3;
        const targetY = v * 2.3;
        
        setZoomCenter({x: targetX, y: targetY});
        setZoomLevel(2.5);
    }
  };

  // Initialize Main Renderer
  useEffect(() => {
    if (!canvasRef.current) return;
    try {
        rendererRef.current = new Renderer(canvasRef.current);
    } catch (e) {
        console.error(e);
    }
    
    return () => {
        if (rendererRef.current) {
            rendererRef.current.dispose();
            rendererRef.current = null;
        }
    };
  }, []);

  // Animation Loop
  useEffect(() => {
    let lastFrameTime = performance.now();
    let isMounted = true;

    const loop = (now: number) => {
        if (!isMounted) return;
        
        let dt = (now - lastFrameTime) * 0.001;
        if (dt > 0.1) dt = 0.1;
        lastFrameTime = now;

        if (isPlayingRef.current) {
            timeRef.current += dt * paramsRef.current.simulationSpeed;
        }

        if (canvasRef.current && rendererRef.current) {
            const w = canvasRef.current.clientWidth;
            const h = canvasRef.current.clientHeight;
            if (canvasRef.current.width !== w || canvasRef.current.height !== h) {
                canvasRef.current.width = w;
                canvasRef.current.height = h;
            }
            
            // Draw Main Scene
            if (isPlayingRef.current || paramsRef.current.exportFrameStack <= 1) {
               rendererRef.current.render(
                   paramsRef.current, 
                   timeRef.current, 
                   w, h, 
                   zoomLevelRef.current, 
                   zoomCenterRef.current
               );
            }
        }
        
        animIdRef.current = requestAnimationFrame(loop);
    };

    animIdRef.current = requestAnimationFrame(loop);

    return () => {
        isMounted = false;
        cancelAnimationFrame(animIdRef.current);
    };
  }, []);

  // Real-time Preview Overlay Logic
  useEffect(() => {
    const overlayCanvas = overlayRef.current;
    const renderer = rendererRef.current;
    const glCanvas = canvasRef.current;

    if (!overlayCanvas || !renderer || !glCanvas) return;
    
    if (isPlaying || params.exportFrameStack <= 1) {
        overlayCanvas.style.opacity = '0';
        // Ensure WebGL shows current frame
        renderer.render(paramsRef.current, timeRef.current, glCanvas.width, glCanvas.height, zoomLevel, zoomCenter);
        return;
    }

    // Only if paused and stack > 1
    if (overlayCanvas.width !== glCanvas.width || overlayCanvas.height !== glCanvas.height) {
        overlayCanvas.width = glCanvas.width;
        overlayCanvas.height = glCanvas.height;
    }

    const ctx = overlayCanvas.getContext('2d');
    if (!ctx) return;

    overlayCanvas.style.opacity = '1';
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    ctx.globalCompositeOperation = 'screen';

    const dt = 0.016; 
    const stack = params.exportFrameStack;

    for (let i = 0; i < stack; i++) {
        const t = timeRef.current + (i * dt * paramsRef.current.simulationSpeed);
        renderer.render(paramsRef.current, t, glCanvas.width, glCanvas.height, zoomLevel, zoomCenter);
        ctx.drawImage(glCanvas, 0, 0);
    }
    
    // Restore visual state of main canvas
    renderer.render(paramsRef.current, timeRef.current, glCanvas.width, glCanvas.height, zoomLevel, zoomCenter);

  }, [params, isPlaying, zoomLevel, zoomCenter]);

  // EXPORT LOGIC WITH ISOLATED RENDERER
  useImperativeHandle(ref, () => ({
    triggerDownload: () => {
        // Pause main loop implicitly by acting on a separate thread equivalent
        const hdWidth = 3840;
        const hdHeight = 3840;

        // 1. Create fresh canvas and renderer for export
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = hdWidth;
        exportCanvas.height = hdHeight;
        
        let exportRenderer: Renderer | null = null;
        try {
            exportRenderer = new Renderer(exportCanvas);
        } catch (e) {
            console.error("Export init failed", e);
            alert("Could not initialize HD export.");
            return;
        }

        // 2. Composite on 2D canvas
        const compCanvas = document.createElement('canvas');
        compCanvas.width = hdWidth;
        compCanvas.height = hdHeight;
        const ctx = compCanvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, hdWidth, hdHeight);
        ctx.globalCompositeOperation = 'screen';

        const frameCount = paramsRef.current.exportFrameStack || 1;
        const dt = 0.016;
        
        // 3. Render Stack
        // Note: We always export at 1.0 zoom level (Full View)
        for (let i = 0; i < frameCount; i++) {
            const t = timeRef.current + (i * dt * paramsRef.current.simulationSpeed);
            exportRenderer.render(paramsRef.current, t, hdWidth, hdHeight, 1.0, {x:0, y:0});
            ctx.drawImage(exportCanvas, 0, 0);
        }

        // 4. Watermark
        ctx.globalCompositeOperation = 'source-over';
        const fontSize = 90;
        const bottomMargin = 130;
        ctx.font = `300 ${fontSize}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
        const text1 = "CYMATICS";
        const metrics1 = ctx.measureText(text1);
        ctx.font = `bold ${fontSize}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
        const text2 = "STUDIO LAB"; 
        const metrics2 = ctx.measureText(text2);
        const gap = 25;
        const totalWidth = metrics1.width + gap + metrics2.width;
        let currentX = (hdWidth - totalWidth) / 2;
        ctx.font = `300 ${fontSize}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(text1, currentX, hdHeight - bottomMargin);
        currentX += metrics1.width + gap;
        ctx.font = `bold ${fontSize}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
        ctx.fillStyle = '#3b82f6';
        ctx.fillText(text2, currentX, hdHeight - bottomMargin);

        // 5. Download
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `cymatics_SQ_${frameCount}x_stack_${timestamp}.png`;
        link.href = compCanvas.toDataURL('image/png');
        link.click();

        // 6. Cleanup
        exportRenderer.dispose();
        exportCanvas.remove();
        compCanvas.remove();
    }
  }));

  return (
    <div className="relative w-full h-full">
        <canvas 
            ref={canvasRef} 
            className={`absolute top-0 left-0 w-full h-full block ${zoomLevel > 1.0 ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            onClick={handleCanvasClick}
        />
        <canvas ref={overlayRef} className="absolute top-0 left-0 w-full h-full block pointer-events-none opacity-0 transition-opacity duration-200" />
    </div>
  );
});
