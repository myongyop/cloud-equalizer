# Cloud Equalizer 🎵☁️

> 소리에 반응하는 3D 구름 이퀄라이저 - 음악과 함께 춤추는 구름들을 경험해보세요!

![Cloud Equalizer Screenshot](./screen.png)

**React.js**, **Three.js**, **WebGL**을 사용하여 실시간 오디오 시각화를 구현한 인터랙티브 웹 애플리케이션입니다.

## ✨ 주요 기능

- 🎤 **실시간 마이크 입력** - 마이크를 통한 실시간 오디오 분석
- ☁️ **3D 볼류메트릭 구름** - 현실적인 3D 구름 렌더링
- 🎵 **주파수별 반응** - 베이스와 트레블에 따른 다른 시각 효과
- 🌈 **오디오 반응형 색상** - 소리에 따라 변화하는 구름 색상
- 💻 **실시간 코드 스크롤** - 오른쪽에 프로젝트 코드가 스크롤되는 사이버펑크 효과
- 🖼️ **커스텀 배경** - veo.png 배경 이미지 지원
- 🎮 **인터랙티브 카메라** - 마우스로 3D 뷰 조작 가능

## 🚀 빠른 시작

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/cloud-equalizer.git
cd cloud-equalizer

# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

### 사용법

1. **🎤 마이크 아이콘 클릭** - 오른쪽 상단의 마이크 버튼을 클릭
2. **권한 허용** - 브라우저에서 마이크 접근 권한을 허용
3. **음악 재생** - 음악을 재생하거나 소리를 내면 구름이 반응합니다
4. **카메라 조작** - 마우스 드래그로 3D 뷰를 회전시킬 수 있습니다

## 🎨 스크린샷

![Cloud Equalizer in Action](./screen.png)

*실시간으로 음악에 반응하는 3D 구름들과 사이버펑크 스타일의 코드 스크롤러*

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