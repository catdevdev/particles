import { Canvas } from "@react-three/fiber";
import { Physics, usePlane, useBox } from "@react-three/cannon";

import { hot } from "react-hot-loader/root";

function Plane(props: any) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref}>
      <planeBufferGeometry args={[100, 100]} />
    </mesh>
  );
}

function Sphere() {
  const [ref] = useBox(() => ({ mass: 1, position: [10, 5, 0] }));
  return (
    <mesh
      ref={ref}
      visible
      userData={{ test: "hello" }}
      position={[0, 0, 0]}
      castShadow
    >
      <sphereGeometry />
      <meshStandardMaterial
        attach="material"
        color="white"
        transparent
        roughness={0.1}
        metalness={0.1}
      />
    </mesh>
  );
}

function Cube(props: any) {
  const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0], ...props }));
  return (
    <mesh ref={ref}>
      <meshStandardMaterial
        attach="material"
        color="white"
        transparent
        roughness={0.1}
        metalness={0.1}
      />
      <boxBufferGeometry />
    </mesh>
  );
}

const App = () => (
  <div style={{ position: "relative", width: "100%", height: "100vh" }}>
    <Canvas camera={{ position: [20, 20, 30], near: 0.5, far: 2000 }}>
      <Physics>
        <Plane></Plane>
        13 <Sphere />
        <Sphere />
        <Sphere />
        <Sphere />
        <Sphere />
        <Cube />
        <Cube />
        <Cube />
        <Cube />
        <Cube />
        <Cube />
        <Cube />
        <Cube />
        <Cube />
        <Cube />
      </Physics>
    </Canvas>
  </div>
);

export default hot(App);
