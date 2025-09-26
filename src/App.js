import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CloudEqualizer from './components/CloudEqualizer';
import AudioController from './components/AudioController';
import CameraControls from './components/CameraControls';
import './App.css';

function App() {
  return (
    <div className="App">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        
        {/* 현실적인 구름 조명 설정 */}
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
        
        {/* 배경 조명 (하늘빛) */}
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
}

export default App;