
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle, useLayoutEffect } from 'react';
import { SimulationParams } from '../types.ts';

interface Props {
  params: SimulationParams;
  isPlaying: boolean;
}

export interface SimulationHandle {
  triggerDownload: () => void;
}

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
  
  // Physics params
  uniform float u_frequency;
  uniform float u_amplitude;
  uniform float u_damping;
  uniform float u_depth;
  uniform float u_diameter;
  uniform int u_shape; // 0=Circle, 1=Square, 2=Triangle, 3=Hexagon
  
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

  #define PI 3.14159265359
  
  // --- PHYSICS ENGINE 7.0: SHAPE-AWARE WAVES ---

  // Distance Metric Function for Shapes (Normalized 0-1 roughly)
  // Returns 1.0 at the edge boundary
  float getShapeDist(vec2 p) {
      // Circle
      if (u_shape == 0) return length(p);
      
      // Square
      if (u_shape == 1) return max(abs(p.x), abs(p.y));
      
      // Triangle (Equilateral pointing up)
      if (u_shape == 2) {
          // Scale to roughly match size of other shapes
          p *= 1.2; 
          const float k = sqrt(3.0);
          p.x = abs(p.x) - 1.0;
          p.y = p.y + 1.0/k;
          if( p.x+k*p.y > 0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
          p.x -= clamp( p.x, -2.0, 0.0 );
          return -length(p)*sign(p.y) * 2.0 + 1.0; 
      }

      // Hexagon (Flat topped)
      if (u_shape == 3) {
          vec2 q = abs(p);
          return max(q.y, q.x*0.866025 + q.y*0.5);
      }

      return length(p);
  }

  // Pseudo-random hash
  float hash(float n) {
      return fract(sin(n) * 43758.5453123);
  }

  // Faraday Wave Mode Selection based on Shape
  float getModeFromHash(float h, float freq) {
      float val = h * 10.0;
      
      // Shape specific mode biasing
      if (u_shape == 1) { // Square
         if (val < 5.0) return 2.0; // Simple grid
         return 4.0; // Complex grid
      }
      if (u_shape == 2 || u_shape == 3) { // Tri/Hex
         return 3.0; // 3-axis symmetry is natural
      }

      // Circle logic
      if (freq < 15.0) {
         if (val < 5.0) return 4.0; 
         return 3.0; 
      }
      if (val < 4.0) return 6.0; 
      if (val < 7.0) return 4.0; 
      if (val < 8.0) return 12.0; 
      if (val < 9.0) return 8.0; 
      return 3.0; 
  }

  // CAPILLARY DISPERSION RELATION + DEPTH EFFECT
  float getWavenumber(float freq) {
      float k_phys = pow(freq, 0.6666); 
      float depthFactor = 1.0 + (1.5 / sqrt(u_depth + 0.1));
      return k_phys * u_diameter * 0.18 * depthFactor; 
  }

  // SHAPE-AWARE Standing Wave Calculation
  float calculateStandingWave(vec2 p, float k, float t, float N, float seed) {
      
      // --- CIRCLE: Radial Standing Waves ---
      if (u_shape == 0) {
          float h = 0.0;
          float staticRot = 0.0; 
          for(float i = 0.0; i < 12.0; i++) {
              if(i >= N) break;
              float angle = staticRot + (i / N) * PI; 
              vec2 dir = vec2(cos(angle), sin(angle));
              float spatial = dot(p, dir) * k;
              h += cos(spatial) * cos(t);
          }
          return h / N;
      }

      // --- SQUARE: Cartesian Grid (Rectilinear) ---
      if (u_shape == 1) {
          // Add a slight rotation based on seed to create variety, 
          // but mostly aligned to axes
          float rot = floor(seed) * (PI * 0.25); 
          float c = cos(rot);
          float s = sin(rot);
          vec2 pRot = vec2(p.x*c - p.y*s, p.x*s + p.y*c);
          
          // Interference of X and Y planar waves
          float wx = cos(pRot.x * k * 0.7) * cos(t); // 0.7 scale to fit box better
          float wy = cos(pRot.y * k * 0.7) * cos(t);
          
          // Mix between pure grid and diagonal interference
          float mixFactor = fract(seed * 0.1);
          if (mixFactor > 0.5) return (wx + wy) * 0.5;
          return wx * wy; // Chladni-like product
      }

      // --- TRIANGLE / HEXAGON: 3-Axis Grid ---
      if (u_shape == 2 || u_shape == 3) {
          float h = 0.0;
          // 3 axes separated by 120 degrees (2PI/3)
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
      // Hard wall boundary
      if (shapeDist > 1.0) return 0.0;
      
      // IF FREQUENCY IS ZERO, LIQUID IS FLAT
      if (u_frequency < 0.1) return 0.0;

      // Mode Hopping Logic
      float effectiveFreq = u_frequency + (u_depth * 0.7); 
      float stabilityScale = 0.5; 
      float f_scaled = effectiveFreq * stabilityScale;
      
      float f_index = floor(f_scaled);
      float f_fract = smoothstep(0.4, 0.6, fract(f_scaled)); 
      
      float seedA = f_index * 12.34;
      float nA = getModeFromHash(hash(seedA), u_frequency);
      
      float seedB = (f_index + 1.0) * 12.34;
      float nB = getModeFromHash(hash(seedB), u_frequency);

      float k = getWavenumber(u_frequency);
      
      // Base vibration speed
      float w = u_time * u_frequency * 1.5;

      // 1. MAIN WAVE STRUCTURE
      float hA = calculateStandingWave(p, k, w, nA, seedA);
      float hB = calculateStandingWave(p, k, w, nB, seedB);
      float mainWave = mix(hA, hB, f_fract);

      // 2. MICRO-RESONANCE (Harmonics)
      float k_micro = k * 3.0; 
      float w_micro = w * 1.2; 
      
      // Harmonics always use radial logic for texture or matched shape logic?
      // Let's stick to radial for harmonics to add organic noise
      float hMicroA = calculateStandingWave(p, k_micro, w_micro, 12.0, seedA + 33.1);
      float hMicroB = calculateStandingWave(p, k_micro, w_micro, 12.0, seedB + 33.1);
      float microWave = mix(hMicroA, hMicroB, f_fract);

      // Combine
      float rawHeight = mainWave + (microWave * 0.2);

      // Physical Damping based on SHAPE DISTANCE
      // This ensures waves die out as they hit the specific shape wall
      float bottomFriction = 1.0 + (1.0 / (u_depth + 0.1));
      
      // Boundary Envelope: Force wave to 0 exactly at the wall (d=1.0)
      // This creates the "contained" look
      float boundaryEnvelope = smoothstep(1.0, 0.90, shapeDist);
      
      float damping = 1.0 - (u_damping * 0.5 * shapeDist * shapeDist * bottomFriction);
      
      // Trochoidal Wave Shaping (Peaking)
      float sharp = exp(1.8 * (rawHeight - 0.2));
      
      // Static Meniscus based on shape boundary
      float staticMeniscus = smoothstep(0.95, 1.0, shapeDist) * 0.2;

      return ((sharp - 0.5) * u_amplitude * damping * boundaryEnvelope) + staticMeniscus;
  }

  vec3 getNormal(vec2 p, float h, float shapeDist) {
      vec2 e = vec2(0.001, 0.0);
      float hx = getSurfaceHeight(p + e.xy, shapeDist); 
      float hy = getSurfaceHeight(p + e.yx, shapeDist);
      return normalize(vec3(h - hx, h - hy, e.x * 0.8));
  }

  // Generalized function for any ring with specific DOT SIZE
  float getLedRing(vec3 ro, vec3 rd, float ringRadius, float ringHeight, float dotSizeParam, float spreadParam, float intensityParam, float countParam) {
      if (abs(rd.z) < 0.001) return 0.0; 
      float t = (ringHeight - ro.z) / rd.z;
      if (t < 0.0) return 0.0; 
      
      vec3 hit = ro + rd * t;
      float r = length(hit.xy);
      
      float distToRing = abs(r - ringRadius);
      
      float decay = 40.0 / max(0.01, spreadParam); 
      float glow = exp(-distToRing * decay); 
      
      float angle = atan(hit.y, hit.x);
      float ledPhase = (angle / (2.0 * PI)) * countParam;
      float ledLocal = fract(ledPhase);
      
      float dotSize = dotSizeParam * 0.5; 
      float dot = smoothstep(dotSize + 0.1, dotSize, abs(ledLocal - 0.5));
      
      float continuity = smoothstep(48.0, 120.0, countParam);
      
      return glow * mix(dot, 1.0, continuity) * intensityParam * step(distToRing, 0.15 * spreadParam);
  }

  void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
      uv *= 2.0; 

      float d = getShapeDist(uv);

      // Hard Physical Clip at Container Edge
      if (d > 1.0) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
          return;
      }

      float h = getSurfaceHeight(uv, d);
      vec3 pos = vec3(uv, h * 0.15); 
      vec3 norm = getNormal(uv, h, d);

      vec3 camPos = vec3(0.0, 0.0, u_camHeight);
      vec3 viewDir = normalize(pos - camPos);
      vec3 reflDir = reflect(viewDir, norm);
      
      // Chromatic Aberration setup
      vec3 dirR = normalize(reflDir + vec3(0.004, 0.0, 0.0));
      vec3 dirG = reflDir;
      vec3 dirB = normalize(reflDir - vec3(0.004, 0.0, 0.0));

      // Ring 1 Calculations
      float r1 = getLedRing(pos, dirR, u_ledRadius, u_ledHeight, u_ledSize, u_ledSpread, u_ledIntensity, u_ledCount1);
      float g1 = getLedRing(pos, dirG, u_ledRadius, u_ledHeight, u_ledSize, u_ledSpread, u_ledIntensity, u_ledCount1);
      float b1 = getLedRing(pos, dirB, u_ledRadius, u_ledHeight, u_ledSize, u_ledSpread, u_ledIntensity, u_ledCount1);
      vec3 col1 = vec3(r1, g1, b1) * u_ledColor;

      // Ring 2 Calculations
      float r2 = getLedRing(pos, dirR, u_led2Radius, u_led2Height, u_led2Size, u_led2Spread, u_led2Intensity, u_ledCount2);
      float g2 = getLedRing(pos, dirG, u_led2Radius, u_led2Height, u_led2Size, u_led2Spread, u_led2Intensity, u_ledCount2);
      float b2 = getLedRing(pos, dirB, u_led2Radius, u_led2Height, u_led2Size, u_led2Spread, u_led2Intensity, u_ledCount2);
      vec3 col2 = vec3(r2, g2, b2) * u_led2Color;

      vec3 reflection = col1 + col2;
      
      // Mask reflections near edge using Shape Distance
      // This is critical: visual fade out just before the wall
      float reflectionMask = smoothstep(0.98, 0.92, d);
      reflection *= reflectionMask;

      // Opaque Liquid Shading (Black Mirror)
      float fresnel = pow(1.0 - max(0.0, dot(viewDir, norm)), 3.0);
      vec3 baseColor = u_liquidColor * 0.05; 

      vec3 finalColor = mix(baseColor, u_liquidColor, fresnel * 0.3) + reflection;

      gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const CymaticSimulation = forwardRef<SimulationHandle, Props>(({ params, isPlaying }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  
  const paramsRef = useRef(params);
  const isPlayingRef = useRef(isPlaying);
  const timeRef = useRef(0);
  const drawSceneRef = useRef<((time: number) => void) | null>(null);

  useLayoutEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useLayoutEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Real-time Preview Effect for Frame Stacking
  useEffect(() => {
    const glCanvas = canvasRef.current;
    const overlayCanvas = overlayRef.current;
    const drawScene = drawSceneRef.current;

    if (isPlaying || !glCanvas || !overlayCanvas || !drawScene) {
        if (overlayCanvas) overlayCanvas.style.opacity = '0';
        if (!isPlaying && drawScene) drawScene(timeRef.current);
        return;
    }

    const stack = params.exportFrameStack;
    if (stack <= 1) {
        overlayCanvas.style.opacity = '0';
        drawScene(timeRef.current);
        return;
    }

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

    for (let i = 0; i < stack; i++) {
        const t = timeRef.current + (i * dt);
        drawScene(t);
        ctx.drawImage(glCanvas, 0, 0);
    }
    drawScene(timeRef.current);

  }, [params, isPlaying]); 

  useImperativeHandle(ref, () => ({
    triggerDownload: () => {
      const canvas = canvasRef.current;
      const drawScene = drawSceneRef.current;
      if (canvas && drawScene) {
        const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
        if(!gl) return;

        const originalWidth = canvas.width;
        const originalHeight = canvas.height;
        
        // FORCE SQUARE OUTPUT FOR EXPORT
        const hdWidth = 3840;
        const hdHeight = 3840; // 1:1 Aspect Ratio
        
        canvas.width = hdWidth;
        canvas.height = hdHeight;
        gl.viewport(0, 0, hdWidth, hdHeight);
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = hdWidth;
        tempCanvas.height = hdHeight;
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, hdWidth, hdHeight);
        ctx.globalCompositeOperation = 'screen';

        const frameCount = paramsRef.current.exportFrameStack || 1;
        const dt = 0.016; 
        
        for (let i = 0; i < frameCount; i++) {
          const t = timeRef.current + (i * dt);
          drawScene(t);
          ctx.drawImage(canvas, 0, 0);
        }

        // --- WATERMARK ADDITION ---
        ctx.globalCompositeOperation = 'source-over';
        
        // Settings for 4K image
        const fontSize = 90;
        const bottomMargin = 130;
        
        ctx.font = `300 ${fontSize}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
        const text1 = "CYMATICS";
        const metrics1 = ctx.measureText(text1);

        ctx.font = `bold ${fontSize}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
        const text2 = "LED";
        const metrics2 = ctx.measureText(text2);
        
        const gap = 25;
        const totalWidth = metrics1.width + gap + metrics2.width;
        let currentX = (hdWidth - totalWidth) / 2;

        // Draw CYMATICS (Light White)
        ctx.font = `300 ${fontSize}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(text1, currentX, hdHeight - bottomMargin);

        // Draw LED (Bold Blue)
        currentX += metrics1.width + gap;
        ctx.font = `bold ${fontSize}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
        ctx.fillStyle = '#3b82f6'; // Matches Tailwind blue-500
        ctx.fillText(text2, currentX, hdHeight - bottomMargin);
        // --------------------------

        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `cymatics_SQ_${frameCount}x_stack_${timestamp}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
        
        canvas.width = originalWidth;
        canvas.height = originalHeight;
        gl.viewport(0, 0, originalWidth, originalHeight);
        drawScene(timeRef.current);
      }
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
    if (!gl) {
      setError("WebGL non supportato.");
      return;
    }

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
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

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      setError("Errore compilazione shader.");
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setError("Errore link programma.");
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
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

    const uLoc = {
      res: gl.getUniformLocation(program, "u_resolution"),
      time: gl.getUniformLocation(program, "u_time"),
      freq: gl.getUniformLocation(program, "u_frequency"),
      amp: gl.getUniformLocation(program, "u_amplitude"),
      damp: gl.getUniformLocation(program, "u_damping"),
      depth: gl.getUniformLocation(program, "u_depth"),
      diam: gl.getUniformLocation(program, "u_diameter"),
      shape: gl.getUniformLocation(program, "u_shape"), 

      cHeight: gl.getUniformLocation(program, "u_camHeight"),
      wCol: gl.getUniformLocation(program, "u_liquidColor"),

      // Ring 1 Specifics
      lCol: gl.getUniformLocation(program, "u_ledColor"),
      lSize: gl.getUniformLocation(program, "u_ledSize"),
      lHeight: gl.getUniformLocation(program, "u_ledHeight"),
      lRad: gl.getUniformLocation(program, "u_ledRadius"),
      lSpread: gl.getUniformLocation(program, "u_ledSpread"),
      lIntensity: gl.getUniformLocation(program, "u_ledIntensity"),
      lCount: gl.getUniformLocation(program, "u_ledCount1"),
      
      // Ring 2 Specifics
      l2Col: gl.getUniformLocation(program, "u_led2Color"),
      l2Size: gl.getUniformLocation(program, "u_led2Size"),
      l2Height: gl.getUniformLocation(program, "u_led2Height"),
      l2Rad: gl.getUniformLocation(program, "u_led2Radius"),
      l2Spread: gl.getUniformLocation(program, "u_led2Spread"),
      l2Intensity: gl.getUniformLocation(program, "u_led2Intensity"),
      l2Count: gl.getUniformLocation(program, "u_ledCount2"),
    };

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
      ] : [1, 1, 1];
    };

    const drawScene = (currentTime: number) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      
      const p = paramsRef.current;

      gl.uniform2f(uLoc.res, canvas.width, canvas.height);
      gl.uniform1f(uLoc.time, currentTime);
      gl.uniform1f(uLoc.freq, p.frequency);
      gl.uniform1f(uLoc.amp, p.amplitude);
      gl.uniform1f(uLoc.damp, p.damping);
      gl.uniform1f(uLoc.depth, p.depth);
      gl.uniform1f(uLoc.diam, p.diameter);
      gl.uniform1f(uLoc.cHeight, p.cameraHeight);

      let shapeInt = 0;
      if (p.containerShape === 'square') shapeInt = 1;
      if (p.containerShape === 'triangle') shapeInt = 2;
      if (p.containerShape === 'hexagon') shapeInt = 3;
      gl.uniform1i(uLoc.shape, shapeInt);
      
      const containerRadius = p.diameter / 2.0;

      // RING 1 UNIFORMS
      const lC1 = hexToRgb(p.ledColor);
      gl.uniform3f(uLoc.lCol, lC1[0], lC1[1], lC1[2]);
      gl.uniform1f(uLoc.lSize, p.ledSize);
      gl.uniform1f(uLoc.lHeight, p.ledHeight);
      gl.uniform1f(uLoc.lRad, p.ledRadius / containerRadius);
      gl.uniform1f(uLoc.lSpread, p.ledSpread);
      gl.uniform1f(uLoc.lIntensity, p.ledIntensity);
      gl.uniform1f(uLoc.lCount, p.ledCount);

      // RING 2 UNIFORMS
      const lC2 = hexToRgb(p.led2Color);
      gl.uniform3f(uLoc.l2Col, lC2[0], lC2[1], lC2[2]);
      gl.uniform1f(uLoc.l2Size, p.led2Size);
      gl.uniform1f(uLoc.l2Height, p.led2Height);
      gl.uniform1f(uLoc.l2Rad, p.led2Radius / containerRadius);
      gl.uniform1f(uLoc.l2Spread, p.led2Spread);
      gl.uniform1f(uLoc.l2Intensity, p.led2Intensity);
      gl.uniform1f(uLoc.l2Count, p.led2Count);
      
      const wC = hexToRgb(p.liquidColor);
      gl.uniform3f(uLoc.wCol, wC[0], wC[1], wC[2]);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    drawSceneRef.current = drawScene;

    let animId: number;
    let lastFrameTime = performance.now();
    let isMounted = true;

    const renderLoop = (now: number) => {
      if (!isMounted) return;
      if (!canvas) return;
      
      let dt = (now - lastFrameTime) * 0.001;
      if (dt > 0.1) dt = 0.1; 
      
      lastFrameTime = now;

      if (isPlayingRef.current) {
        timeRef.current += dt * paramsRef.current.simulationSpeed;
      }

      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      if (isPlayingRef.current || paramsRef.current.exportFrameStack <= 1) {
         drawScene(timeRef.current);
      }

      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop(lastFrameTime);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animId);
      if (program) gl.deleteProgram(program);
    };
  }, []); 

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="relative w-full h-full">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full block" />
        <canvas ref={overlayRef} className="absolute top-0 left-0 w-full h-full block pointer-events-none opacity-0 transition-opacity duration-200" />
    </div>
  );
});
