// Project: JAD-HONG (React + Three Fiber)
// Technologies: React, Three.js (via @react-three/fiber), @react-three/drei, Leva, Zustand

import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, ContactShadows, Environment, GizmoHelper, GizmoViewport } from '@react-three/drei'
import { Suspense, useEffect, useState } from 'react'
import { Leva, useControls } from 'leva'
import { create } from 'zustand'
import './App.css'
import Room from './components/Room'

// Zustand state for managing selected model
const useStore = create((set) => ({
  selected: null,
  setSelected: (sel) => set({ selected: sel }),
}))

// Zustand state for camera view
const useCameraView = create((set) => ({
  setView: (position, lookAt) => set({ position, lookAt }),
  position: [7, 6, 7],
  lookAt: [0, 0, 0],
}))

function Chair(props) {
  const { nodes } = useGLTF('/models/chair.glb')
  useEffect(() => {
    console.log('Model nodes:', nodes)
  }, [nodes])
  return <primitive object={Object.values(nodes)[0]} {...props} />
}

function Scene() {
  const { selected, setSelected } = useStore()
  const { positionX, positionZ, rotationY } = useControls('Chair', {
    positionX: { value: 0, min: -5, max: 10, step: 0.1 },
    positionZ: { value: 0, min: -5, max: 6, step: 0.1 },
    rotationY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7]} intensity={1} />
      <Room />
      <Chair
        scale={0.015}
        position={[positionX, 0, positionZ]} // Chair always stays on the ground
        rotation={[0, rotationY, 0]}
        onClick={() => setSelected('chair')}
      />
      <ContactShadows position={[0, -0.01, 0]} opacity={0.5} scale={10} blur={1.5} far={10} />
      <Environment preset="city" />
    </>
  )
}

function CameraController({ onUpdate }) {
  const { camera } = useThree()
  const { position, lookAt } = useCameraView()

  useEffect(() => {
    camera.position.set(...position)
    camera.lookAt(...lookAt)
  }, [position, lookAt])

  useEffect(() => {
    const update = () => onUpdate(camera.position)
    update()
    return () => null
  }, [camera, onUpdate])

  return null
}

function CameraButtons() {
  const setView = useCameraView((state) => state.setView)

  return (
    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, display: 'flex', gap: '0.5rem' }}>
      <button onClick={() => setView([7, 6, 7], [0, 0, 0])}>ROOM VIEW</button>
    </div>
  )
}

function CameraPositionDisplay({ position }) {
  return (
    <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 10, color: 'white', background: '#000a', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontFamily: 'monospace' }}>
      Camera: x: {position.x.toFixed(2)}, y: {position.y.toFixed(2)}, z: {position.z.toFixed(2)}
    </div>
  )
}

export default function App() {
  const [cameraPos, setCameraPos] = useState({ x: 0, y: 0, z: 0 })

  return (
    <div className="canvas-container">
      <Canvas shadows camera={{ position: [7, 6, 7], fov: 35 }}>
        <Suspense fallback={null}>
          <OrbitControls makeDefault />
          <CameraController onUpdate={(pos) => setCameraPos({ x: pos.x, y: pos.y, z: pos.z })} />
          <Scene />
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="white" />
          </GizmoHelper>
        </Suspense>
      </Canvas>
      <CameraButtons />
      <CameraPositionDisplay position={cameraPos} />
      <Leva collapsed />
    </div>
  )
}
