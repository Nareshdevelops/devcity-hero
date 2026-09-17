import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";

import { Html } from "@react-three/drei";

import {
  cityLocations,
} from "@/data/city";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import * as THREE from "three";

import Hero3D from "./Hero3D";
import GameHUD from "./GameHUD";
import { useGame } from "@/lib/game-state";

/* ================================================= */
/* GROUND                                            */
/* ================================================= */

function Ground() {
  return (
    <mesh
      rotation={[
        -Math.PI / 2,
        0,
        0,
      ]}
      position={[
        0,
        -1,
        0,
      ]}
    >
      <planeGeometry
        args={[
          140,
          140,
        ]}
      />

      <meshStandardMaterial
        color="#0b1220"
        roughness={0.92}
        metalness={0.05}
      />
    </mesh>
  );
}

/* ================================================= */
/* CITY GRID GLOW                                    */
/* ================================================= */

function GroundGrid() {
  return (
    <gridHelper
      args={[
        140,
        70,
        "#164e63",
        "#0f172a",
      ]}
      position={[
        0,
        -0.93,
        0,
      ]}
    />
  );
}

/* ================================================= */
/* ROAD                                              */
/* ================================================= */

function Road({
  position,
  size,
  horizontal = false,
}: {
  position: [
    number,
    number,
    number,
  ];

  size: [
    number,
    number,
  ];

  horizontal?: boolean;
}) {
  const markings = [
    -50,
    -40,
    -30,
    -20,
    -10,
    0,
    10,
    20,
    30,
    40,
    50,
  ];

  return (
    <group>
      {/* ========================================= */}
      {/* MAIN ROAD                                */}
      {/* ========================================= */}

      <mesh
        position={[
          position[0],
          -0.98,
          position[2],
        ]}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
      >
        <planeGeometry
          args={size}
        />

        <meshStandardMaterial
          color="#1a2231"
          roughness={0.78}
          metalness={0.2}
        />
      </mesh>

      {/* ========================================= */}
      {/* ROAD EDGE LINES                          */}
      {/* ========================================= */}

      {horizontal ? (
        <>
          <mesh
            position={[
              position[0],
              -0.935,
              position[2] -
                size[1] / 2 +
                0.18,
            ]}
            rotation={[
              -Math.PI / 2,
              0,
              0,
            ]}
          >
            <planeGeometry
              args={[
                size[0],
                0.06,
              ]}
            />

            <meshStandardMaterial
              color="#0891b2"
              emissive="#06b6d4"
              emissiveIntensity={1.8}
            />
          </mesh>

          <mesh
            position={[
              position[0],
              -0.935,
              position[2] +
                size[1] / 2 -
                0.18,
            ]}
            rotation={[
              -Math.PI / 2,
              0,
              0,
            ]}
          >
            <planeGeometry
              args={[
                size[0],
                0.06,
              ]}
            />

            <meshStandardMaterial
              color="#0891b2"
              emissive="#06b6d4"
              emissiveIntensity={1.8}
            />
          </mesh>
        </>
      ) : (
        <>
          <mesh
            position={[
              position[0] -
                size[0] / 2 +
                0.18,
              -0.935,
              position[2],
            ]}
            rotation={[
              -Math.PI / 2,
              0,
              0,
            ]}
          >
            <planeGeometry
              args={[
                0.06,
                size[1],
              ]}
            />

            <meshStandardMaterial
              color="#0891b2"
              emissive="#06b6d4"
              emissiveIntensity={1.8}
            />
          </mesh>

          <mesh
            position={[
              position[0] +
                size[0] / 2 -
                0.18,
              -0.935,
              position[2],
            ]}
            rotation={[
              -Math.PI / 2,
              0,
              0,
            ]}
          >
            <planeGeometry
              args={[
                0.06,
                size[1],
              ]}
            />

            <meshStandardMaterial
              color="#0891b2"
              emissive="#06b6d4"
              emissiveIntensity={1.8}
            />
          </mesh>
        </>
      )}

      {/* ========================================= */}
      {/* CENTER GLOW                              */}
      {/* ========================================= */}

      <mesh
        position={[
          position[0],
          -0.94,
          position[2],
        ]}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
      >
        <planeGeometry
          args={
            horizontal
              ? [
                  size[0],
                  0.045,
                ]
              : [
                  0.045,
                  size[1],
                ]
          }
        />

        <meshStandardMaterial
          color="#155e75"
          emissive="#06b6d4"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* ========================================= */}
      {/* LANE MARKINGS                            */}
      {/* ========================================= */}

      {horizontal
        ? markings.map(
            (x) => (
              <mesh
                key={`h-${x}`}
                position={[
                  x,
                  -0.925,
                  position[2] -
                    0.72,
                ]}
                rotation={[
                  -Math.PI / 2,
                  0,
                  0,
                ]}
              >
                <planeGeometry
                  args={[
                    3.2,
                    0.045,
                  ]}
                />

                <meshStandardMaterial
                  color="#67e8f9"
                  emissive="#22d3ee"
                  emissiveIntensity={1.2}
                />
              </mesh>
            ),
          )
        : markings.map(
            (z) => (
              <mesh
                key={`v-${z}`}
                position={[
                  position[0] -
                    0.72,
                  -0.925,
                  z,
                ]}
                rotation={[
                  -Math.PI / 2,
                  0,
                  0,
                ]}
              >
                <planeGeometry
                  args={[
                    0.045,
                    3.2,
                  ]}
                />

                <meshStandardMaterial
                  color="#67e8f9"
                  emissive="#22d3ee"
                  emissiveIntensity={1.2}
                />
              </mesh>
            ),
          )}
    </group>
  );
}

/* ================================================= */
/* BUILDING                                         */
/* ================================================= */

function Building({
  position,
  height,
  index,
}: {
  position: [
    number,
    number,
    number,
  ];

  height: number;

  index: number;
}) {
  const widthOptions = [
    3.6,
    4.2,
    4.8,
    5.2,
  ];

  const depthOptions = [
    3.6,
    4.2,
    4.8,
  ];

  const width =
    widthOptions[
      index %
        widthOptions.length
    ] ?? 4;

  const depth =
    depthOptions[
      index %
        depthOptions.length
    ] ?? 4;

  const windowRows =
    Math.max(
      2,
      Math.floor(
        height / 2.7,
      ),
    );

  const windowColumns = 2;

  const buildingColor =
    index % 4 === 0
      ? "#172033"
      : index % 4 === 1
        ? "#111a2c"
        : index % 4 === 2
          ? "#1c2638"
          : "#151f32";

  const rooftopHeight =
    index % 3 === 0
      ? 1.8
      : index % 3 === 1
        ? 1.2
        : 0.8;

  return (
    <group>
      {/* ======================================= */}
      {/* MAIN BUILDING                          */}
      {/* ======================================= */}

      <mesh
        position={[
          position[0],
          height / 2 - 1,
          position[2],
        ]}
      >
        <boxGeometry
          args={[
            width,
            height,
            depth,
          ]}
        />

        <meshStandardMaterial
          color={
            buildingColor
          }
          roughness={0.7}
          metalness={0.22}
        />
      </mesh>

      {/* ======================================= */}
      {/* BUILDING TOP CAP                       */}
      {/* ======================================= */}

      <mesh
        position={[
          position[0],
          height - 0.96,
          position[2],
        ]}
      >
        <boxGeometry
          args={[
            width + 0.12,
            0.14,
            depth + 0.12,
          ]}
        />

        <meshStandardMaterial
          color="#263449"
          roughness={0.55}
          metalness={0.35}
        />
      </mesh>

      {/* ======================================= */}
      {/* FRONT WINDOWS                          */}
      {/* ======================================= */}

      {Array.from({
        length:
          windowRows *
          windowColumns,
      }).map(
        (_, i) => {
          const row =
            Math.floor(
              i /
                windowColumns,
            );

          const column =
            i %
            windowColumns;

          const xOffset =
            column === 0
              ? -width *
                0.23
              : width *
                0.23;

          const y =
            -1 +
            1.8 +
            row *
              Math.min(
                2.5,
                height /
                  windowRows,
              );

          const isDim =
            i % 5 === 0;

          return (
            <mesh
              key={`front-${i}`}
              position={[
                position[0] +
                  xOffset,
                Math.min(
                  y,
                  height -
                    1.2,
                ),
                position[2] -
                  depth /
                    2 -
                  0.025,
              ]}
            >
              <planeGeometry
                args={[
                  0.65,
                  0.85,
                ]}
              />

              <meshStandardMaterial
                color={
                  isDim
                    ? "#164e63"
                    : "#67e8f9"
                }
                emissive="#0ea5e9"
                emissiveIntensity={
                  isDim
                    ? 0.5
                    : i % 3 === 0
                      ? 2.3
                      : 1.25
                }
              />
            </mesh>
          );
        },
      )}

      {/* ======================================= */}
      {/* SIDE WINDOWS                           */}
      {/* ======================================= */}

      {Array.from({
        length: Math.max(
          2,
          Math.floor(
            height / 4,
          ),
        ),
      }).map(
        (_, i) => (
          <mesh
            key={`side-${i}`}
            position={[
              position[0] +
                width /
                  2 +
                0.025,
              -1 +
                2.2 +
                i * 3,
              position[2] -
                depth *
                  0.2,
            ]}
            rotation={[
              0,
              Math.PI / 2,
              0,
            ]}
          >
            <planeGeometry
              args={[
                0.7,
                0.9,
              ]}
            />

            <meshStandardMaterial
              color="#22d3ee"
              emissive="#06b6d4"
              emissiveIntensity={
                i % 3 === 0
                  ? 2
                  : 1
              }
            />
          </mesh>
        ),
      )}

      {/* ======================================= */}
      {/* VERTICAL NEON STRIP                    */}
      {/* ======================================= */}

      {index % 3 === 0 && (
        <mesh
          position={[
            position[0] -
              width /
                2 -
              0.035,
            0.2,
            position[2],
          ]}
        >
          <boxGeometry
            args={[
              0.035,
              Math.min(
                height -
                  1,
                16,
              ),
              0.08,
            ]}
          />

          <meshStandardMaterial
            color="#67e8f9"
            emissive="#06b6d4"
            emissiveIntensity={3}
          />
        </mesh>
      )}

      {/* ======================================= */}
      {/* ROOFTOP STRUCTURE                      */}
      {/* ======================================= */}

      <mesh
        position={[
          position[0],
          height -
            1 +
            rooftopHeight /
              2,
          position[2],
        ]}
      >
        <boxGeometry
          args={[
            width *
              0.35,
            rooftopHeight,
            depth *
              0.35,
          ]}
        />

        <meshStandardMaterial
          color="#0f172a"
          roughness={0.6}
          metalness={0.35}
        />
      </mesh>

      {/* ======================================= */}
      {/* ROOFTOP ANTENNA                        */}
      {/* ======================================= */}

      {index % 2 === 0 && (
        <mesh
          position={[
            position[0],
            height + 1.5,
            position[2],
          ]}
        >
          <cylinderGeometry
            args={[
              0.06,
              0.06,
              3,
              8,
            ]}
          />

          <meshStandardMaterial
            color="#475569"
            metalness={0.7}
            roughness={0.35}
          />
        </mesh>
      )}

      {/* ======================================= */}
      {/* ROOFTOP BEACON                         */}
      {/* ======================================= */}

      {index % 3 === 0 && (
        <mesh
          position={[
            position[0],
            height + 3.1,
            position[2],
          ]}
        >
          <sphereGeometry
            args={[
              0.13,
              8,
              8,
            ]}
          />

          <meshStandardMaterial
            color="#67e8f9"
            emissive="#06b6d4"
            emissiveIntensity={4}
          />
        </mesh>
      )}

      {/* ======================================= */}
      {/* ROOFTOP RING                          */}
      {/* ======================================= */}

      {index % 4 === 1 && (
        <mesh
          position={[
            position[0],
            height +
              0.08,
            position[2],
          ]}
          rotation={[
            -Math.PI / 2,
            0,
            0,
          ]}
        >
          <ringGeometry
            args={[
              0.45,
              0.53,
              20,
            ]}
          />

          <meshBasicMaterial
            color="#06b6d4"
            transparent
            opacity={0.65}
            side={
              THREE.DoubleSide
            }
          />
        </mesh>
      )}
    </group>
  );
}
 /* ================================================= */
 /* LOCATION LANDMARK                               */
 /* ================================================= */

function LocationLandmark({
  location,
}: {
  location: {
    id: string;
    name: string;
    position: [
      number,
      number,
      number,
    ];
    height: number;
  };
}) {
  const [
    x,
    ,
    z,
  ] = location.position;

  const baseY =
    location.height - 0.8;

  /* ================================================= */
  /* HOME BASE                                        */
  /* ================================================= */

  if (
    location.id ===
    "home-base"
  ) {
    return (
      <group
        position={[
          x,
          baseY,
          z,
        ]}
      >
        <mesh>
          <cylinderGeometry
            args={[
              1.7,
              2.1,
              1.2,
              8,
            ]}
          />

          <meshStandardMaterial
            color="#172033"
            metalness={0.5}
            roughness={0.35}
          />
        </mesh>

        <mesh
          position={[
            0,
            2.2,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              0.35,
              0.65,
              3,
              8,
            ]}
          />

          <meshStandardMaterial
            color="#ef1d2d"
            emissive="#991b1b"
            emissiveIntensity={1.5}
          />
        </mesh>

        <mesh
          position={[
            0,
            4.1,
            0,
          ]}
        >
          <sphereGeometry
            args={[
              0.28,
              12,
              12,
            ]}
          />

          <meshStandardMaterial
            color="#67e8f9"
            emissive="#06b6d4"
            emissiveIntensity={5}
          />
        </mesh>
      </group>
    );
  }

  /* ================================================= */
  /* ORIGIN CENTER                                    */
  /* ================================================= */

  if (
    location.id ===
    "origin-center"
  ) {
    return (
      <group
        position={[
          x,
          baseY,
          z,
        ]}
      >
        <mesh>
          <cylinderGeometry
            args={[
              1.4,
              1.8,
              0.5,
              6,
            ]}
          />

          <meshStandardMaterial
            color="#1e293b"
            metalness={0.45}
            roughness={0.4}
          />
        </mesh>

        <mesh
          position={[
            0,
            1.7,
            0,
          ]}
        >
          <coneGeometry
            args={[
              1.05,
              3.2,
              6,
            ]}
          />

          <meshStandardMaterial
            color="#0e7490"
            emissive="#06b6d4"
            emissiveIntensity={1.5}
            transparent
            opacity={0.82}
          />
        </mesh>

        <pointLight
          position={[
            0,
            2,
            0,
          ]}
          intensity={2}
          distance={8}
          color="#67e8f9"
        />
      </group>
    );
  }

  /* ================================================= */
  /* TRAINING CENTER                                  */
  /* ================================================= */

  if (
    location.id ===
    "training-center"
  ) {
    return (
      <group
        position={[
          x,
          baseY,
          z,
        ]}
      >
        <mesh
          rotation={[
            -Math.PI / 2,
            0,
            0,
          ]}
        >
          <ringGeometry
            args={[
              1.2,
              1.65,
              24,
            ]}
          />

          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.85}
            side={
              THREE.DoubleSide
            }
          />
        </mesh>

        <mesh
          position={[
            0,
            1.4,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              0.18,
              0.18,
              2.8,
              8,
            ]}
          />

          <meshStandardMaterial
            color="#475569"
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>

        <mesh
          position={[
            0,
            2.9,
            0,
          ]}
        >
          <octahedronGeometry
            args={[
              0.45,
              0,
            ]}
          />

          <meshStandardMaterial
            color="#67e8f9"
            emissive="#06b6d4"
            emissiveIntensity={4}
          />
        </mesh>
      </group>
    );
  }

  /* ================================================= */
  /* PROJECT LAB                                     */
  /* ================================================= */

  if (
    location.id ===
    "project-lab"
  ) {
    return (
      <group
        position={[
          x,
          baseY,
          z,
        ]}
      >
        <mesh
          position={[
            0,
            1.4,
            0,
          ]}
        >
          <boxGeometry
            args={[
              1.8,
              2.8,
              1.8,
            ]}
          />

          <meshStandardMaterial
            color="#111827"
            metalness={0.6}
            roughness={0.25}
          />
        </mesh>

        <mesh
          position={[
            0,
            1.4,
            -0.94,
          ]}
        >
          <boxGeometry
            args={[
              1.25,
              1.7,
              0.05,
            ]}
          />

          <meshStandardMaterial
            color="#67e8f9"
            emissive="#06b6d4"
            emissiveIntensity={3}
            transparent
            opacity={0.9}
          />
        </mesh>

        <mesh
          position={[
            0,
            3.2,
            0,
          ]}
        >
          <sphereGeometry
            args={[
              0.32,
              16,
              16,
            ]}
          />

          <meshStandardMaterial
            color="#67e8f9"
            emissive="#22d3ee"
            emissiveIntensity={5}
          />
        </mesh>

        <pointLight
          position={[
            0,
            2,
            0,
          ]}
          intensity={2.5}
          distance={10}
          color="#22d3ee"
        />
      </group>
    );
  }

  /* ================================================= */
  /* MISSION BOARD                                   */
  /* ================================================= */

  if (
    location.id ===
    "mission-board"
  ) {
    return (
      <group
        position={[
          x,
          baseY,
          z,
        ]}
      >
        <mesh
          position={[
            0,
            2,
            0,
          ]}
        >
          <boxGeometry
            args={[
              2.5,
              3.2,
              0.35,
            ]}
          />

          <meshStandardMaterial
            color="#172033"
            metalness={0.45}
            roughness={0.35}
          />
        </mesh>

        <mesh
          position={[
            0,
            2,
            -0.2,
          ]}
        >
          <planeGeometry
            args={[
              1.9,
              2.5,
            ]}
          />

          <meshStandardMaterial
            color="#ef1d2d"
            emissive="#991b1b"
            emissiveIntensity={1.8}
          />
        </mesh>

        <mesh
          position={[
            0,
            4,
            0,
          ]}
        >
          <sphereGeometry
            args={[
              0.22,
              10,
              10,
            ]}
          />

          <meshStandardMaterial
            color="#67e8f9"
            emissive="#06b6d4"
            emissiveIntensity={5}
          />
        </mesh>
      </group>
    );
  }

  /* ================================================= */
  /* ACHIEVEMENT HQ                                  */
  /* ================================================= */

  if (
    location.id ===
    "achievement-hq"
  ) {
    return (
      <group
        position={[
          x,
          baseY,
          z,
        ]}
      >
        <mesh
          position={[
            0,
            1,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              1.4,
              1.7,
              1,
              10,
            ]}
          />

          <meshStandardMaterial
            color="#1f2937"
            metalness={0.55}
            roughness={0.3}
          />
        </mesh>

        <mesh
          position={[
            0,
            2.7,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              0.55,
              0.8,
              2.4,
              6,
            ]}
          />

          <meshStandardMaterial
            color="#facc15"
            emissive="#ca8a04"
            emissiveIntensity={2}
            metalness={0.5}
            roughness={0.25}
          />
        </mesh>

        <mesh
          position={[
            0,
            4.2,
            0,
          ]}
        >
          <octahedronGeometry
            args={[
              0.55,
              0,
            ]}
          />

          <meshStandardMaterial
            color="#facc15"
            emissive="#eab308"
            emissiveIntensity={4}
          />
        </mesh>
      </group>
    );
  }

  /* ================================================= */
  /* DEVELOPER ARCHIVE                               */
  /* ================================================= */

  if (
    location.id ===
    "developer-archive"
  ) {
    return (
      <group
        position={[
          x,
          baseY,
          z,
        ]}
      >
        <mesh
          position={[
            0,
            1.8,
            0,
          ]}
        >
          <boxGeometry
            args={[
              2.4,
              3.6,
              2.4,
            ]}
          />

          <meshStandardMaterial
            color="#0f172a"
            metalness={0.7}
            roughness={0.22}
          />
        </mesh>

        <mesh
          position={[
            0,
            1.8,
            -1.23,
          ]}
        >
          <boxGeometry
            args={[
              1.5,
              2.2,
              0.06,
            ]}
          />

          <meshStandardMaterial
            color="#22d3ee"
            emissive="#06b6d4"
            emissiveIntensity={2.5}
          />
        </mesh>

        <mesh
          position={[
            0,
            4,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              0.12,
              0.12,
              1.5,
              8,
            ]}
          />

          <meshStandardMaterial
            color="#64748b"
            metalness={0.8}
          />
        </mesh>
      </group>
    );
  }

  /* ================================================= */
  /* COMMUNICATION HQ                                */
  /* ================================================= */

  if (
    location.id ===
    "communication-hq"
  ) {
    return (
      <group
        position={[
          x,
          baseY,
          z,
        ]}
      >
        <mesh
          position={[
            0,
            2.5,
            0,
          ]}
        >
          <cylinderGeometry
            args={[
              0.1,
              0.16,
              5,
              8,
            ]}
          />

          <meshStandardMaterial
            color="#64748b"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        <mesh
          position={[
            0,
            4.8,
            0,
          ]}
        >
          <torusGeometry
            args={[
              0.8,
              0.08,
              8,
              24,
            ]}
          />

          <meshBasicMaterial
            color="#67e8f9"
            transparent
            opacity={0.85}
          />
        </mesh>

        <mesh
          position={[
            0,
            4.8,
            0,
          ]}
        >
          <torusGeometry
            args={[
              0.45,
              0.06,
              8,
              24,
            ]}
          />

          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>
    );
  }

  /* ================================================= */
  /* DEVELOPER HUB                                   */
  /* ================================================= */

  if (
    location.id ===
    "developer-hub"
  ) {
    return (
      <group
        position={[
          x,
          baseY,
          z,
        ]}
      >
        <mesh
          position={[
            0,
            1.5,
            0,
          ]}
        >
          <boxGeometry
            args={[
              2.6,
              2.2,
              1.8,
            ]}
          />

          <meshStandardMaterial
            color="#111827"
            metalness={0.65}
            roughness={0.25}
          />
        </mesh>

        <mesh
          position={[
            0,
            1.8,
            -0.94,
          ]}
        >
          <planeGeometry
            args={[
              1.8,
              1.1,
            ]}
          />

          <meshStandardMaterial
            color="#67e8f9"
            emissive="#06b6d4"
            emissiveIntensity={3}
          />
        </mesh>

        <mesh
          position={[
            0,
            3.3,
            0,
          ]}
        >
          <boxGeometry
            args={[
              1.1,
              0.18,
              0.55,
            ]}
          />

          <meshStandardMaterial
            color="#ef1d2d"
            emissive="#ef1d2d"
            emissiveIntensity={2}
          />
        </mesh>
      </group>
    );
  }

  return null;
}

/* ================================================= */
/* DISTANT BUILDINGS                                */
/* ================================================= */

