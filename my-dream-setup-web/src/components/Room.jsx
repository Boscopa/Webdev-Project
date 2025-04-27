export default function Room() {
    return (
      <>
        {/* พื้นหนา (box) */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[20, 1, 20]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
  
        {/* ผนังด้านหลัง */}
        <mesh receiveShadow position={[0, 5.5, -9.5]}>
          <boxGeometry args={[20, 10, 1]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
  
        {/* ผนังด้านซ้าย */}
        <mesh receiveShadow position={[- 9.5, 5.5, 0]}>
          <boxGeometry args={[1,10,20]} />
          <meshStandardMaterial color="#aaa" />
        </mesh>
      </>
    )
  }
  