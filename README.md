# Cloud Equalizer 🎵☁️

> Audio-reactive 3D cloud equalizer - Experience clouds dancing with your music!

![Cloud Equalizer Screenshot](./screen.png)

An interactive web application that implements real-time audio visualization using **React.js**, **Three.js**, and **WebGL**.

## ✨ Key Features

- 🎤 **Real-time Microphone Input** - Live audio analysis through microphone
- ☁️ **3D Volumetric Clouds** - Realistic 3D cloud rendering
- 🎵 **Frequency-based Reactions** - Different visual effects for bass and treble
- 🌈 **Audio-reactive Colors** - Cloud colors that change with sound
- 💻 **Live Code Scrolling** - Cyberpunk-style code scroller on the right side
- 🖼️ **Custom Background** - Support for veo.png background image
- 🎮 **Interactive Camera** - Mouse-controlled 3D view manipulation

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/cloud-equalizer.git
cd cloud-equalizer

# Install dependencies
npm install

# Start development server
npm start
```

Open your browser and navigate to `http://localhost:3000`.

### Usage

1. **🎤 Click Microphone Icon** - Click the microphone button in the top-right corner
2. **Grant Permission** - Allow microphone access in your browser
3. **Play Music** - Play music or make sounds to see the clouds react
4. **Camera Control** - Drag with mouse to rotate the 3D view

## 🎨 Screenshots

![Cloud Equalizer in Action](./screen.png)

*3D clouds reacting to music in real-time with cyberpunk-style code scroller*

## 🛠️ Tech Stack

### Frontend
- **React.js** `^18.2.0` - UI Framework
- **Three.js** `^0.160.0` - 3D Graphics Library
- **@react-three/fiber** `^8.15.19` - React Three.js Integration
- **WebGL** - Hardware-accelerated Rendering

### Audio Processing
- **Web Audio API** - Real-time Audio Analysis
- **AudioContext** - Audio Context Management
- **AnalyserNode** - Frequency Analysis

### Shaders
- **GLSL** - Custom Vertex/Fragment Shaders
- **Volumetric Rendering** - Realistic Cloud Effects

## 📁 Project Structure

```
src/
├── components/
│   ├── CloudEqualizer.js    # 3D cloud rendering and audio reaction
│   ├── AudioController.js   # Microphone input and UI controls
│   ├── CameraControls.js    # 3D camera manipulation
│   ├── CodeScroller.js      # Real-time code scroller
│   └── CodeScroller.css     # Code scroller styles
├── store/
│   └── audioStore.js        # Audio data state management
├── App.js                   # Main application
├── App.css                  # Global styles
└── index.js                 # Entry point
```

## 🎯 Key Features

### 🌤️ Realistic Cloud Rendering
- Fractal noise-based cloud shape generation
- Custom GLSL shaders for volumetric effects
- Fresnel effects and subsurface scattering

### 🎵 Audio Reaction System
- Real-time FFT analysis (256 samples)
- Bass/treble frequency separation
- Height-based differential reactions (bass below, treble above)

### 💫 Visual Effects
- Cloud deformation based on audio levels
- Color changes (bass: blue light, treble: warm light)
- Smooth animations and rotations

### 🖥️ Cyberpunk UI
- Semi-transparent microphone control (pulse animation)
- Real-time code scroller (glitch effects)
- Custom background image support

## 🌐 Browser Compatibility

| Browser | Supported Version | Notes |
|---------|------------------|-------|
| Chrome | 80+ | ✅ Full Support |
| Firefox | 75+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 80+ | ✅ Full Support |

### Requirements
- **HTTPS Environment** - Required for microphone access
- **WebGL Support** - Required for 3D rendering
- **Web Audio API** - Required for audio analysis

## 🎮 Usage Tips

- **Optimal Experience**: Play music through headphones or speakers
- **Camera Control**: Drag with mouse to view clouds from different angles
- **Audio Quality**: Try different music genres to see various reactions
- **Performance**: Better experience with high-end graphics cards

## 📄 License

MIT License - Feel free to use, modify, and distribute.

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔧 Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App

### Performance Optimization

- Uses hardware-accelerated WebGL rendering
- Optimized shader code for smooth animations
- Efficient audio processing with minimal latency

## 🎨 Customization

### Background Image
Replace `public/veo.png` with your own background image.

### Cloud Colors
Modify the color values in `CloudEqualizer.js`:
```javascript
vec3 bassColor = vec3(0.8, 0.9, 1.0) * bassLevel * 0.5;
vec3 trebleColor = vec3(1.0, 0.9, 0.8) * trebleLevel * 0.3;
```

### Audio Sensitivity
Adjust audio reaction sensitivity in the shader uniforms:
```javascript
float audioInfluence = audioLevel * 0.3; // Increase for more sensitivity
```

---

**Made with ❤️ and ☁️ by [Your Name]**

*Experience clouds dancing with your music!*