function Skyline() {
  const skyline = useMemoSkyline();

  return (
    <group>
      {skyline.map(
        (building) => (
          <mesh
            key={
              building.id
            }
            position={[
              building.x,
              building.height /
                2 -
                1,
              building.z,
            ]}
          >
            <boxGeometry
              args={[
                building.width,
                building.height,
                building.depth,
              ]}
            />

            <meshStandardMaterial
              color={
                building.id % 3 === 0
                  ? "#0b1426"
                  : "#0a1120"
              }
              roughness={0.9}
              metalness={0.08}
            />
          </mesh>
        ),
      )}
    </group>
  );
}

function useMemoSkyline() {
  return useMemo(() => {
    const result: {
      id: number;
      x: number;
      z: number;
      width: number;
      depth: number;
      height: number;
    }[] = [];

    let id = 0;

    for (
      let x = -55;
      x <= 55;
      x += 7
    ) {
      if (
        Math.abs(x) <
        18
      ) {
        continue;
      }

      const height =
        8 +
        ((Math.abs(
          x,
        ) *
          7) %
          18);

      result.push({
        id: id++,
        x,
        z: -42,
        width:
          4 +
          (id % 3),
        depth: 4,
        height,
      });

      result.push({
        id: id++,
        x,
        z: 42,
        width:
          4 +
          (id % 4),
        depth: 4,
        height:
          7 +
          ((id * 5) %
            16),
      });
    }

    for (
      let z = -35;
      z <= 35;
      z += 8
    ) {
      if (
        Math.abs(z) <
        16
      ) {
        continue;
      }

      const height =
        9 +
        ((Math.abs(
          z,
        ) *
          5) %
          17);

      result.push({
        id: id++,
        x: -45,
        z,
        width: 4,
        depth:
          4 +
          (id % 3),
        height,
      });

      result.push({
        id: id++,
        x: 45,
        z,
        width: 4,
        depth:
          4 +
          (id % 4),
        height:
          8 +
          ((id * 4) %
            18),
      });
    }

    return result;
  }, []);
}

/* ================================================= */
/* STREET LIGHT                                    */
/* ================================================= */

function StreetLight({
  position,
  rotation = 0,
}: {
  position: [
    number,
    number,
    number,
  ];

  rotation?: number;
}) {
  return (
    <group
      position={position}
      rotation={[
        0,
        rotation,
        0,
      ]}
    >
      {/* Pole */}

      <mesh
        position={[
          0,
          1.7,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.07,
            0.09,
            3.4,
            8,
          ]}
        />

        <meshStandardMaterial
          color="#475569"
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>

      {/* Arm */}

      <mesh
        position={[
          0.45,
          3.25,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.9,
            0.08,
            0.08,
          ]}
        />

        <meshStandardMaterial
          color="#64748b"
          metalness={0.65}
          roughness={0.4}
        />
      </mesh>

      {/* Lamp */}

      <mesh
        position={[
          0.88,
          3.18,
          0,
        ]}
      >
        <sphereGeometry
          args={[
            0.14,
            8,
            8,
          ]}
        />

        <meshStandardMaterial
          color="#f0fdfa"
          emissive="#67e8f9"
          emissiveIntensity={5}
        />
      </mesh>

      <pointLight
        position={[
          0.88,
          3.1,
          0,
        ]}
        intensity={1.25}
        distance={8}
        decay={2}
        color="#67e8f9"
      />
    </group>
  );
}

/* ================================================= */
/* CITY LIGHTS                                     */
/* ================================================= */

function CityLights() {
  const lights: [
    number,
    number,
    number,
  ][] = [
    [-6, 0, -2],
    [6, 0, -2],
    [-6, 0, 2],
    [6, 0, 2],
    [-2, 0, -6],
    [2, 0, -6],
    [-2, 0, 6],
    [2, 0, 6],

    [-12, 0, -12],
    [12, 0, -12],
    [-12, 0, 12],
    [12, 0, 12],
  ];

  return (
    <group>
      {lights.map(
        (
          position,
          index,
        ) => (
          <StreetLight
            key={index}
            position={[
              position[0],
              -1,
              position[2],
            ]}
            rotation={
              index % 2 ===
              0
                ? 0
                : Math.PI
            }
          />
        ),
      )}
    </group>
  );
}

/* ================================================= */
/* CITY ATMOSPHERE                                  */
/* ================================================= */

function CityAtmosphere() {
  const pointsRef = useRef<THREE.Points>(null);

  const particleData = useMemo(() => {
    const count = 90;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 10 + ((i * 17) % 45);
      positions[i * 3] =
        Math.cos(angle * 1.7) * radius +
        ((i * 13) % 9) - 4;
      positions[i * 3 + 1] =
        0.4 + ((i * 29) % 90) / 10;
      positions[i * 3 + 2] =
        Math.sin(angle * 1.3) * radius +
        ((i * 7) % 11) - 5;
    }

    return positions;
  }, []);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    points.rotation.y += Math.min(delta, 0.033) * 0.018;
    points.rotation.x =
      Math.sin(performance.now() / 10000) * 0.025;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[
            particleData,
            3,
          ]}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#67e8f9"
        size={0.055}
        transparent
        opacity={0.38}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ================================================= */
/* DISTRICT GLOW                                   */
/* ================================================= */

function DistrictGlow({
  position,
}: {
  position: [
    number,
    number,
    number,
  ];
}) {
  return (
    <mesh
      position={[
        position[0],
        -0.91,
        position[2],
      ]}
      rotation={[
        -Math.PI / 2,
        0,
        0,
      ]}
    >
      <circleGeometry
        args={[
          2.7,
          32,
        ]}
      />

      <meshBasicMaterial
        color="#06b6d4"
        transparent
        opacity={0.055}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ================================================= */
/* LOCATION LABEL                                  */
/* ================================================= */

function LocationLabel({
  name,
  position,
}: {
  name: string;

  position: [
    number,
    number,
    number,
  ];
}) {
  return (
    <Html
      position={[
        position[0],
        6,
        position[2],
      ]}
      center
      distanceFactor={12}
      style={{
        pointerEvents:
          "none",

        whiteSpace:
          "nowrap",

        fontFamily:
          "Arial, sans-serif",

        fontSize: "12px",

        fontWeight: "700",

        letterSpacing:
          "2px",

        color:
          "#67e8f9",

        textShadow:
          "0 0 8px rgba(103, 232, 249, 0.8)",
      }}
    >
      {name.toUpperCase()}
    </Html>
  );
}

/* ================================================= */
/* CAMERA FOLLOW                                   */
/* ================================================= */

function CameraFollow({
  target,
}: {
  target: React.RefObject<
    THREE.Group | null
  >;
}) {
  const { camera } =
    useThree();

  useFrame(() => {
    const hero =
      target.current;

    if (!hero) return;

    const cinematicHeight =
      hero.position.y +
      9 +
      Math.sin(
        performance.now() / 4200,
      ) *
        0.18;

    const desiredPosition =
      new THREE.Vector3(
        hero.position.x +
          10,
        cinematicHeight,
        hero.position.z +
          14,
      );

    camera.position.lerp(
      desiredPosition,
      0.08,
    );

    const lookAtPosition =
      new THREE.Vector3(
        hero.position.x,
        hero.position.y +
          1,
        hero.position.z,
      );

    camera.lookAt(
      lookAtPosition,
    );
  });

  return null;
}

/* ================================================= */
/* INTERACTION DETECTOR                            */
/* ================================================= */

function InteractionDetector({
  playerRef,
  onLocationChange,
  onTargetChange,
  onEnter,
}: {
  playerRef: React.RefObject<
    THREE.Group | null
  >;

  onLocationChange: (
    location:
      | string
      | null,
  ) => void;

  onTargetChange: (
    location:
      | string
      | null,
  ) => void;

  onEnter: (
    location: string,
  ) => void;
}) {
  const { award } =
    useGame();

  const nearbyLocationRef =
    useRef<
      string | null
    >(null);

  const lastDiscoveredRef =
    useRef<
      string | null
    >(null);

  const xpRewards: Record<
    string,
    number
  > = {
    "home-base": 50,
    "origin-center": 100,
    "training-center": 100,
    "project-lab": 200,
    "mission-board": 150,
    "achievement-hq": 150,
    "developer-archive": 100,
    "communication-hq": 100,
    "developer-hub": 150,
  };

  useFrame(() => {
    const player =
      playerRef.current;

    if (!player) return;

    /* ====================================== */
    /* LOCATION FOR E                         */
    /* ====================================== */

    let closestLocation:
      | string
      | null = null;

    let closestDistance =
      Infinity;

    for (
      const location of cityLocations
    ) {
      const dx =
        player.position.x -
        location.position[0];

      const dz =
        player.position.z -
        location.position[2];

      const distance =
        Math.sqrt(
          dx * dx +
            dz * dz,
        );

      if (
        distance < 15 &&
        distance <
          closestDistance
      ) {
        closestDistance =
          distance;

        closestLocation =
          location.name;
      }
    }

    /* ====================================== */
    /* DISCOVER + XP                         */
    /* ====================================== */

    if (
      closestLocation &&
      closestLocation !==
        lastDiscoveredRef.current
    ) {
      const locationData =
        cityLocations.find(
          (location) =>
            location.name ===
            closestLocation,
        );

      if (locationData) {
        award(
          locationData.id,
          xpRewards[
            locationData.id
          ] ?? 0,
          `${locationData.name} discovered`,
        );
      }

      lastDiscoveredRef.current =
        closestLocation;
    }

    nearbyLocationRef.current =
      closestLocation;

    onLocationChange(
      closestLocation,
    );

    /* ====================================== */
    /* WEB TARGET FOR F                      */
    /* ====================================== */

    let targetLocation:
      | string
      | null = null;

    let targetDistance =
      Infinity;

    for (
      const location of cityLocations
    ) {
      const dx =
        player.position.x -
        location.position[0];

      const dz =
        player.position.z -
        location.position[2];

      const distance =
        Math.sqrt(
          dx * dx +
            dz * dz,
        );

      if (
        distance > 8 &&
        distance <= 35 &&
        distance <
          targetDistance
      ) {
        targetDistance =
          distance;

        targetLocation =
          location.name;
      }
    }

    onTargetChange(
      targetLocation,
    );
  });

  /* ====================================== */
  /* E = ENTER LOCATION                    */
  /* ====================================== */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key.toLowerCase() !==
        "e"
      ) {
        return;
      }

      const location =
        nearbyLocationRef.current;

      if (location) {
        onEnter(location);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [onEnter]);

  return null;
}


/* ================================================= */
/* CINEMATIC MISSION SYSTEM                         */
/* ================================================= */

type MissionCinematicData = {
  title: string;
  subtitle: string;
  objective: string;
  xp: number;
};

const cinematicMissions: Record<string, MissionCinematicData> = {
  "Home Base": {
    title: "ORIGIN PROTOCOL",
    subtitle: "HOME BASE",
    objective: "Establish your developer headquarters.",
    xp: 50,
  },
  "Origin Center": {
    title: "ORIGIN FILE",
    subtitle: "ABOUT / EDUCATION",
    objective: "Review the story behind the developer.",
    xp: 100,
  },
  "Training Center": {
    title: "SKILL SYNC",
    subtitle: "TRAINING CENTER",
    objective: "Inspect the abilities powering the portfolio.",
    xp: 100,
  },
  "Project Lab": {
    title: "PROJECT RAID",
    subtitle: "BOSS DISTRICT • 3 TARGETS",
    objective: "Enter the lab and choose a project mission: RockyX, Automated Resume Analyzer, or Learning Gap Detector.",
    xp: 200,
  },
  "Mission Board": {
    title: "FIELD RECORD",
    subtitle: "MISSION BOARD",
    objective: "Review professional missions and experience.",
    xp: 150,
  },
  "Achievement HQ": {
    title: "TROPHY VAULT",
    subtitle: "ACHIEVEMENT HQ",
    objective: "Unlock the milestones earned so far.",
    xp: 150,
  },
  "Developer Archive": {
    title: "ARCHIVE ACCESS",
    subtitle: "DEVELOPER ARCHIVE",
    objective: "Open the developer resume archive.",
    xp: 100,
  },
  "Communication HQ": {
    title: "COMMS ONLINE",
    subtitle: "COMMUNICATION HQ",
    objective: "Connect through professional channels.",
    xp: 100,
  },
  "Developer Hub": {
    title: "CODE NETWORK",
    subtitle: "DEVELOPER HUB",
    objective: "Explore the public coding network.",
    xp: 150,
  },
};

type BossMission = {
  id: string;
  codename: string;
  title: string;
  classification: "BOSS MISSION" | "MISSION";
  objective: string;
  technologies: string[];
  xp: number;
};

const bossMissions: BossMission[] = [
  {
    id: "rockyx",
    codename: "PROJECT HAIL MARY",
    title: "RockyX — AI Desktop Companion",
    classification: "BOSS MISSION",
    objective:
      "Investigate an AI-powered desktop companion with voice interaction, memory management, internet search, and study-assistant features.",
    technologies: ["Python", "AI/ML", "Local AI", "Offline Speech"],
    xp: 500,
  },
  {
    id: "resume-analyzer",
    codename: "PROFILE SCAN",
    title: "Automated Resume Analyzer",
    classification: "MISSION",
    objective:
      "Analyze resumes, extract candidate information, match skills, generate analytics and recommendations, and guide resume improvement.",
    technologies: ["Python", "AI/ML", "Data Analysis"],
    xp: 350,
  },
  {
    id: "gap-detector",
    codename: "KNOWLEDGE GAP",
    title: "Learning Gap Detector",
    classification: "MISSION",
    objective:
      "Identify weak learning areas from academic performance data and surface personalized recommendations, trends, and learning patterns.",
    technologies: ["Python", "Data Analysis", "Data Visualization"],
    xp: 350,
  },
];




type PortfolioProgress = {
  xp: number;
  completedMissionIds: string[];
};

const PROGRESS_STORAGE_KEY = "web-of-code-progress-v1";

function getStoredProgress(): PortfolioProgress {
  if (typeof window === "undefined") {
    return { xp: 0, completedMissionIds: [] };
  }

  try {
    const raw = window.localStorage.getItem(
      PROGRESS_STORAGE_KEY
    );

    if (!raw) {
      return { xp: 0, completedMissionIds: [] };
    }

    const parsed = JSON.parse(raw);

    return {
      xp:
        typeof parsed?.xp === "number"
          ? Math.max(0, parsed.xp)
          : 0,
      completedMissionIds: Array.isArray(
        parsed?.completedMissionIds
      )
        ? parsed.completedMissionIds.filter(
            (id: unknown): id is string =>
              typeof id === "string"
          )
        : [],
    };
  } catch {
    return { xp: 0, completedMissionIds: [] };
  }
}

function getLevelFromXp(xp: number) {
  return Math.max(1, Math.floor(xp / 500) + 1);
}

function ProgressOverlay({
  progress,
}: {
  progress: PortfolioProgress;
}) {
  const level = getLevelFromXp(progress.xp);
  const levelBase = (level - 1) * 500;
  const progressInLevel =
    progress.xp - levelBase;
  const percent = Math.min(
    100,
    (progressInLevel / 500) * 100
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 18,
        left: 18,
        zIndex: 45,
        width: "min(310px, calc(100vw - 36px))",
        padding: "12px 14px",
        border: "1px solid rgba(103,232,249,.2)",
        background: "rgba(3,7,18,.76)",
        backdropFilter: "blur(8px)",
        color: "#e2e8f0",
        fontFamily: "monospace",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: ".08em",
        }}
      >
        <span style={{ color: "#67e8f9" }}>
          LVL {level}
        </span>
        <span>{progress.xp} XP</span>
      </div>

      <div
        style={{
          marginTop: 9,
          height: 5,
          overflow: "hidden",
          background: "rgba(148,163,184,.15)",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "#67e8f9",
            boxShadow: "0 0 12px rgba(103,232,249,.7)",
            transition: "width .35s ease",
          }}
        />
      </div>

      <div
        style={{
          marginTop: 7,
          color: "#64748b",
          fontSize: 9,
          letterSpacing: ".1em",
        }}
      >
        {progressInLevel}/500 XP TO NEXT LEVEL
      </div>
    </div>
  );
}

