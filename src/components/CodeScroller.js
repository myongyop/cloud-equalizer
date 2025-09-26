import { useState, useEffect } from 'react';
import './CodeScroller.css';

const CodeScroller = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 프로젝트의 실제 코드들
  const codeSnippets = [
    `// CloudEqualizer.js
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CloudEqualizer = () => {
  const groupRef = useRef();
  const timeRef = useRef(0);

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1.5, 32, 32);
    const positions = geo.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      const noise1 = Math.sin(x * 2 + y * 1.5) * Math.cos(z * 2.5) * 0.2;
      const noise2 = Math.sin(x * 4 + z * 3) * Math.cos(y * 4) * 0.1;
      
      const totalNoise = noise1 + noise2;
      
      positions[i] = x * (1 + totalNoise);
      positions[i + 1] = y * (1 + totalNoise);
      positions[i + 2] = z * (1 + totalNoise);
    }

    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);`,

    `// Vertex Shader
uniform float time;
uniform float audioLevel;
uniform float bassLevel;
uniform float trebleLevel;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying float vAudioInfluence;

void main() {
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  vUv = uv;
  
  float heightFactor = (position.y + 1.5) / 3.0;
  float audioInfluence = audioLevel * 0.3;
  float bassInfluence = bassLevel * 0.4 * (1.0 - heightFactor);
  float trebleInfluence = trebleLevel * 0.2 * heightFactor;
  
  vAudioInfluence = audioInfluence + bassInfluence + trebleInfluence;
  
  float wave1 = sin(time * 1.5 + position.x * 3.0 + position.y * 2.0) * 0.05;
  float wave2 = cos(time * 2.0 + position.z * 2.5 + position.x * 1.8) * 0.03;
  
  vec3 newPosition = position + normal * (vAudioInfluence + wave1 + wave2);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}`,

    `// Fragment Shader
uniform float time;
uniform float audioLevel;
uniform float bassLevel;
uniform float trebleLevel;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying float vAudioInfluence;

void main() {
  float noise = sin(vPosition.x * 8.0 + time * 0.5) * 
                cos(vPosition.y * 6.0 + time * 0.3) * 
                sin(vPosition.z * 10.0 + time * 0.4);
  noise = (noise + 1.0) * 0.5;
  
  vec3 viewDirection = normalize(cameraPosition - vPosition);
  float fresnel = 1.0 - max(0.0, dot(viewDirection, normalize(vNormal)));
  fresnel = pow(fresnel, 2.0);
  
  vec3 baseColor = vec3(1.0, 1.0, 1.0);
  vec3 shadowColor = vec3(0.7, 0.75, 0.8);
  
  vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
  float NdotL = max(0.0, dot(normalize(vNormal), lightDir));
  
  vec3 cloudColor = mix(shadowColor, baseColor, NdotL * 0.6 + 0.4);
  
  vec3 bassColor = vec3(0.8, 0.9, 1.0) * bassLevel * 0.5;
  vec3 trebleColor = vec3(1.0, 0.9, 0.8) * trebleLevel * 0.3;
  
  cloudColor += bassColor + trebleColor;
  
  float density = noise * (0.6 + vAudioInfluence * 0.4);
  float alpha = density * (0.4 + fresnel * 0.6);
  alpha = clamp(alpha, 0.2, 0.85);
  
  gl_FragColor = vec4(cloudColor, alpha);
}`,

    `// AudioController.js
import { useState, useEffect, useRef } from 'react';
import { audioStore } from '../store/audioStore';

const AudioController = () => {
  const [isListening, setIsListening] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);

  const startAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true 
      });
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const source = context.createMediaStreamSource(stream);
      const analyserNode = context.createAnalyser();
      
      analyserNode.fftSize = 256;
      analyserNode.smoothingTimeConstant = 0.8;
      
      source.connect(analyserNode);
      
      setAudioContext(context);
      setAnalyser(analyserNode);
      setIsListening(true);
      
      audioStore.setAnalyser(analyserNode);
      
    } catch (error) {
      console.error('마이크 접근 실패:', error);
    }
  };`,

    `// audioStore.js
class AudioStore {
  constructor() {
    this.analyser = null;
    this.frequencyData = new Uint8Array(128);
  }

  setAnalyser(analyser) {
    this.analyser = analyser;
  }

  getFrequencyData() {
    if (!this.analyser) return null;
    
    this.analyser.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
  }

  getAverageFrequency() {
    const data = this.getFrequencyData();
    if (!data) return 0;
    
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    return sum / data.length / 255;
  }

  getBassLevel() {
    const data = this.getFrequencyData();
    if (!data) return 0;
    
    let sum = 0;
    for (let i = 0; i < 32; i++) {
      sum += data[i];
    }
    return sum / 32 / 255;
  }

  getTrebleLevel() {
    const data = this.getFrequencyData();
    if (!data) return 0;
    
    let sum = 0;
    for (let i = 96; i < 128; i++) {
      sum += data[i];
    }
    return sum / 32 / 255;
  }
}

export const audioStore = new AudioStore();`,

    `// App.js
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CloudEqualizer from './components/CloudEqualizer';
import AudioController from './components/AudioController';
import CameraControls from './components/CameraControls';

function App() {
  return (
    <div className="App">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} color="#87CEEB" />
        <directionalLight 
          position={[5, 8, 3]} 
          intensity={1.2} 
          color="#FFF8DC"
          castShadow
        />
        <pointLight 
          position={[-3, 2, 4]} 
          intensity={0.6} 
          color="#E6E6FA" 
        />
        <hemisphereLight 
          skyColor="#87CEEB" 
          groundColor="#2F4F4F" 
          intensity={0.3} 
        />
        
        <Suspense fallback={null}>
          <CloudEqualizer />
        </Suspense>
        
        <CameraControls />
      </Canvas>
      
      <AudioController />
    </div>
  );
}`
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % codeSnippets.length);
    }, 4000); // 4초마다 코드 변경

    return () => clearInterval(interval);
  }, [codeSnippets.length]);

  return (
    <div className="code-scroller">
      <div className="code-content">
        <pre className="code-block">
          <code>{codeSnippets[currentIndex]}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeScroller;