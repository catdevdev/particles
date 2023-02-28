import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import "./index.css";

import { ACESFilmicToneMapping, Color, sRGBEncoding } from "three";
import Draggable from "react-draggable";
import Button from "react-bootstrap/Button";
import { FormControl, InputGroup, Table } from "react-bootstrap";
import { parse, simplify } from "mathjs";

var algebra = require("algebra.js");

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface WallProps {
  dimensions: [x: number, y: number, z: number];
  position: [x: number, y: number, z: number];
  isProcessor?: boolean;
  isFilter?: boolean;
}

// const TriggerProccessor = ({}) => {
//   const [ref] = useBox(() => ({
//     isTrigger: true,
//     args: [],
//     position: [1, 2, 3],
//     onCollide,
//   }));
//   return (
//     <mesh ref={ref} position={position}>
//       <boxGeometry args={size} />
//       <meshStandardMaterial wireframe color="green" />
//     </mesh>
//   );
// };

const Wall = ({ dimensions, position, isProcessor, isFilter }: WallProps) => {
  const [ref, api] = useBox(() => ({
    position,
    args: dimensions,
    userData: {
      isProcessor,
      isFilter,
    },
    isTrigger: isFilter,
  }));

  useEffect(() => {
    api.velocity.set(0, 6, 0);
  }, []);

  return (
    <mesh ref={ref} position={position}>
      <boxBufferGeometry attach="geometry" args={dimensions} />
      <meshLambertMaterial
        color={isProcessor ? "gray" : isFilter ? "black" : "green"}
        opacity={isProcessor ? 1 : isFilter ? 0.5 : 0.2}
        transparent
        attach="material"
      />
    </mesh>
  );
};

const ParticleContainer = () => {
  return (
    <>
      {/* top */}
      <Wall dimensions={[40, 0.5, 5]} position={[0, 4.5, 0]} />
      {/* bottom */}
      <Wall dimensions={[40, 0.5, 5]} position={[0, 0, 0]} />
      {/* left side */}
      <Wall dimensions={[40, 5, 0.5]} position={[0, 2.25, 2.3]} />
      {/* right side */}
      <Wall dimensions={[40, 5, 0.5]} position={[0, 2.25, -2.3]} />
      {/* processor */}
      <Wall isProcessor dimensions={[2.3, 0.3, 2.3]} position={[4, 0.5, 0]} />
      {/* filter */}
      <Wall isFilter dimensions={[2, 4, 4]} position={[-10, 2.3, 0]} />
    </>
  );
};

interface ParticleProps {
  startPosition: [x: number, y: number, z: number];
}

const Particle = ({ startPosition }: ParticleProps) => {
  const [color, setColor] = useState("blue");
  const [ref, api] = useBox(() => ({
    mass: 0.1,
    position: startPosition,
    args: [0.1, 0.1, 0.1],
    type: "Dynamic",
    onCollide: (s) => {
      if (s.contact.bi.userData.isProcessor) api.sleep();
      if (s.contact.bi.userData.isFilter) setColor("blue");
    },
  }));

  useEffect(() => {
    api.allowSleep.set(true);
    console.log(api);
    const randNum = getRandomInt(0, 1);
    randNum === 0 && setColor("blud");
    randNum === 1 && setColor("red");
  }, []);

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <boxBufferGeometry attach="geometry" args={[0.1, 0.1, 0.1]} />
      <meshLambertMaterial attach="material" color={color} />
    </mesh>
  );
};

const ParticleStream = ({
  quantityParticles,
}: {
  quantityParticles: number;
}) => {
  return (
    <>
      {[...Array(quantityParticles - 5)].map((_, i) =>
        [...Array(quantityParticles)].map((_, j) =>
          [...Array(quantityParticles)].map((_, u) => (
            <Particle
              startPosition={[i * 0.2 - 20, j * 0.2 + 1, u * 0.2 - 1]}
            />
          ))
        )
      )}
    </>
  );
};

///

