// import { ReactThreeFiber, OrbitControls } from '@react-three/fiber'
declare namespace JSX {
  interface IntrinsicElements {
    orbitControls: ReactThreeFiber.Object3DNode<
      OrbitControls,
      typeof OrbitControls
    >
  }
}
