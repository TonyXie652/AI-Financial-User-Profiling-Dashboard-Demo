import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";

function HumanModel() {
  const { scene } = useGLTF("/models/MaleHologram.glb");

  return (
    <primitive
      object={scene}
      scale={1.5}
      position={[0, -1.2, 0]}
    />
  );
}

function Data_analysis() {
  return (
    <div className="h-[520px] w-full rounded-2xl bg-slate-950">
      <Canvas camera={{ position: [0, 1.2, 4], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 5, 4]} intensity={1.5} />

        <Suspense
          fallback={
            <Html center>
              <div className="text-sm text-white">模型加载中...</div>
            </Html>
          }
        >
          <HumanModel />
        </Suspense>

        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}

export default Data_analysis;