function MissionCompleteOverlay({
  mission,
  onContinue,
}: {
  mission: BossMission;
  onContinue: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "rgba(3,7,18,.94)",
      }}
    >
      <div
        style={{
          width: "min(620px, 92vw)",
          padding: "clamp(28px, 6vw, 54px)",
          textAlign: "center",
          border: "1px solid rgba(103,232,249,.35)",
          background:
            "linear-gradient(145deg, rgba(8,30,42,.92), rgba(8,15,30,.96))",
          boxShadow: "0 0 70px rgba(103,232,249,.08)",
        }}
      >
        <div
          style={{
            color: "#67e8f9",
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 950,
            letterSpacing: ".24em",
          }}
        >
          MISSION COMPLETE
        </div>

        <div
          style={{
            marginTop: 14,
            fontSize: "clamp(30px, 6vw, 58px)",
            lineHeight: 1,
            fontWeight: 950,
            letterSpacing: "-.04em",
          }}
        >
          {mission.title}
        </div>

        <div
          style={{
            marginTop: 22,
            color: "#67e8f9",
            fontFamily: "monospace",
            fontSize: 22,
            fontWeight: 950,
          }}
        >
          +{mission.xp} XP
        </div>

        <div
          style={{
            marginTop: 10,
            color: "#94a3b8",
            fontSize: 13,
          }}
        >
          Progress saved locally on this device.
        </div>

        <button
          onClick={onContinue}
          style={{
            marginTop: 28,
            border: "1px solid rgba(103,232,249,.42)",
            background: "rgba(8,30,42,.9)",
            color: "#ecfeff",
            padding: "12px 18px",
            cursor: "pointer",
            fontFamily: "monospace",
            fontWeight: 900,
            letterSpacing: ".08em",
          }}
        >
          RETURN TO PROJECT LAB →
        </button>
      </div>
    </div>
  );
}

