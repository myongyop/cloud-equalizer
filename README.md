# Cloud Equalizer 🎵☁️

소리에 반응하는 3D 구름 이퀄라이저입니다. React.js, Three.js, WebGL을 사용하여 실시간 오디오 시각화를 구현했습니다.

## 기능

- 🎤 실시간 마이크 입력 분석
- ☁️ 3D 구름 형태의 시각화
- 🎵 주파수별 구름 변형
- 🌈 오디오 반응형 색상 변화
- 📊 하단 주파수 바 표시

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 사용법

1. "🎤 마이크 시작" 버튼을 클릭
2. 브라우저에서 마이크 접근 권한 허용
3. 음악을 재생하거나 소리를 내면 구름이 반응합니다
4. 마우스로 3D 뷰를 회전/확대/축소 가능

## 기술 스택

- **React.js** - UI 프레임워크
- **Three.js** - 3D 그래픽스
- **@react-three/fiber** - React Three.js 통합
- **@react-three/drei** - Three.js 헬퍼 컴포넌트
- **WebGL** - 하드웨어 가속 렌더링
- **Web Audio API** - 실시간 오디오 분석

## 주요 컴포넌트

- `CloudEqualizer` - 3D 구름 렌더링 및 오디오 반응
- `AudioController` - 마이크 입력 및 주파수 분석
- `audioStore` - 오디오 데이터 관리

## 브라우저 호환성

- Chrome, Firefox, Safari, Edge (최신 버전)
- HTTPS 환경에서 마이크 접근 가능
- WebGL 지원 필요