const CalculationWindow = () => {
  const [temperature, setTemperature] = useState<any>("24");
  const [pressure, setPressure] = useState<any>("764");

  const [pGel4, setPGel4] = useState<any>("unknown");
  const [pGel2, setPGel2] = useState<any>("unknown");
  const [p2, setP2] = useState<any>("unknown");
  const [p, setP] = useState<any>("unknown");
  const [pHe, setPHe] = useState<any>("unknown");
  const [quantityParticles, setQuantityParticles] = useState<any>("unknown");
  const [quantityLayers, setQuantityLayers] = useState<any>("unknown");

  const calculateStep1 = () => {
    // part 1

    var Fraction = algebra.Fraction;
    var Expression = algebra.Expression;
    var Equation = algebra.Equation;
    // const expression = parse(
    //   "99.72*x^4+2.870565*10^(-7)*x^2+6.674356*10^(-16)*x-pressure=0"
    // );
    // const simplified = simplify(expression);
    // console.log(simplified.evaluate({ x: 4 }));
    // // const toCalk =
    // // return 1;
    const x = Math.pow(1.663711, 4);
    const inPascals = x * 133.32;
    setPGel4(inPascals);

    const { pow, sqrt, exp } = Math;
    const pGel2 = inPascals * 3.25 * pow(10, -17);
    setPGel2(sqrt(pGel2));
    const pI2 = (sqrt(pGel2) / 1.09) * (1 / pow(10, 4));
    setP2(pI2);
    const pI = pI2 * 1.29 * pow(10, -21);
    setP(sqrt(pI));
    const He = pressure * 133.32 - (sqrt(pGel2) + pI2 + sqrt(pI) + inPascals);
    setPHe(He);

    // part 2

    // const p =

    const lambda =
      1 /
      (2.085 *
        pow(10, 4) *
        He *
        pow(2.75 * pow(10, -10) + 2.14 * pow(10, -10), 2) *
        sqrt(1 + 18.1439 * pow(10, -3)));

    const D = (17 * pow(10, -3)) / 2;
    const Mmatter = 72.63 * pow(10, -3);
    const Matm = 4.003 * pow(10, -3);
    const P =
      (lambda * Matm) /
      (D * Mmatter * (1 - exp(-(((D * Mmatter) / lambda) * Matm))));
    const quantityParticles = P * He * 0.95;
    setQuantityParticles(quantityParticles);
  };

  return (
    <Draggable>
      <div
        style={{
          zIndex: 1000,
          position: "fixed",
          background: "white",
          padding: 24,
          borderRadius: 6,
          boxShadow:
            "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
        }}
      >
        <InputGroup className="mb-3">
          <InputGroup.Text>Temperature</InputGroup.Text>
          <FormControl
            aria-describedby="basic-addon1"
            onChange={(e) => {
              setTemperature(e.target.value);
            }}
            value={temperature}
          ></FormControl>
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>Pressure</InputGroup.Text>
          <FormControl
            aria-describedby="basic-addon1"
            onChange={(e) => {
              setPressure(e.target.value);
            }}
            value={pressure}
          ></FormControl>
        </InputGroup>
        {/* @ts-ignore */}
        <Button onClick={calculateStep1}>Calculate</Button>
        <Table style={{ marginTop: 12 }} striped bordered hover>
          <tbody>
            <tr>
              <td>pGel/4</td>
              <td>{pGel4}</td>
            </tr>
            <tr>
              <td>pGel/2</td>
              <td>{pGel2}</td>
            </tr>
            <tr>
              <td>p/2</td>
              <td>{p2}</td>
            </tr>
            <tr>
              <td>p/</td>
              <td>{p}</td>
            </tr>
            <tr>
              <td>p/He</td>
              <td>{pHe}</td>
            </tr>
            <tr>
              <td>quantityParticles</td>
              <td>{quantityParticles}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Draggable>
  );
};

export default function App() {
  return (
    <div style={{ height: "100vh" }}>
      <CalculationWindow></CalculationWindow>
      <Canvas
        gl={{ alpha: false }}
        camera={{ position: [-5, 5, 20], fov: 50 }}
        onCreated={({ gl, camera, scene }) => {
          camera.lookAt(0, 0, 0);
          scene.background = new Color("lightblue");
          gl.toneMapping = ACESFilmicToneMapping;
          gl.outputEncoding = sRGBEncoding;
        }}
      >
        <OrbitControls position={[10, 20, 30]} />
        <Stars />
        <hemisphereLight intensity={0.35} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={2}
          castShadow
          shadow-camera-zoom={2}
        />
        <Physics gravity={[2, -2, 0]}>
          <ParticleContainer />
          <ParticleStream quantityParticles={10} />
        </Physics>
      </Canvas>
    </div>
  );
}