function PlayableProjectMission({
  mission,
  onBack,
  onComplete,
}: {
  mission: BossMission;
  onBack: () => void;
  onComplete: (xp: number) => void;
}) {
  const [stage, setStage] = useState(0);

  const stages = [
    {
      label: "01 // OBJECTIVE",
      title: "MISSION OBJECTIVE",
      body: mission.objective,
    },
    {
      label: "02 // SYSTEM",
      title: "CAPABILITY SCAN",
      body: `Core areas documented for this mission: ${mission.technologies.join(
        " • "
      )}.`,
    },
    {
      label: "03 // EVIDENCE",
      title: "PROJECT EVIDENCE",
      body:
        "Review the documented project information and inspect the technology stack before marking the mission complete.",
    },
  ];

  const current = stages[stage];

  const isFinal =
    stage === stages.length - 1;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onBack();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setStage((value) => Math.max(value - 1, 0));
        return;
      }

      if (event.key === "ArrowRight") {
        if (!isFinal) {
          event.preventDefault();
          setStage((value) =>
            Math.min(value + 1, stages.length - 1)
          );
        }
        return;
      }

      if (event.key === "Enter" && isFinal) {
        event.preventDefault();
        onComplete(mission.xp);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [isFinal, mission.xp, onBack, onComplete, stages.length]);

  if (!current) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 70,
        overflowY: "auto",
        padding: "clamp(22px, 5vw, 70px)",
        background:
          "radial-gradient(circle at 72% 25%, rgba(103,232,249,.08), transparent 34%), rgba(3,7,18,.98)",
        color: "#f8fafc",
      }}
    >
      <style>
        {`
          @keyframes missionStageIn {
            from { opacity: 0; transform: translateX(18px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes missionSweep {
            from { transform: translateX(-120%); }
            to { transform: translateX(520%); }
          }
        `}
      </style>

      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          animation: "missionStageIn 220ms ease-out",
        }}
      >
        <button
          onClick={onBack}
          style={{
            border: "1px solid rgba(148,163,184,.25)",
            background: "rgba(15,23,42,.75)",
            color: "#cbd5e1",
            padding: "9px 13px",
            cursor: "pointer",
            fontFamily: "monospace",
            fontWeight: 800,
          }}
        >
          ← MISSION SELECT
        </button>

        <div
          style={{
            marginTop: 32,
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                color:
                  mission.classification === "BOSS MISSION"
                    ? "#fca5a5"
                    : "#67e8f9",
                fontFamily: "monospace",
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: ".2em",
              }}
            >
              {mission.classification} // {mission.codename}
            </div>

            <h1
              style={{
                margin: "10px 0 0",
                fontSize: "clamp(32px, 6vw, 64px)",
                lineHeight: 1,
                letterSpacing: "-.045em",
              }}
            >
              {mission.title}
            </h1>
          </div>

          <div
            style={{
              alignSelf: "flex-end",
              border: "1px solid rgba(103,232,249,.28)",
              padding: "10px 14px",
              color: "#67e8f9",
              fontFamily: "monospace",
              fontWeight: 900,
            }}
          >
            REWARD +{mission.xp} XP
          </div>
        </div>

        <div
          style={{
            marginTop: 30,
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18,
          }}
        >
          <div
            style={{
              minHeight: 310,
              padding: "clamp(22px, 4vw, 38px)",
              border: "1px solid rgba(103,232,249,.2)",
              background: "rgba(8,15,30,.78)",
              animation: "missionStageIn 220ms ease-out",
            }}
          >
            <div
              style={{
                color: "#67e8f9",
                fontFamily: "monospace",
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: ".15em",
              }}
            >
              {current.label}
            </div>

            <h2
              style={{
                margin: "16px 0 14px",
                fontSize: "clamp(25px, 4vw, 40px)",
              }}
            >
              {current.title}
            </h2>

            <p
              style={{
                color: "#cbd5e1",
                lineHeight: 1.75,
                fontSize: 16,
                maxWidth: 760,
              }}
            >
              {current.body}
            </p>

            <div
              style={{
                marginTop: 26,
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {mission.technologies.map((tech) => (
                <span
                  key={tech}
                  style={{
                    border: "1px solid rgba(103,232,249,.2)",
                    padding: "7px 10px",
                    color: "#a5f3fc",
                    fontFamily: "monospace",
                    fontSize: 11,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(148,163,184,.16)",
              background: "rgba(8,15,30,.55)",
              padding: 18,
              alignSelf: "start",
            }}
          >
            <div
              style={{
                color: "#64748b",
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: ".16em",
                fontWeight: 900,
              }}
            >
              MISSION PROGRESS
            </div>

            {stages.map((item, index) => (
              <div
                key={item.label}
                style={{
                  marginTop: 15,
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  color:
                    index <= stage
                      ? "#67e8f9"
                      : "#475569",
                  fontFamily: "monospace",
                  fontSize: 11,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background:
                      index <= stage
                        ? "#67e8f9"
                        : "#334155",
                    boxShadow:
                      index <= stage
                        ? "0 0 12px rgba(103,232,249,.7)"
                        : "none",
                  }}
                />
                {item.label}
              </div>
            ))}

            <div
              style={{
                marginTop: 24,
                height: 2,
                overflow: "hidden",
                background: "rgba(103,232,249,.12)",
              }}
            >
              <div
                style={{
                  width: `${((stage + 1) / stages.length) * 100}%`,
                  height: "100%",
                  background: "#67e8f9",
                  transition: "width .25s ease",
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {!isFinal ? (
            <button
              onClick={() => setStage((value) => value + 1)}
              style={{
                border: "1px solid rgba(103,232,249,.42)",
                background: "rgba(8,30,42,.85)",
                color: "#a5f3fc",
                padding: "13px 18px",
                cursor: "pointer",
                fontFamily: "monospace",
                fontWeight: 900,
                letterSpacing: ".08em",
              }}
            >
              NEXT OBJECTIVE →
            </button>
          ) : (
            <button
              onClick={() => onComplete(mission.xp)}
              style={{
                border: "1px solid rgba(103,232,249,.55)",
                background: "#082f49",
                color: "#ecfeff",
                padding: "14px 20px",
                cursor: "pointer",
                fontFamily: "monospace",
                fontWeight: 950,
                letterSpacing: ".08em",
                boxShadow: "0 0 28px rgba(103,232,249,.12)",
              }}
            >
              COMPLETE MISSION ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  requirement: string;
  unlocked: (progress: PortfolioProgress) => boolean;
};

const achievementDefinitions: AchievementDefinition[] = [
  {
    id: "first-mission",
    title: "FIRST DEPLOYMENT",
    description: "Complete your first project mission.",
    requirement: "Complete 1 project mission",
    unlocked: (progress) =>
      progress.completedMissionIds.length >= 1,
  },
  {
    id: "project-raider",
    title: "PROJECT RAIDER",
    description: "Clear every project mission in the Project Lab.",
    requirement: "Complete all 3 project missions",
    unlocked: (progress) =>
      bossMissions.every((mission) =>
        progress.completedMissionIds.includes(mission.id)
      ),
  },
  {
    id: "level-two",
    title: "SYSTEM UPGRADE",
    description: "Reach Level 2 through game progression.",
    requirement: "Reach Level 2",
    unlocked: (progress) =>
      getLevelFromXp(progress.xp) >= 2,
  },
  {
    id: "xp-hunter",
    title: "XP HUNTER",
    description: "Build a 1000 XP game progression score.",
    requirement: "Earn 1000 XP",
    unlocked: (progress) =>
      progress.xp >= 1000,
  },
];


type SkillNode = {
  id: string;
  name: string;
  category: string;
  level: string;
  description: string;
  relatedMissionIds: string[];
};

const skillNodes: SkillNode[] = [
  {
    id: "python",
    name: "PYTHON",
    category: "PROGRAMMING",
    level: "CORE",
    description: "Primary programming skill used across analytics and AI-oriented projects.",
    relatedMissionIds: ["rockyx", "resume-analyzer", "gap-detector"],
  },
  {
    id: "java",
    name: "JAVA",
    category: "PROGRAMMING",
    level: "CORE",
    description: "Programming language listed in the developer skill set.",
    relatedMissionIds: [],
  },
  {
    id: "c-cpp",
    name: "C / C++",
    category: "PROGRAMMING",
    level: "CORE",
    description: "Programming languages listed in the developer skill set.",
    relatedMissionIds: [],
  },
  {
    id: "data-analysis",
    name: "DATA ANALYSIS",
    category: "DATA",
    level: "CORE",
    description: "Analysis, cleaning, preprocessing, exploration and reporting.",
    relatedMissionIds: ["resume-analyzer", "gap-detector"],
  },
  {
    id: "big-data",
    name: "BIG DATA ANALYTICS",
    category: "DATA",
    level: "EXPOSURE",
    description: "Academic and international exposure to Big Data Analytics.",
    relatedMissionIds: [],
  },
  {
    id: "data-mining",
    name: "DATA MINING",
    category: "DATA",
    level: "EXPOSURE",
    description: "Academic and international exposure to Data Mining.",
    relatedMissionIds: [],
  },
  {
    id: "visualization",
    name: "DATA VISUALIZATION",
    category: "DATA",
    level: "CORE",
    description: "Visualizing trends, patterns and analytical results.",
    relatedMissionIds: ["gap-detector"],
  },
  {
    id: "machine-learning",
    name: "MACHINE LEARNING",
    category: "AI / ML",
    level: "CORE",
    description: "AI/ML capability listed in the developer skill set.",
    relatedMissionIds: ["rockyx", "resume-analyzer"],
  },
  {
    id: "prompt-engineering",
    name: "PROMPT ENGINEERING",
    category: "AI / ML",
    level: "CORE",
    description: "Prompt engineering capability and certification.",
    relatedMissionIds: ["rockyx"],
  },
  {
    id: "html-css-js",
    name: "WEB DEVELOPMENT",
    category: "WEB",
    level: "CORE",
    description: "HTML, CSS and JavaScript fundamentals for responsive front-end work.",
    relatedMissionIds: [],
  },
  {
    id: "git-github",
    name: "GIT / GITHUB",
    category: "TOOLS",
    level: "CORE",
    description: "Version control and GitHub usage listed in the developer skill set.",
    relatedMissionIds: [],
  },
  {
    id: "cloud",
    name: "CLOUD COMPUTING",
    category: "CLOUD",
    level: "EXPOSURE",
    description: "Academic and international exposure to Cloud Computing and Cloud Architecture.",
    relatedMissionIds: [],
  },
];


type CharacterUpgrade = {
  level: number;
  title: string;
  description: string;
  unlock: string;
};

const characterUpgrades: CharacterUpgrade[] = [
  {
    level: 1,
    title: "BASE LOADOUT",
    description: "Core suit configuration online.",
    unlock: "Starting state",
  },
  {
    level: 2,
    title: "ENERGY CORE",
    description: "Cyan suit-core accents become more pronounced.",
    unlock: "Reach Level 2",
  },
  {
    level: 3,
    title: "MOTION SYNC",
    description: "Movement identity is upgraded for the next traversal pass.",
    unlock: "Reach Level 3",
  },
  {
    level: 4,
    title: "TACTICAL FRAME",
    description: "Advanced suit detailing becomes available.",
    unlock: "Reach Level 4",
  },
  {
    level: 5,
    title: "APEX LOADOUT",
    description: "Highest planned visual progression tier.",
    unlock: "Reach Level 5",
  },
];

function CharacterUpgradePanel({
  progress,
  onClose,
}: {
  progress: PortfolioProgress;
  onClose: () => void;
}) {
  const currentLevel =
    getLevelFromXp(progress.xp);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 68,
        overflowY: "auto",
        padding: "clamp(24px, 5vw, 72px)",
        background:
          "radial-gradient(circle at 70% 10%, rgba(103,232,249,.08), transparent 34%), rgba(3,7,18,.98)",
        color: "#f8fafc",
      }}
    >
      <style>
        {`
          @keyframes upgradeIn {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes upgradePulse {
            0%, 100% { opacity: .55; }
            50% { opacity: 1; }
          }
        `}
      </style>

      <div
        style={{
          maxWidth: 1050,
          margin: "0 auto",
          animation: "upgradeIn 240ms ease-out",
        }}
      >
        <button
          onClick={onClose}
          style={{
            border: "1px solid rgba(148,163,184,.25)",
            background: "rgba(15,23,42,.75)",
            color: "#cbd5e1",
            padding: "9px 13px",
            cursor: "pointer",
            fontFamily: "monospace",
            fontWeight: 800,
          }}
        >
          ← RETURN TO CITY
        </button>

        <div
          style={{
            marginTop: 34,
            color: "#67e8f9",
            fontFamily: "monospace",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: ".22em",
          }}
        >
          CHARACTER SYSTEM // LOADOUT PROGRESSION
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              margin: "10px 0 8px",
              fontSize: "clamp(38px, 7vw, 76px)",
              lineHeight: .95,
              letterSpacing: "-.05em",
            }}
          >
            SUIT UP
          </h1>

          <div
            style={{
              color: "#67e8f9",
              fontFamily: "monospace",
              fontWeight: 900,
            }}
          >
            CURRENT LEVEL: {currentLevel}
          </div>
        </div>

        <p
          style={{
            maxWidth: 760,
            color: "#94a3b8",
            lineHeight: 1.6,
            marginBottom: 30,
          }}
        >
          Game progression tiers visually represent portfolio-game growth.
          They do not represent real-world experience or qualifications.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 14,
          }}
        >
          {characterUpgrades.map((upgrade) => {
            const unlocked =
              currentLevel >= upgrade.level;

            return (
              <div
                key={upgrade.level}
                style={{
                  minHeight: 190,
                  padding: 20,
                  border: unlocked
                    ? "1px solid rgba(103,232,249,.4)"
                    : "1px solid rgba(71,85,105,.28)",
                  background: unlocked
                    ? "linear-gradient(145deg, rgba(8,30,42,.9), rgba(8,15,30,.94))"
                    : "rgba(8,15,30,.68)",
                  opacity: unlocked ? 1 : .62,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: unlocked
                        ? "#67e8f9"
                        : "#64748b",
                      fontFamily: "monospace",
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: ".14em",
                    }}
                  >
                    LVL {upgrade.level}
                  </span>

                  <span
                    style={{
                      fontSize: 18,
                      animation: unlocked
                        ? "upgradePulse 1.6s infinite"
                        : "none",
                    }}
                  >
                    {unlocked ? "◈" : "🔒"}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: 18,
                    fontSize: 20,
                    fontWeight: 900,
                  }}
                >
                  {upgrade.title}
                </div>

                <div
                  style={{
                    marginTop: 9,
                    color: "#94a3b8",
                    lineHeight: 1.5,
                    fontSize: 12,
                  }}
                >
                  {upgrade.description}
                </div>

                <div
                  style={{
                    marginTop: 15,
                    color: unlocked
                      ? "#67e8f9"
                      : "#64748b",
                    fontFamily: "monospace",
                    fontSize: 9,
                    fontWeight: 800,
                  }}
                >
                  {unlocked
                    ? "UNLOCKED"
                    : upgrade.unlock}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SkillTreePanel({
  progress,
  onClose,
}: {
  progress: PortfolioProgress;
  onClose: () => void;
}) {
  const [selectedSkill, setSelectedSkill] =
    useState<SkillNode | null>(null);

  const missionCount = (
    missionIds: string[]
  ) =>
    missionIds.filter((id) =>
      progress.completedMissionIds.includes(id)
    ).length;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 66,
        overflowY: "auto",
        padding: "clamp(24px, 5vw, 72px)",
        background:
          "radial-gradient(circle at 30% 0%, rgba(103,232,249,.08), transparent 34%), rgba(3,7,18,.98)",
        color: "#f8fafc",
      }}
    >
      <style>
        {`
          @keyframes skillIn {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes skillPulse {
            0%, 100% { opacity: .35; }
            50% { opacity: 1; }
          }
        `}
      </style>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          animation: "skillIn 240ms ease-out",
        }}
      >
        <button
          onClick={onClose}
          style={{
            border: "1px solid rgba(148,163,184,.25)",
            background: "rgba(15,23,42,.75)",
            color: "#cbd5e1",
            padding: "9px 13px",
            cursor: "pointer",
            fontFamily: "monospace",
            fontWeight: 800,
          }}
        >
          ← RETURN TO CITY
        </button>

        <div
          style={{
            marginTop: 34,
            color: "#67e8f9",
            fontFamily: "monospace",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: ".22em",
          }}
        >
          TRAINING CENTER // ABILITY MATRIX
        </div>

        <h1
          style={{
            margin: "10px 0 8px",
            fontSize: "clamp(38px, 7vw, 76px)",
            lineHeight: .95,
            letterSpacing: "-.05em",
          }}
        >
          SKILL TREE
        </h1>

        <p
          style={{
            maxWidth: 760,
            color: "#94a3b8",
            lineHeight: 1.6,
            marginBottom: 30,
          }}
        >
          Explore the developer's documented skill set. Mission links show
          where a skill is connected to the portfolio's project gameplay.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          {skillNodes.map((skill) => {
            const linkedCompleted =
              missionCount(skill.relatedMissionIds);
            const linkedTotal =
              skill.relatedMissionIds.length;

            return (
              <button
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                style={{
                  minHeight: 175,
                  padding: 20,
                  textAlign: "left",
                  border: "1px solid rgba(103,232,249,.18)",
                  background:
                    "linear-gradient(145deg, rgba(8,25,38,.78), rgba(8,15,30,.9))",
                  color: "#f8fafc",
                  cursor: "pointer",
                  transition: "transform .18s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      color: "#67e8f9",
                      fontFamily: "monospace",
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: ".14em",
                    }}
                  >
                    {skill.category}
                  </span>

                  <span
                    style={{
                      color: "#64748b",
                      fontFamily: "monospace",
                      fontSize: 9,
                    }}
                  >
                    {skill.level}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: 16,
                    fontSize: 20,
                    fontWeight: 900,
                  }}
                >
                  {skill.name}
                </div>

                <div
                  style={{
                    marginTop: 9,
                    color: "#94a3b8",
                    lineHeight: 1.45,
                    fontSize: 12,
                  }}
                >
                  {skill.description}
                </div>

                {linkedTotal > 0 && (
                  <div
                    style={{
                      marginTop: 14,
                      color:
                        linkedCompleted === linkedTotal
                          ? "#67e8f9"
                          : "#64748b",
                      fontFamily: "monospace",
                      fontSize: 9,
                    }}
                  >
                    MISSION LINKS {linkedCompleted}/{linkedTotal}
                    {linkedCompleted === linkedTotal && (
                      <span
                        style={{
                          marginLeft: 8,
                          animation: "skillPulse 1.4s infinite",
                        }}
                      >
                        SYNCED ✓
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {selectedSkill && (
          <div
            style={{
              marginTop: 20,
              padding: 24,
              border: "1px solid rgba(103,232,249,.25)",
              background: "rgba(8,15,30,.88)",
            }}
          >
            <div
              style={{
                color: "#67e8f9",
                fontFamily: "monospace",
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: ".15em",
              }}
            >
              ABILITY PROFILE
            </div>

            <h2
              style={{
                margin: "10px 0",
                fontSize: "clamp(25px, 4vw, 40px)",
              }}
            >
              {selectedSkill.name}
            </h2>

            <p
              style={{
                maxWidth: 800,
                color: "#cbd5e1",
                lineHeight: 1.65,
              }}
            >
              {selectedSkill.description}
            </p>

            <div
              style={{
                marginTop: 14,
                color: "#64748b",
                fontFamily: "monospace",
                fontSize: 10,
              }}
            >
              CATEGORY: {selectedSkill.category} • STATUS:{" "}
              {selectedSkill.level}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AchievementHQPanel({
  progress,
  onClose,
}: {
  progress: PortfolioProgress;
  onClose: () => void;
}) {
  const unlockedCount =
    achievementDefinitions.filter((achievement) =>
      achievement.unlocked(progress)
    ).length;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 65,
        overflowY: "auto",
        padding: "clamp(24px, 5vw, 72px)",
        background:
          "radial-gradient(circle at 50% 0%, rgba(103,232,249,.08), transparent 36%), rgba(3,7,18,.98)",
        color: "#f8fafc",
      }}
    >
      <style>
        {`
          @keyframes achievementIn {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes unlockGlow {
            0%, 100% { box-shadow: 0 0 0 rgba(103,232,249,0); }
            50% { box-shadow: 0 0 28px rgba(103,232,249,.12); }
          }
        `}
      </style>

      <div
        style={{
          maxWidth: 1050,
          margin: "0 auto",
          animation: "achievementIn 240ms ease-out",
        }}
      >
        <button
          onClick={onClose}
          style={{
            border: "1px solid rgba(148,163,184,.25)",
            background: "rgba(15,23,42,.75)",
            color: "#cbd5e1",
            padding: "9px 13px",
            cursor: "pointer",
            fontFamily: "monospace",
            fontWeight: 800,
          }}
        >
          ← RETURN TO CITY
        </button>

        <div
          style={{
            marginTop: 34,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                color: "#67e8f9",
                fontFamily: "monospace",
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: ".22em",
              }}
            >
              ACHIEVEMENT HQ // UNLOCK MATRIX
            </div>

            <h1
              style={{
                margin: "10px 0 0",
                fontSize: "clamp(38px, 7vw, 76px)",
                lineHeight: .95,
                letterSpacing: "-.05em",
              }}
            >
              TROPHY VAULT
            </h1>
          </div>

          <div
            style={{
              color: "#67e8f9",
              fontFamily: "monospace",
              fontWeight: 900,
            }}
          >
            {unlockedCount}/{achievementDefinitions.length} UNLOCKED
          </div>
        </div>

        <div
          style={{
            marginTop: 30,
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 16,
          }}
        >
          {achievementDefinitions.map((achievement) => {
            const unlocked =
              achievement.unlocked(progress);

            return (
              <div
                key={achievement.id}
                style={{
                  minHeight: 205,
                  padding: 22,
                  border: unlocked
                    ? "1px solid rgba(103,232,249,.42)"
                    : "1px solid rgba(71,85,105,.32)",
                  background: unlocked
                    ? "linear-gradient(145deg, rgba(8,30,42,.9), rgba(8,15,30,.94))"
                    : "rgba(8,15,30,.7)",
                  opacity: unlocked ? 1 : .72,
                  animation: unlocked
                    ? "unlockGlow 2.4s ease-in-out infinite"
                    : "none",
                }}
              >
                <div
                  style={{
                    fontSize: 34,
                    filter: unlocked
                      ? "none"
                      : "grayscale(1)",
                  }}
                >
                  {unlocked ? "🏆" : "🔒"}
                </div>

                <div
                  style={{
                    marginTop: 14,
                    color: unlocked
                      ? "#67e8f9"
                      : "#64748b",
                    fontFamily: "monospace",
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: ".14em",
                  }}
                >
                  {unlocked ? "UNLOCKED" : "LOCKED"}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    fontSize: 21,
                    fontWeight: 900,
                  }}
                >
                  {achievement.title}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    color: "#94a3b8",
                    lineHeight: 1.5,
                    fontSize: 13,
                  }}
                >
                  {achievement.description}
                </div>

                <div
                  style={{
                    marginTop: 14,
                    color: "#64748b",
                    fontFamily: "monospace",
                    fontSize: 10,
                  }}
                >
                  {achievement.requirement}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 24,
            padding: 16,
            border: "1px solid rgba(103,232,249,.14)",
            color: "#64748b",
            fontFamily: "monospace",
            fontSize: 10,
            lineHeight: 1.6,
          }}
        >
          GAME PROGRESSION ONLY — these unlocks represent portfolio
          exploration and do not represent real-world qualifications.
        </div>
      </div>
    </div>
  );
}

function BossMissionPanel({
  onClose,
  onStartMission,
  completedMissionIds,
}: {
  onClose: () => void;
  onStartMission: (mission: BossMission) => void;
  completedMissionIds: string[];
}) {
  const [selected, setSelected] = useState<BossMission | null>(null);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 60,
        overflowY: "auto",
        padding: "clamp(24px, 5vw, 72px)",
        background:
          "linear-gradient(180deg, rgba(3,7,18,.98), rgba(5,9,20,.96))",
        color: "#f8fafc",
      }}
    >
      <style>
        {`
          @keyframes bossIn {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bossScan {
            0% { transform: translateX(-110%); }
            100% { transform: translateX(110%); }
          }
        `}
      </style>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          animation: "bossIn 260ms ease-out",
        }}
      >
        <button
          onClick={onClose}
          style={{
            border: "1px solid rgba(148,163,184,.25)",
            background: "rgba(15,23,42,.75)",
            color: "#cbd5e1",
            padding: "9px 13px",
            cursor: "pointer",
            fontFamily: "monospace",
            fontWeight: 800,
          }}
        >
          ← RETURN TO CITY
        </button>

        <div
          style={{
            marginTop: 34,
            color: "#67e8f9",
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: ".22em",
          }}
        >
          PROJECT LAB // MISSION SELECT
        </div>

        <h1
          style={{
            margin: "10px 0 8px",
            fontSize: "clamp(38px, 7vw, 76px)",
            lineHeight: .95,
            letterSpacing: "-.05em",
          }}
        >
          PROJECT RAIDS
        </h1>

        <p
          style={{
            maxWidth: 700,
            color: "#94a3b8",
            lineHeight: 1.6,
            marginBottom: 30,
          }}
        >
          Select a project to inspect its mission briefing, capabilities,
          technologies, and documented objective.
        </p>

        <div
          style={{
            height: 1,
            overflow: "hidden",
            background: "rgba(103,232,249,.15)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: "32%",
              height: "100%",
              background: "#67e8f9",
              animation: "bossScan 2.8s linear infinite",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {bossMissions.map((mission) => (
            <button
              key={mission.id}
              onClick={() => setSelected(mission)}
              style={{
                textAlign: "left",
                padding: 22,
                minHeight: 220,
                border:
                  mission.classification === "BOSS MISSION"
                    ? "1px solid rgba(248,113,113,.42)"
                    : "1px solid rgba(103,232,249,.24)",
                background:
                  mission.classification === "BOSS MISSION"
                    ? "linear-gradient(145deg, rgba(70,15,24,.72), rgba(15,23,42,.88))"
                    : "linear-gradient(145deg, rgba(8,25,38,.82), rgba(15,23,42,.9))",
                color: "#f8fafc",
                cursor: "pointer",
                transition: "transform .18s ease, border-color .18s ease",
              }}
            >
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: ".18em",
                  color:
                    mission.classification === "BOSS MISSION"
                      ? "#fca5a5"
                      : "#67e8f9",
                }}
              >
                {mission.classification}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    marginTop: 18,
                    color: "#64748b",
                    fontFamily: "monospace",
                    fontSize: 11,
                    letterSpacing: ".12em",
                  }}
                >
                  {mission.codename}
                </div>

                {completedMissionIds.includes(
                  mission.id
                ) && (
                  <div
                    style={{
                      marginTop: 18,
                      color: "#67e8f9",
                      fontFamily: "monospace",
                      fontSize: 10,
                      fontWeight: 900,
                    }}
                  >
                    COMPLETED ✓
                  </div>
                )}
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 22,
                  lineHeight: 1.1,
                  fontWeight: 900,
                }}
              >
                {mission.title}
              </div>

              <div
                style={{
                  marginTop: 14,
                  color: "#94a3b8",
                  lineHeight: 1.5,
                  fontSize: 13,
                }}
              >
                {mission.objective}
              </div>

              <div
                style={{
                  marginTop: 18,
                  color: "#67e8f9",
                  fontFamily: "monospace",
                  fontSize: 12,
                  fontWeight: 900,
                }}
              >
                +{mission.xp} XP →
              </div>
            </button>
          ))}
        </div>

        {selected && (
          <div
            style={{
              marginTop: 22,
              padding: "24px 26px",
              border: "1px solid rgba(103,232,249,.25)",
              background: "rgba(8,15,30,.88)",
            }}
          >
            <div
              style={{
                color: "#67e8f9",
                fontFamily: "monospace",
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: ".16em",
              }}
            >
              MISSION BRIEFING
            </div>

            <h2
              style={{
                margin: "10px 0",
                fontSize: "clamp(25px, 4vw, 40px)",
              }}
            >
              {selected.title}
            </h2>

            <p
              style={{
                color: "#cbd5e1",
                maxWidth: 800,
                lineHeight: 1.65,
              }}
            >
              {selected.objective}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 16,
              }}
            >
              {selected.technologies.map((tech) => (
                <span
                  key={tech}
                  style={{
                    padding: "7px 10px",
                    border: "1px solid rgba(103,232,249,.2)",
                    color: "#a5f3fc",
                    fontFamily: "monospace",
                    fontSize: 11,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            <div
              style={{
                marginTop: 20,
                color: "#67e8f9",
                fontFamily: "monospace",
                fontWeight: 900,
              }}
            >
              REWARD: +{selected.xp} XP
            </div>

            <button
              onClick={() => onStartMission(selected)}
              style={{
                marginTop: 18,
                border: "1px solid rgba(103,232,249,.45)",
                background: "rgba(8,30,42,.9)",
                color: "#ecfeff",
                padding: "12px 16px",
                cursor: "pointer",
                fontFamily: "monospace",
                fontWeight: 900,
                letterSpacing: ".08em",
              }}
            >
              START MISSION →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MissionCinematic({
  mission,
  onFinished,
}: {
  mission: MissionCinematicData | null;
  onFinished: () => void;
}) {
  useEffect(() => {
    if (!mission) return;

    const timer = window.setTimeout(() => {
      onFinished();
    }, 1900);

    return () => window.clearTimeout(timer);
  }, [mission, onFinished]);

  if (!mission) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(90deg, rgba(3,7,18,0.96) 0%, rgba(3,7,18,0.62) 48%, rgba(3,7,18,0.9) 100%)",
        animation: "missionFadeIn 180ms ease-out",
      }}
    >
      <style>
        {`
          @keyframes missionFadeIn {
            from { opacity: 0; transform: scale(1.025); }
            to { opacity: 1; transform: scale(1); }
          }

          @keyframes missionLineIn {
            from { width: 0; opacity: 0; }
            to { width: 100%; opacity: 1; }
          }

          @keyframes missionPulse {
            0%, 100% { opacity: .55; }
            50% { opacity: 1; }
          }
        `}
      </style>

      <div
        style={{
          width: "min(760px, 86vw)",
          transform: "translateY(-3vh)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#67e8f9",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.22em",
            fontFamily: "monospace",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#67e8f9",
              boxShadow: "0 0 18px rgba(103,232,249,.85)",
              animation: "missionPulse 1s infinite",
            }}
          />
          MISSION ACCEPTED
        </div>

        <div
          style={{
            marginTop: 14,
            fontSize: "clamp(34px, 7vw, 72px)",
            lineHeight: 0.95,
            fontWeight: 950,
            letterSpacing: "-0.045em",
            color: "#f8fafc",
            textShadow: "0 0 30px rgba(103,232,249,.12)",
          }}
        >
          {mission.title}
        </div>

        <div
          style={{
            marginTop: 12,
            color: "#94a3b8",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.18em",
            fontFamily: "monospace",
          }}
        >
          {mission.subtitle}
        </div>

        <div
          style={{
            marginTop: 24,
            height: 1,
            background:
              "linear-gradient(90deg, rgba(103,232,249,.9), rgba(103,232,249,.08), transparent)",
            animation: "missionLineIn 450ms ease-out",
          }}
        />

        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div
            style={{
              maxWidth: 560,
              color: "#cbd5e1",
              fontSize: "clamp(15px, 2vw, 20px)",
              lineHeight: 1.45,
            }}
          >
            {mission.objective}
          </div>

          <div
            style={{
              flexShrink: 0,
              padding: "10px 14px",
              border: "1px solid rgba(103,232,249,.32)",
              background: "rgba(8,15,30,.72)",
              color: "#67e8f9",
              fontFamily: "monospace",
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: "0.08em",
            }}
          >
            +{mission.xp} XP
          </div>
        </div>

        <div
          style={{
            marginTop: 28,
            color: "#64748b",
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: "0.12em",
          }}
        >
          ACCESSING DISTRICT...
        </div>
      </div>
    </div>
  );
}

/* ================================================= */
/* DISTRICT IDENTITY                                */
/* ================================================= */

type DistrictTheme = {
  accent: string;
  label: string;
  atmosphere: string;
};

const fallbackDistrictTheme: DistrictTheme = {
  accent: "#67e8f9",
  label: "CITY // DISTRICT",
  atmosphere: "World systems online",
};

const districtThemes: Record<string, DistrictTheme> = {
  "Home Base": {
    accent: "#67e8f9",
    label: "COMMAND // HOME",
    atmosphere: "Safehouse network online",
  },
  "Origin Center": {
    accent: "#a78bfa",
    label: "ARCHIVE // ORIGIN",
    atmosphere: "Identity archive unlocked",
  },
  "Training Center": {
    accent: "#34d399",
    label: "TRAINING // SKILL",
    atmosphere: "Ability systems active",
  },
  "Project Lab": {
    accent: "#f59e0b",
    label: "LAB // PROJECTS",
    atmosphere: "Project systems detected",
  },
  "Mission Board": {
    accent: "#fb7185",
    label: "OPS // MISSIONS",
    atmosphere: "Mission network online",
  },
  "Achievement HQ": {
    accent: "#facc15",
    label: "VAULT // ACHIEVEMENTS",
    atmosphere: "Trophy vault secured",
  },
  "Developer Archive": {
    accent: "#60a5fa",
    label: "ARCHIVE // RESUME",
    atmosphere: "Developer records ready",
  },
  "Communication HQ": {
    accent: "#2dd4bf",
    label: "COMMS // CONTACT",
    atmosphere: "Communication channels ready",
  },
  "Developer Hub": {
    accent: "#c084fc",
    label: "HUB // CODE",
    atmosphere: "Developer network connected",
  },
};

function DistrictIdentity({
  location,
}: {
  location: string | null;
}) {
  if (!location) return null;

  const theme: DistrictTheme =
    districtThemes[location] ??
    fallbackDistrictTheme;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 28,
        transform: "translateX(-50%)",
        zIndex: 43,
        width: "min(92vw, 520px)",
        padding: "12px 16px",
        border: `1px solid ${theme.accent}55`,
        background: "rgba(3,7,18,.84)",
        boxShadow: `0 0 28px ${theme.accent}18`,
        backdropFilter: "blur(8px)",
        textAlign: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          color: theme.accent,
          fontFamily: "monospace",
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: ".18em",
        }}
      >
        {theme.label}
      </div>

      <div
        style={{
          marginTop: 5,
          color: "#f8fafc",
          fontSize: 16,
          fontWeight: 900,
        }}
      >
        {location}
      </div>

      <div
        style={{
          marginTop: 4,
          color: "#94a3b8",
          fontSize: 10,
        }}
      >
        {theme.atmosphere}
      </div>
    </div>
  );
}

