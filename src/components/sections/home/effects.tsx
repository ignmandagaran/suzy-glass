import React, { Suspense } from 'react'

import {
  EffectComposer,
  Noise,
  Vignette,
  DepthOfField
} from '@react-three/postprocessing'

function Effects() {
  return (
    <Suspense fallback={null}>
      <EffectComposer>
        <DepthOfField
          focusDistance={0.1}
          focalLength={0.32}
          bokehScale={2}
          height={1024}
        />
        <Noise
          opacity={0.4}
          premultiply // enables or disables noise premultiplication
        />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
    </Suspense>
  )
}

export default Effects
