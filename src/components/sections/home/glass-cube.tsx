import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import {
  RoundedBox,
  useCubeTexture,
  useTexture,
  OrbitControls
} from '@react-three/drei'
import { useMedia } from 'hooks/use-media'
import { a, useSpring, config } from '@react-spring/three'

extend({ OrbitControls })

const Cube = () => {
  const ref = useRef<THREE.Mesh>(null)
  const [active, setActive] = useState(false)
  const { viewport } = useThree()
  const cubeSize = (0.6 * viewport.width) / 2
  const envMap = useCubeTexture(Array(6).fill('g.jpeg'), {
    path: '/images/r3f/'
  })
  const texture = useTexture('/images/r3f/flakes.jpeg')

  const materialProps = {
    clearcoat: 0,
    clearcoatRoughness: 0,
    roughness: 0.2,
    metalness: 0.45,
    normalMap: texture,
    'normalMap-wrapS': THREE.RepeatWrapping,
    'normalMap-wrapT': THREE.RepeatWrapping,
    'normalMap-repeat': [30, 30],
    transmission: 1,
    transparent: true
  }

  const { scale } = useSpring({
    scale: active ? 1 : 0.2,
    config: { ...config.molasses }
  })

  const { opacity } = useSpring({
    opacity: active ? 1 : 0,
    config: {
      mass: 6.5,
      tension: 173,
      friction: 45,
      precision: 0,
      velocity: 0.001
    }
  })

  useLayoutEffect(() => {
    setActive(true)
  }, [])

  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.y += 0.0035
    ref.current.rotation.z += 0.0035
  })

  return (
    <a.mesh
      ref={ref}
      position={[0, 0, 0]}
      rotation={[0.69, 0.69, 0.14]}
      scale={scale}
      castShadow
    >
      <group>
        <RoundedBox
          args={[cubeSize, cubeSize, cubeSize]}
          radius={cubeSize / 50}
          smoothness={10}
        >
          {/* @ts-ignore */}
          <a.meshPhysicalMaterial
            opacity={opacity}
            envMap={envMap}
            {...materialProps}
            color="#fee0f5"
            side={THREE.BackSide}
          />
        </RoundedBox>
        <RoundedBox
          args={[cubeSize, cubeSize, cubeSize]}
          radius={cubeSize / 25}
          smoothness={10}
        >
          <a.meshPhysicalMaterial
            opacity={opacity}
            envMap={envMap}
            {...materialProps}
            color="#000"
            transmission={0.95}
          />
        </RoundedBox>
      </group>
    </a.mesh>
  )
}

const CubeCanvas = () => {
  const isMd = useMedia('(max-width: 1024px)')
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 })
  const [cameraZ, setCameraZ] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleWindowResize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    handleWindowResize()
    setCameraZ(isMd ? 5.1 : 3.1)
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [isMd])

  return (
    <Canvas
      style={{ height: canvasSize.height, width: canvasSize.width }}
      className="hover:cursor-grab active:cursor-grabbing"
      dpr={[1, 2]}
      camera={{ position: [0, 0, cameraZ], fov: 30 }}
      gl={{ alpha: true }}
      mode="concurrent"
    >
      <ambientLight intensity={0.5} color="#06fffb" />
      <directionalLight
        position={[10, 10, -10]}
        intensity={0.5}
        castShadow
        color="#a93976"
      />
      <Suspense fallback={null}>
        <Cube />
        <EffectComposer>
          <></>
        </EffectComposer>
      </Suspense>
      <OrbitControls enableZoom={false} />
    </Canvas>
  )
}

export default CubeCanvas