/* ================================================= */
/* PROPS                                            */
/* ================================================= */

type ThreeDWorldProps = {
  onEnterLocation?: (
    location: string,
  ) => void;
};

/* ================================================= */
/* LIVING CITY SYSTEM                               */
/* ================================================= */

function MovingTraffic() {
  const cars = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        lane: index % 2 === 0 ? -1.35 : 1.35,
        horizontal: index % 2 !== 0,
        offset: (index * 17) % 60 - 30,
        speed: 2.2 + (index % 3) * 0.45,
        length: 0.8 + (index % 2) * 0.2,
      })),
    [],
  );

  const refs = useRef<Array<THREE.Mesh | null>>([]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.033);

    refs.current.forEach((car, index) => {
      if (!car) return;

      const data = cars[index];
      if (!data) return;

      if (data.horizontal) {
        car.position.x += data.speed * dt;

        if (car.position.x > 70) {
          car.position.x = -70;
        }
      } else {
        car.position.z += data.speed * dt;

        if (car.position.z > 70) {
          car.position.z = -70;
        }
      }
    });
  });

  return (
    <group>
      {cars.map((car, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            refs.current[index] = mesh;
          }}
          position={
            car.horizontal
              ? [car.offset, -0.55, car.lane]
              : [car.lane, -0.55, car.offset]
          }
          rotation={
            car.horizontal
              ? [0, Math.PI / 2, 0]
              : [0, 0, 0]
          }
          scale={[
            car.horizontal
              ? 0.9
              : 0.55,
            0.3,
            car.horizontal
              ? 0.55
              : 0.9,
          ]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.8}
            metalness={0.15}
          />

          <mesh
            position={
              car.horizontal
                ? [0, 0, -0.56]
                : [-0.56, 0, 0]
            }
            scale={[0.45, 0.28, 0.04]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color="#67e8f9"
              emissive="#06b6d4"
              emissiveIntensity={1.4}
            />
          </mesh>
        </mesh>
      ))}
    </group>
  );
}

