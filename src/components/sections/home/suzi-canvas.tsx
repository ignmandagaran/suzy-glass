import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Environment, Loader, OrbitControls } from '@react-three/drei'
import { useControls } from 'leva'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import THREE from 'three'

type GLTFResult = GLTF & {
  nodes: {
    Model: THREE.Mesh
    Model_1: THREE.Mesh
    Model_2: THREE.Mesh
  }
  materials: {
    ['default']: THREE.MeshStandardMaterial
    oil: THREE.MeshStandardMaterial
  }
}

const glbPath = '/glass-cube.glb'
if (typeof window !== 'undefined') {
  useGLTF.preload(glbPath)
}

function Suzi(props: any) {
  const { nodes } = useGLTF(glbPath, true) as GLTFResult
  console.log(nodes)
  const materialProps = useControls({
    thickness: { value: 5, min: 0, max: 20 },
    roughness: { value: 1, min: 0, max: 1, step: 0.1 },
    clearcoat: { value: 1, min: 0, max: 1, step: 0.1 },
    clearcoatRoughness: { value: 0, min: 0, max: 1, step: 0.1 },
    transmission: { value: 1, min: 0.9, max: 1, step: 0.01 },
    ior: { value: 1.25, min: 1, max: 2.3, step: 0.05 },
    envMapIntensity: { value: 25, min: 0, max: 100, step: 1 },
    color: '#000',
    attenuationTint: '#FFF',
    attenuationDistance: { value: 0, min: 0, max: 1 }
  })

  return (
    <group>
      <directionalLight position={[0, -1, 0]} intensity={0.2} />
      <mesh geometry={nodes.Model_1.geometry} {...props}>
        <meshPhysicalMaterial {...materialProps} />
      </mesh>
    </group>
  )
}

const SuziCanvas = () => {
  const envProps = useControls({ background: false })
  return (
    <>
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          height: '100vh',
          background: 'black'
        }}
      >
        <Canvas
          style={{ height: '600px', width: '600px' }}
          dpr={[1, 2]}
          camera={{ position: [0, 0, 2.5] }}
          gl={{ alpha: false }}
        >
          <color attach="background" args={['#151518']} />
          {/* <ambientLight intensity={-0.2} />
        <directionalLight position={[20, 10, -10]} intensity={1} castShadow /> */}
          <Suspense fallback={null}>
            <Suzi />
            {/* <SkyBox /> */}
            {/* <Environment {...envProps} files="christmas_photo_studio_01_1k.hdr" /> */}
            <Environment
              path="/skybox/colors/"
              {...envProps}
              files={[
                'gradient-4.png',
                'gradient-4.png',
                'gradient-4.png',
                'gradient-4.png',
                'gradient-4.png',
                'gradient-4.png'
              ]}
            />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
      <Loader />
    </>
  )
}

export default SuziCanvas
