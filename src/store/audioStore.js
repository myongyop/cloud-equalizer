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
    return sum / data.length / 255; // 0-1 범위로 정규화
  }

  getBassLevel() {
    const data = this.getFrequencyData();
    if (!data) return 0;
    
    // 저주파 영역 (0-32)
    let sum = 0;
    for (let i = 0; i < 32; i++) {
      sum += data[i];
    }
    return sum / 32 / 255;
  }

  getTrebleLevel() {
    const data = this.getFrequencyData();
    if (!data) return 0;
    
    // 고주파 영역 (96-128)
    let sum = 0;
    for (let i = 96; i < 128; i++) {
      sum += data[i];
    }
    return sum / 32 / 255;
  }
}

export const audioStore = new AudioStore();