function SkyDrones() {
  const drones = useMemo(
    () =>
      Array.from({ length: 4 }, (_, index) => ({
        radius: 18 + index * 6,
        height: 7 + index * 1.4,
        speed: 0.18 + index * 0.035,
        phase: index * 1.7,
      })),
    [],
  );

  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    const time = performance.now() / 1000;

    group.children.forEach((drone, index) => {
      const data = drones[index];
      if (!data) return;

      const angle =
        time * data.speed + data.phase;

      drone.position.set(
        Math.cos(angle) * data.radius,
        data.height +
          Math.sin(time * 1.2 + data.phase) *
            0.35,
        Math.sin(angle) * data.radius,
      );

      drone.rotation.y =
        -angle + Math.PI / 2;
    });
  });

  return (
    <group ref={groupRef}>
      {drones.map((_, index) => (
        <mesh key={index}>
          <octahedronGeometry
            args={[0.12, 0]}
          />
          <meshStandardMaterial
            color="#334155"
            emissive="#67e8f9"
            emissiveIntensity={1.2}
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function DistrictPulseMarkers() {
  const refs =
    useRef<Array<THREE.Mesh | null>>([]);

  useFrame(() => {
    const pulse =
      1 +
      Math.sin(
        performance.now() / 420,
      ) *
        0.08;

    refs.current.forEach((mesh) => {
      if (!mesh) return;
      mesh.scale.set(
        pulse,
        pulse,
        pulse,
      );
    });
  });

  return (
    <group>
      {cityLocations.map(
        (location, index) => (
          <mesh
            key={location.id}
            ref={(mesh) => {
              refs.current[index] =
                mesh;
            }}
            position={[
              location.position[0],
              0.04,
              location.position[2],
            ]}
            rotation={[
              -Math.PI / 2,
              0,
              0,
            ]}
          >
            <ringGeometry
              args={[
                2.15,
                2.2,
                32,
              ]}
            />
            <meshBasicMaterial
              color="#67e8f9"
              transparent
              opacity={0.22}
              depthWrite={false}
            />
          </mesh>
        ),
      )}
    </group>
  );
}

/* ================================================= */
/* MAIN WORLD                                       */
/* ================================================= */

export default function ThreeDWorld({
  onEnterLocation,
}: ThreeDWorldProps) {
  const playerRef =
    useRef<
      THREE.Group
    >(null);

  const [
    nearLocation,
    setNearLocation,
  ] = useState<
    string | null
  >(null);

  const [
    targetLocation,
    setTargetLocation,
  ] = useState<
    string | null
  >(null);

  const [
    activeMission,
    setActiveMission,
  ] = useState<
    MissionCinematicData | null
  >(null);

  const [
    showProjectLab,
    setShowProjectLab,
  ] = useState(false);

  const [
    activeProjectMission,
    setActiveProjectMission,
  ] = useState<BossMission | null>(null);

  const [
    showAchievementHQ,
    setShowAchievementHQ,
  ] = useState(false);

  const [
    showTrainingCenter,
    setShowTrainingCenter,
  ] = useState(false);

  const [
    showCharacterUpgrades,
    setShowCharacterUpgrades,
  ] = useState(false);

  const [
    currentDistrict,
    setCurrentDistrict,
  ] = useState<string | null>(null);

  const [
    progress,
    setProgress,
  ] = useState<PortfolioProgress>(
    getStoredProgress
  );

  useEffect(() => {
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify(progress)
    );
  }, [progress]);

  const pendingLocationRef =
    useRef<string | null>(null);

  const handleEnterLocation = (
    location: string,
  ) => {
    setCurrentDistrict(location);

    const mission =
      cinematicMissions[location];

    if (!mission) {
      onEnterLocation?.(location);
      return;
    }

    pendingLocationRef.current =
      location;

    setActiveMission(mission);
  };

  const startProjectMission = (
    mission: BossMission
  ) => {
    setShowProjectLab(false);
    setActiveProjectMission(mission);
  };

  const completeProjectMission = (
    xp: number
  ) => {
    const mission = activeProjectMission;

    if (!mission) {
      setActiveProjectMission(null);
      setShowProjectLab(true);
      return;
    }

    setProgress((current) => {
      if (
        current.completedMissionIds.includes(
          mission.id
        )
      ) {
        return current;
      }

      return {
        xp: current.xp + xp,
        completedMissionIds: [
          ...current.completedMissionIds,
          mission.id,
        ],
      };
    });

    setActiveProjectMission(null);
    setShowProjectLab(true);
  };

  useEffect(() => {
    const handleUpgradeShortcut = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === "u" &&
        !activeProjectMission &&
        !showProjectLab &&
        !showAchievementHQ &&
        !showTrainingCenter
      ) {
        setShowCharacterUpgrades(true);
      }
    };

    window.addEventListener(
      "keydown",
      handleUpgradeShortcut
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleUpgradeShortcut
      );
  }, [
    activeProjectMission,
    showProjectLab,
    showAchievementHQ,
    showTrainingCenter,
  ]);

  const finishMissionCinematic = () => {
    const location =
      pendingLocationRef.current;

    pendingLocationRef.current =
      null;

    setActiveMission(null);

    if (location === "Project Lab") {
      setShowProjectLab(true);
      return;
    }

    if (location === "Achievement HQ") {
      setShowAchievementHQ(true);
      return;
    }

    if (location === "Training Center") {
      setShowTrainingCenter(true);
      return;
    }

    if (location) {
      onEnterLocation?.(location);
    }
  };

  return (
    <div
      style={{
        position:
          "relative",

        width:
          "100vw",

        height:
          "100vh",

        background:
          "#05070d",

        overflow:
          "hidden",
      }}
    >
      {activeProjectMission && (
        <PlayableProjectMission
          mission={activeProjectMission}
          onBack={() =>
            setActiveProjectMission(null)
          }
          onComplete={
            completeProjectMission
          }
        />
      )}

      <ProgressOverlay progress={progress} />

      <DistrictIdentity
        location={currentDistrict}
      />

      {!showCharacterUpgrades &&
        !showTrainingCenter &&
        !showAchievementHQ &&
        !showProjectLab &&
        !activeProjectMission && (
          <button
            onClick={() =>
              setShowCharacterUpgrades(true)
            }
            style={{
              position: "absolute",
              top: 92,
              left: 18,
              zIndex: 45,
              border: "1px solid rgba(103,232,249,.2)",
              background: "rgba(3,7,18,.76)",
              color: "#a5f3fc",
              padding: "8px 11px",
              cursor: "pointer",
              fontFamily: "monospace",
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: ".08em",
            }}
          >
            U // SUIT
          </button>
        )}

      {showCharacterUpgrades && (
        <CharacterUpgradePanel
          progress={progress}
          onClose={() =>
            setShowCharacterUpgrades(false)
          }
        />
      )}

      {showTrainingCenter && (
        <SkillTreePanel
          progress={progress}
          onClose={() =>
            setShowTrainingCenter(false)
          }
        />
      )}

      {showAchievementHQ && (
        <AchievementHQPanel
          progress={progress}
          onClose={() =>
            setShowAchievementHQ(false)
          }
        />
      )}

      {showProjectLab && (
        <BossMissionPanel
          onClose={() =>
            setShowProjectLab(false)
          }
          onStartMission={
            startProjectMission
          }
          completedMissionIds={
            progress.completedMissionIds
          }
        />
      )}

      <MissionCinematic
        mission={activeMission}
        onFinished={
          finishMissionCinematic
        }
      />

      <Canvas
        camera={{
          position: [
            10,
            10,
            20,
          ],

          fov: 50,

          near: 0.1,

          far: 180,
        }}
        gl={{
          antialias:
            false,

          powerPreference:
            "high-performance",

          alpha: false,

          depth: true,

          stencil: false,
        }}
      >
        {/* ================================== */}
        {/* ATMOSPHERE                         */}
        {/* ================================== */}

        <color
          attach="background"
          args={[
            "#05070d",
          ]}
        />

        <fog
          attach="fog"
          args={[
            "#05070d",
            20,
            96,
          ]}
        />

        {/* ================================== */}
        {/* LIGHTING                           */}
        {/* ================================== */}

        <ambientLight
          intensity={0.65}
        />

        <directionalLight
          position={[
            15,
            25,
            10,
          ]}
          intensity={1.25}
        />

        <pointLight
          position={[
            0,
            8,
            0,
          ]}
          intensity={2}
          distance={35}
          color="#164e63"
        />

        {/* ================================== */}
        {/* GROUND                             */}
        {/* ================================== */}

        <Ground />

        <GroundGrid />

        {/* ================================== */}
        {/* ROADS                              */}
        {/* ================================== */}

        <Road
          position={[
            0,
            0,
            0,
          ]}
          size={[
            5,
            140,
          ]}
        />

        <Road
          position={[
            0,
            0,
            0,
          ]}
          size={[
            140,
            5,
          ]}
          horizontal
        />

        {/* ================================== */}
        {/* LIVING CITY                        */}
        {/* ================================== */}

        <MovingTraffic />

        <SkyDrones />

        <DistrictPulseMarkers />

        {/* ================================== */}
        {/* DISTANT SKYLINE                    */}
        {/* ================================== */}

        <Skyline />

        {/* ================================== */}
        {/* LIVING CITY ATMOSPHERE             */}
        {/* ================================== */}

        <CityAtmosphere />

        {/* ================================== */}
        {/* DISTRICT GLOW ZONES                */}
        {/* ================================== */}

        {cityLocations.map(
          (location) => (
            <DistrictGlow
              key={`glow-${location.id}`}
              position={
                location.position
              }
            />
          ),
        )}

        {/* ================================== */}
        {/* MAIN CITY BUILDINGS                */}
        {/* ================================== */}

        {cityLocations.map(
          (
            location,
            index,
          ) => (
            <Building
              key={
                location.id
              }
              position={
                location.position
              }
              height={
                location.height
              }
              index={
                index
              }
            />
          ),
        )}

        {/* ================================== */}
        {/* UNIQUE LOCATION LANDMARKS           */}
        {/* ================================== */}

        {cityLocations.map(
          (location) => (
            <LocationLandmark
              key={`landmark-${location.id}`}
              location={
                location
              }
            />
          ),
        )}

        {/* ================================== */}
        {/* STREET LIGHTS                      */}
        {/* ================================== */}

        <CityLights />

        {/* ================================== */}
        {/* LOCATION LABELS                    */}
        {/* ================================== */}

        {cityLocations.map(
          (
            location,
          ) => (
            <LocationLabel
              key={`label-${location.id}`}
              name={
                location.name
              }
              position={
                location.position
              }
            />
          ),
        )}

        {/* ================================== */}
        {/* PLAYER                             */}
        {/* ================================== */}

        <Hero3D
          playerRef={
            playerRef
          }
          level={getLevelFromXp(progress.xp)}
        />

        {/* ================================== */}
        {/* CAMERA                             */}
        {/* ================================== */}

        <CameraFollow
          target={
            playerRef
          }
        />

        {/* ================================== */}
        {/* INTERACTION SYSTEM                 */}
        {/* ================================== */}

        <InteractionDetector
          playerRef={
            playerRef
          }
          onLocationChange={(location) => {
            setNearLocation(location);
            if (location) {
              setCurrentDistrict(location);
            }
          }}
          onTargetChange={
            setTargetLocation
          }
          onEnter={
            handleEnterLocation
          }
        />
      </Canvas>

      {/* ====================================== */}
      {/* WEB TARGET                            */}
      {/* ====================================== */}

      {targetLocation && (
        <div
          style={{
            position:
              "absolute",

            left: "50%",

            bottom:
              nearLocation
                ? "170px"
                : "60px",

            transform:
              "translateX(-50%)",

            padding:
              "12px 22px",

            borderRadius:
              "10px",

            background:
              "rgba(5, 7, 13, 0.9)",

            border:
              "1px solid rgba(103, 232, 249, 0.55)",

            color:
              "white",

            textAlign:
              "center",

            fontFamily:
              "Arial, sans-serif",

            pointerEvents:
              "none",

            boxShadow:
              "0 0 20px rgba(103, 232, 249, 0.18)",

            zIndex: 20,
          }}
        >
          <div
            style={{
              fontSize:
                "10px",

              color:
                "#67e8f9",

              letterSpacing:
                "2px",

              marginBottom:
                "5px",
            }}
          >
            WEB TRAVEL AVAILABLE
          </div>

          <div
            style={{
              fontSize:
                "17px",

              fontWeight:
                "bold",

              marginBottom:
                "5px",
            }}
          >
            →{" "}
            {
              targetLocation
            }
          </div>

          <div
            style={{
              fontSize:
                "12px",

              color:
                "#9ca3af",
            }}
          >
            Press{" "}
            <strong
              style={{
                color:
                  "#67e8f9",
              }}
            >
              F
            </strong>{" "}
            to swing
          </div>
        </div>
      )}

      {/* ====================================== */}
      {/* LOCATION ENTER                        */}
      {/* ====================================== */}

      {nearLocation && (
        <div
          style={{
            position:
              "absolute",

            left: "50%",

            bottom:
              "60px",

            transform:
              "translateX(-50%)",

            padding:
              "16px 28px",

            borderRadius:
              "12px",

            background:
              "rgba(5, 7, 13, 0.92)",

            border:
              "1px solid #67e8f9",

            color:
              "white",

            textAlign:
              "center",

            fontFamily:
              "Arial, sans-serif",

            pointerEvents:
              "none",

            boxShadow:
              "0 0 25px rgba(103, 232, 249, 0.25)",

            zIndex: 20,
          }}
        >
          <div
            style={{
              fontSize:
                "12px",

              color:
                "#67e8f9",

              letterSpacing:
                "2px",

              marginBottom:
                "6px",
            }}
          >
            LOCATION DISCOVERED
          </div>

          <div
            style={{
              fontSize:
                "22px",

              fontWeight:
                "bold",

              marginBottom:
                "8px",
            }}
          >
            {
              nearLocation
            }
          </div>

          <div
            style={{
              fontSize:
                "14px",

              color:
                "#d1d5db",
            }}
          >
            Press{" "}
            <strong
              style={{
                color:
                  "#67e8f9",
              }}
            >
              E
            </strong>{" "}
            to enter
          </div>
        </div>
      )}

      {/* ====================================== */}
      {/* GAME HUD                              */}
      {/* ====================================== */}

      <GameHUD />
    </div>
  );
}