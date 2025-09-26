import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const CameraControls = () => {
  const { camera, gl } = useThree();
  const isMouseDown = useRef(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  const cameraRotation = useRef({ x: 0, y: 0 });

  useFrame(() => {
    // 자동 회전
    cameraRotation.current.y += 0.005;
    
    const radius = 5;
    camera.position.x = Math.sin(cameraRotation.current.y) * Math.cos(cameraRotation.current.x) * radius;
    camera.position.y = Math.sin(cameraRotation.current.x) * radius;
    camera.position.z = Math.cos(cameraRotation.current.y) * Math.cos(cameraRotation.current.x) * radius;
    
    camera.lookAt(0, 0, 0);
  });

  // 마우스 이벤트 핸들러
  const handleMouseDown = (event) => {
    isMouseDown.current = true;
    mousePosition.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseMove = (event) => {
    if (!isMouseDown.current) return;
    
    const deltaX = event.clientX - mousePosition.current.x;
    const deltaY = event.clientY - mousePosition.current.y;
    
    cameraRotation.current.y += deltaX * 0.01;
    cameraRotation.current.x += deltaY * 0.01;
    
    // X축 회전 제한
    cameraRotation.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.current.x));
    
    mousePosition.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
  };

  // 이벤트 리스너 등록
  if (typeof window !== 'undefined') {
    gl.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  return null;
};

export default CameraControls;