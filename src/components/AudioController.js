import { useState, useEffect, useRef } from 'react';
import { audioStore } from '../store/audioStore';

const AudioController = () => {
  const [isListening, setIsListening] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const animationRef = useRef();

  const startAudioCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const source = context.createMediaStreamSource(stream);
      const analyserNode = context.createAnalyser();
      
      analyserNode.fftSize = 256;
      analyserNode.smoothingTimeConstant = 0.8;
      
      source.connect(analyserNode);
      
      setAudioContext(context);
      setAnalyser(analyserNode);
      setIsListening(true);
      
      // 오디오 스토어에 분석기 설정
      audioStore.setAnalyser(analyserNode);
      
    } catch (error) {
      console.error('마이크 접근 실패:', error);
      alert('마이크 접근이 필요합니다. 브라우저 설정을 확인해주세요.');
    }
  };

  const stopAudioCapture = () => {
    if (audioContext) {
      audioContext.close();
    }
    setIsListening(false);
    setAudioContext(null);
    setAnalyser(null);
    audioStore.setAnalyser(null);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const updateFrequencyData = () => {
    if (!analyser) return;
    
    // 오디오 스토어만 업데이트하고 UI 이퀄라이저는 제거
    animationRef.current = requestAnimationFrame(updateFrequencyData);
  };

  useEffect(() => {
    if (isListening && analyser) {
      updateFrequencyData();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, analyser]);

  return (
    <div className="audio-icon">
      <button 
        className={`mic-button ${isListening ? 'listening' : ''}`}
        onClick={isListening ? stopAudioCapture : startAudioCapture}
        title={isListening ? '마이크 정지' : '마이크 시작'}
      >
        {isListening ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14C10.9 14 10 13.1 10 12V4C10 2.9 10.9 2 12 2Z" fill="currentColor"/>
            <path d="M19 10V12C19 15.9 15.9 19 12 19C8.1 19 5 15.9 5 12V10H7V12C7 14.8 9.2 17 12 17C14.8 17 17 14.8 17 12V10H19Z" fill="currentColor"/>
            <path d="M10 21H14V23H10V21Z" fill="currentColor"/>
          </svg>
        )}
      </button>
    </div>
  );
};

export default AudioController;