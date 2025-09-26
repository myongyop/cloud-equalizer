import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audioStore } from '../store/audioStore';

const CloudEqualizer = () => {
    const groupRef = useRef();
    const timeRef = useRef(0);

    // 간단하고 안정적인 구름 지오메트리
    const geometry = useMemo(() => {
        const geo = new THREE.SphereGeometry(1.5, 32, 32);
        const positions = geo.attributes.position.array;

        // 구름 모양을 위한 노이즈 추가
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];

            // 구름 같은 불규칙한 형태
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
    }, []);

    // 간단하고 예쁜 구름 머티리얼
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                audioLevel: { value: 0 },
                bassLevel: { value: 0 },
                trebleLevel: { value: 0 }
            },
            vertexShader: `
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
                    
                    // 오디오 반응 계산
                    float heightFactor = (position.y + 1.5) / 3.0;
                    float audioInfluence = audioLevel * 0.3;
                    float bassInfluence = bassLevel * 0.4 * (1.0 - heightFactor);
                    float trebleInfluence = trebleLevel * 0.2 * heightFactor;
                    
                    vAudioInfluence = audioInfluence + bassInfluence + trebleInfluence;
                    
                    // 시간 기반 부드러운 움직임
                    float wave1 = sin(time * 1.5 + position.x * 3.0 + position.y * 2.0) * 0.05;
                    float wave2 = cos(time * 2.0 + position.z * 2.5 + position.x * 1.8) * 0.03;
                    
                    // 정점 변형
                    vec3 newPosition = position + normal * (vAudioInfluence + wave1 + wave2);
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float audioLevel;
                uniform float bassLevel;
                uniform float trebleLevel;
                
                varying vec3 vPosition;
                varying vec3 vNormal;
                varying vec2 vUv;
                varying float vAudioInfluence;
                
                void main() {
                    // 간단한 노이즈 함수
                    float noise = sin(vPosition.x * 8.0 + time * 0.5) * cos(vPosition.y * 6.0 + time * 0.3) * sin(vPosition.z * 10.0 + time * 0.4);
                    noise = (noise + 1.0) * 0.5; // 0-1 범위로 정규화
                    
                    // 프레넬 효과
                    vec3 viewDirection = normalize(cameraPosition - vPosition);
                    float fresnel = 1.0 - max(0.0, dot(viewDirection, normalize(vNormal)));
                    fresnel = pow(fresnel, 2.0);
                    
                    // 구름 색상
                    vec3 baseColor = vec3(1.0, 1.0, 1.0);
                    vec3 shadowColor = vec3(0.7, 0.75, 0.8);
                    
                    // 조명 효과
                    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
                    float NdotL = max(0.0, dot(normalize(vNormal), lightDir));
                    
                    vec3 cloudColor = mix(shadowColor, baseColor, NdotL * 0.6 + 0.4);
                    
                    // 오디오 반응 색상
                    vec3 bassColor = vec3(0.8, 0.9, 1.0) * bassLevel * 0.5;
                    vec3 trebleColor = vec3(1.0, 0.9, 0.8) * trebleLevel * 0.3;
                    
                    cloudColor += bassColor + trebleColor;
                    
                    // 투명도 계산
                    float density = noise * (0.6 + vAudioInfluence * 0.4);
                    float alpha = density * (0.4 + fresnel * 0.6);
                    alpha = clamp(alpha, 0.2, 0.85);
                    
                    gl_FragColor = vec4(cloudColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
    }, []);

    useFrame((_, delta) => {
        if (!groupRef.current) return;

        timeRef.current += delta;

        // 오디오 데이터 가져오기
        const audioLevel = audioStore.getAverageFrequency();
        const bassLevel = audioStore.getBassLevel();
        const trebleLevel = audioStore.getTrebleLevel();

        // 모든 메시의 머티리얼 업데이트
        groupRef.current.children.forEach((child) => {
            if (child.material && child.material.uniforms) {
                child.material.uniforms.time.value = timeRef.current;
                child.material.uniforms.audioLevel.value = audioLevel;
                child.material.uniforms.bassLevel.value = bassLevel;
                child.material.uniforms.trebleLevel.value = trebleLevel;
            }
        });

        // 부드러운 회전
        groupRef.current.rotation.y += delta * 0.05;
        groupRef.current.rotation.x += delta * 0.02;

        // 오디오에 따른 스케일 변화
        const scale = 1 + audioLevel * 0.2;
        groupRef.current.scale.setScalar(scale);
    });

    return (
        <group ref={groupRef}>
            {/* 메인 구름 */}
            <mesh geometry={geometry} material={material.clone()} />

            {/* 구름 레이어들 */}
            <mesh
                geometry={geometry}
                material={material.clone()}
                scale={[0.7, 0.5, 0.6]}
                position={[0.8, 0.2, 0.3]}
                rotation={[0.1, 0.3, 0.05]}
            />
            <mesh
                geometry={geometry}
                material={material.clone()}
                scale={[0.5, 0.4, 0.5]}
                position={[-0.6, -0.1, 0.4]}
                rotation={[0.15, -0.2, 0.1]}
            />
            <mesh
                geometry={geometry}
                material={material.clone()}
                scale={[0.4, 0.3, 0.4]}
                position={[0.2, -0.5, -0.3]}
                rotation={[-0.1, 0.4, -0.1]}
            />
            
            {/* 작은 구름 조각들 */}
            <mesh
                geometry={geometry}
                material={material.clone()}
                scale={[0.25, 0.2, 0.3]}
                position={[1.2, 0.6, 0.1]}
                rotation={[0.2, 0.5, 0.1]}
            />
            <mesh
                geometry={geometry}
                material={material.clone()}
                scale={[0.3, 0.25, 0.2]}
                position={[-0.9, -0.4, 0.6]}
                rotation={[0.3, -0.3, 0.2]}
            />
        </group>
    );
};

export default CloudEqualizer;