import {
  useFrame,
} from "@react-three/fiber";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import * as THREE from "three";

import { cityLocations } from "@/data/city";

type Hero3DProps = {
  playerRef: React.RefObject<
    THREE.Group | null
  >;
  level?: number;
};

const WEB_POINTS = 16;
const IMPACT_PARTICLES = 12;

function CityWorldDetails() {
  const details = useMemo(() => {
    const items: Array<{
      position: [number, number, number];
      scale: [number, number, number];
      rotation: [number, number, number];
    }> = [];

    // Deterministic rooftop antenna/detail placements.
    for (let i = 0; i < 18; i += 1) {
      const x = ((i * 17) % 72) - 36;
      const z = ((i * 29) % 72) - 36;

      if (Math.abs(x) < 5 && Math.abs(z) < 5) continue;

      const height = 1.5 + (i % 4) * 0.55;

      items.push({
        position: [x, height / 2, z],
        scale: [
          0.12 + (i % 3) * 0.05,
          height,
          0.12 + (i % 2) * 0.04,
        ],
        rotation: [0, (i % 6) * 0.35, 0],
      });
    }

    return items;
  }, []);

  return (
    <group>
      {details.map((detail, index) => (
        <mesh
          key={index}
          position={detail.position}
          rotation={detail.rotation}
          scale={detail.scale}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={index % 3 === 0 ? "#172033" : "#0f172a"}
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>
      ))}

      {/* Rooftop beacon markers */}
      {details.slice(0, 8).map((detail, index) => (
        <mesh
          key={`beacon-${index}`}
          position={[
            detail.position[0],
            detail.position[1] +
              detail.scale[1] / 2 +
              0.08,
            detail.position[2],
          ]}
        >
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshStandardMaterial
            color="#67e8f9"
            emissive="#06b6d4"
            emissiveIntensity={1.8}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Hero3D({
  playerRef,
  level = 1,
}: Hero3DProps) {
  const suitLevel = Math.max(1, Math.floor(level));
  const enhancedCore = suitLevel >= 2;
  const motionSync = suitLevel >= 3;
  const tacticalFrame = suitLevel >= 4;
  const apexLoadout = suitLevel >= 5;
  /* ========================================== */
  /* BODY REFERENCES                            */
  /* ========================================== */

  const leftArmRef =
    useRef<THREE.Mesh>(null);

  const rightArmRef =
    useRef<THREE.Mesh>(null);

  const leftLegRef =
    useRef<THREE.Mesh>(null);

  const rightLegRef =
    useRef<THREE.Mesh>(null);

  /* ========================================== */
  /* KEYBOARD                                   */
  /* ========================================== */

  const keys =
    useRef<Record<string, boolean>>({});

  /* ========================================== */
  /* JUMP                                       */
  /* ========================================== */

  const isJumping =
    useRef(false);

  const jumpVelocity =
    useRef(0);

  /* ========================================== */
  /* WEB SWING                                  */
  /* ========================================== */

  const isSwinging =
    useRef(false);

  const swingTarget =
    useRef<THREE.Vector3 | null>(null);

  const swingStart =
    useRef<THREE.Vector3 | null>(null);

  const swingAnchor =
    useRef<THREE.Vector3 | null>(null);

  const swingTime =
    useRef(0);

  const lastSwingTime =
    useRef(-10);

  /* ========================================== */
  /* LANDING EFFECT                             */
  /* ========================================== */

  const impactTime =
    useRef(-1);

  const impactOrigin =
    useRef(
      new THREE.Vector3(),
    );

  /* ========================================== */
  /* WEB GEOMETRY                               */
  /* ========================================== */

  const webData = useMemo(() => {
    const geometry =
      new THREE.BufferGeometry();

    const positions =
      new Float32Array(
        WEB_POINTS * 3,
      );

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions,
        3,
      ),
    );

    const material =
      new THREE.LineBasicMaterial({
        color: "#e5faff",
        transparent: true,
        opacity: 0,
      });

    const line =
      new THREE.Line(
        geometry,
        material,
      );

    return {
      geometry,
      material,
      line,
      positions,
    };
  }, []);

  const webLine =
    webData.line;

  const swingTrailData = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(WEB_POINTS * 3);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const positionAttribute =
      geometry.getAttribute("position") as THREE.BufferAttribute;
    const material = new THREE.LineBasicMaterial({
      color: "#67e8f9",
      transparent: true,
      opacity: 0,
    });
    const line = new THREE.Line(geometry, material);
    return {
      geometry,
      positions,
      positionAttribute,
      material,
      line,
    };
  }, []);

  const swingTrailLine = swingTrailData.line;

  /* ========================================== */
  /* LANDING SHOCKWAVE                         */
  /* ========================================== */

  const impactRing = useMemo(() => {
    const geometry =
      new THREE.RingGeometry(
        0.25,
        0.38,
        32,
      );

    const material =
      new THREE.MeshBasicMaterial({
        color: "#67e8f9",
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

    const ring =
      new THREE.Mesh(
        geometry,
        material,
      );

    ring.rotation.x =
      -Math.PI / 2;

    ring.visible = false;

    return ring;
  }, []);

  /* ========================================== */
  /* LANDING PARTICLES                         */
  /* ========================================== */

  const impactParticles =
    useMemo(() => {
      const group =
        new THREE.Group();

      const particleGeometry =
        new THREE.SphereGeometry(
          0.07,
          6,
          6,
        );

      for (
        let i = 0;
        i < IMPACT_PARTICLES;
        i += 1
      ) {
        const material =
          new THREE.MeshBasicMaterial({
            color:
              i % 2 === 0
                ? "#67e8f9"
                : "#ef1d2d",
            transparent: true,
            opacity: 0,
            depthWrite: false,
          });

        const particle =
          new THREE.Mesh(
            particleGeometry,
            material,
          );

        particle.visible =
          false;

        particle.userData = {
          angle:
            (i /
              IMPACT_PARTICLES) *
            Math.PI *
            2,

          speed:
            1.5 +
            (i % 4) * 0.45,

          lift:
            1.1 +
            (i % 3) * 0.35,
        };

        group.add(
          particle,
        );
      }

      return {
        group,
        geometry:
          particleGeometry,
      };
    }, []);

  /* ========================================== */
  /* LANDING LIGHT                             */
  /* ========================================== */

  const impactLight = useMemo(
    () =>
      new THREE.PointLight(
        "#67e8f9",
        0,
        8,
      ),
    [],
  );

  /* ========================================== */
  /* CLEANUP                                   */
  /* ========================================== */

  useEffect(() => {
    return () => {
      webData.geometry.dispose();
      webData.material.dispose();
      swingTrailData.geometry.dispose();
      swingTrailData.material.dispose();

      impactRing.geometry.dispose();

      if (
        impactRing.material instanceof
        THREE.Material
      ) {
        impactRing.material.dispose();
      }

      impactParticles.geometry.dispose();

      impactParticles.group.children.forEach(
        (child) => {
          if (
            child instanceof
            THREE.Mesh
          ) {
            if (
              child.material instanceof
              THREE.Material
            ) {
              child.material.dispose();
            }
          }
        },
      );
    };
  }, [
    webData,
    impactRing,
    impactParticles,
  ]);

  /* ========================================== */
  /* START WEB SWING                           */
  /* ========================================== */

  const startWebSwing = () => {
    const hero =
      playerRef.current;

    if (!hero) return;

    if (isSwinging.current) {
      return;
    }

    const now =
      performance.now() / 1000;

    /* Short cooldown */
    if (
      now -
        lastSwingTime.current <
      0.35
    ) {
      return;
    }

    let nearestLocation:
      (typeof cityLocations)[number] |
      null = null;

    let nearestDistance =
      Infinity;

    /* ====================================== */
    /* FIND NEAREST VALID LOCATION             */
    /* ====================================== */

    for (
      const location of cityLocations
    ) {
      const dx =
        hero.position.x -
        location.position[0];

      const dz =
        hero.position.z -
        location.position[2];

      const distance =
        Math.sqrt(
          dx * dx +
            dz * dz,
        );

      /*
       * Ignore the location we're
       * already standing at.
       */

      if (
        distance > 8 &&
        distance <= 35 &&
        distance <
          nearestDistance
      ) {
        nearestDistance =
          distance;

        nearestLocation =
          location;
      }
    }

    if (!nearestLocation) {
      return;
    }

    /* ====================================== */
    /* TARGET POSITION                         */
    /* ====================================== */

    swingTarget.current =
      new THREE.Vector3(
        nearestLocation.position[0],
        1,
        nearestLocation.position[2],
      );

    /* ====================================== */
    /* HIGH WEB ANCHOR                         */
    /* ====================================== */

    swingAnchor.current =
      new THREE.Vector3(
        nearestLocation.position[0],
        nearestLocation.height +
          3.5,
        nearestLocation.position[2],
      );

    /* ====================================== */
    /* START POSITION                          */
    /* ====================================== */

    swingStart.current =
      hero.position.clone();

    swingTime.current = 0;

    isSwinging.current = true;

    isJumping.current = false;

    jumpVelocity.current = 0;

    lastSwingTime.current =
      now;

    /* Hide old impact effect */

    impactTime.current = -1;

    impactRing.visible =
      false;

    impactLight.intensity = 0;

    impactParticles.group.children.forEach(
      (child) => {
        child.visible = false;

        if (
          child instanceof
          THREE.Mesh
        ) {
          const material =
            child.material as THREE.MeshBasicMaterial;

          material.opacity = 0;
        }
      },
    );
  };

  /* ========================================== */
  /* KEYBOARD LISTENERS                        */
  /* ========================================== */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      const key =
        event.key.toLowerCase();

      keys.current[key] = true;

      /* ==================================== */
      /* SPACE = JUMP                         */
      /* ==================================== */

      if (
        event.code === "Space" &&
        !event.repeat &&
        !isJumping.current &&
        !isSwinging.current
      ) {
        isJumping.current =
          true;

        jumpVelocity.current =
          0.22;
      }

      /* ==================================== */
      /* F = WEB SWING                        */
      /* ==================================== */

      if (
        key === "f" &&
        !event.repeat
      ) {
        startWebSwing();
      }
    };

    const handleKeyUp = (
      event: KeyboardEvent,
    ) => {
      const key =
        event.key.toLowerCase();

      keys.current[key] =
        false;
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    window.addEventListener(
      "keyup",
      handleKeyUp,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      window.removeEventListener(
        "keyup",
        handleKeyUp,
      );
    };
  }, []);

  /* ========================================== */
  /* UPDATE WEB CURVE                          */
  /* ========================================== */

  const updateWeb = (
    hero: THREE.Group,
    anchor: THREE.Vector3,
    elapsed: number,
  ) => {
    const start =
      new THREE.Vector3(
        hero.position.x,
        hero.position.y + 1.35,
        hero.position.z,
      );

    const positions =
      webData.positions;

    for (
      let i = 0;
      i < WEB_POINTS;
      i += 1
    ) {
      const t =
        i /
        (WEB_POINTS - 1);

      const point =
        new THREE.Vector3()
          .lerpVectors(
            start,
            anchor,
            t,
          );

      /*
       * Curved cable.
       * Maximum curve is around
       * the middle of the web.
       */

      const curve =
        Math.sin(
          t * Math.PI,
        ) * 0.45;

      point.x +=
        Math.sin(
          t * Math.PI * 2,
        ) *
        curve *
        0.25;

      point.y += curve;

      point.z +=
        Math.sin(
          t * Math.PI * 3 +
            elapsed * 10,
        ) *
        0.025 *
        Math.sin(t * Math.PI);

      positions[i * 3] =
        point.x;

      positions[i * 3 + 1] =
        point.y;

      positions[i * 3 + 2] =
        point.z;
    }

    const positionAttribute =
      webData.geometry.getAttribute(
        "position",
      );

    if (positionAttribute) {
      positionAttribute.needsUpdate =
        true;
    }

    webData.geometry.computeBoundingSphere();
  };

  /* ========================================== */
  /* START LANDING EFFECT                      */
  /* ========================================== */

  const startImpactEffect = (
    position: THREE.Vector3,
  ) => {
    impactTime.current = 0;

    impactOrigin.current.copy(
      position,
    );

    /* Shockwave */

    impactRing.visible = true;

    impactRing.position.copy(
      position,
    );

    impactRing.position.y =
      0.05;

    impactRing.scale.setScalar(
      0.35,
    );

    const ringMaterial =
      impactRing.material as THREE.MeshBasicMaterial;

    ringMaterial.opacity = 0.9;

    /* Light */

    impactLight.position.copy(
      position,
    );

    impactLight.position.y =
      0.8;

    impactLight.intensity = 5;

    /* Particles */

    impactParticles.group.position.copy(
      position,
    );

    impactParticles.group.position.y =
      0.1;

    impactParticles.group.children.forEach(
      (child) => {
        const mesh =
          child as THREE.Mesh;

        const data =
          mesh.userData;

        mesh.position.set(
          0,
          0,
          0,
        );

        mesh.scale.setScalar(
          1,
        );

        mesh.visible = true;

        const material =
          mesh.material as THREE.MeshBasicMaterial;

        material.opacity = 1;

        data["elapsed"] = 0;
      },
    );
  };

  /* ========================================== */
  /* UPDATE LANDING EFFECT                     */
  /* ========================================== */

  const updateImpactEffect = (
    frameDelta: number,
  ) => {
    if (
      impactTime.current < 0
    ) {
      return;
    }

    impactTime.current +=
      frameDelta;

    const time =
      impactTime.current;

    const duration = 0.75;

    const progress =
      Math.min(
        time / duration,
        1,
      );

    /* ====================================== */
    /* SHOCKWAVE                               */
    /* ====================================== */

    if (
      impactRing.visible
    ) {
      const ringProgress =
        Math.min(
          progress * 1.15,
          1,
        );

      const scale =
        0.35 +
        ringProgress * 3.2;

      impactRing.scale.setScalar(
        scale,
      );

      const ringMaterial =
        impactRing.material as THREE.MeshBasicMaterial;

      ringMaterial.opacity =
        Math.max(
          0,
          0.9 *
            (1 - progress),
        );
    }

    /* ====================================== */
    /* PARTICLES                               */
    /* ====================================== */

    impactParticles.group.children.forEach(
      (child) => {
        const mesh =
          child as THREE.Mesh;

        const data =
          mesh.userData;

        const angle =
  data["angle"];

const speed =
  data["speed"];

const lift =
  data["lift"];

        mesh.position.x =
          Math.cos(angle) *
          speed *
          progress;

        mesh.position.z =
          Math.sin(angle) *
          speed *
          progress;

        mesh.position.y =
          lift *
          Math.sin(
            progress *
              Math.PI,
          );

        mesh.scale.setScalar(
          1 -
            progress *
              0.75,
        );

        const material =
          mesh.material as THREE.MeshBasicMaterial;

        material.opacity =
          Math.max(
            0,
            1 - progress,
          );
      },
    );

    /* ====================================== */
    /* GLOW                                    */
    /* ====================================== */

    impactLight.intensity =
      5 *
      Math.max(
        0,
        1 - progress * 1.4,
      );

    if (
      progress >= 1
    ) {
      impactRing.visible =
        false;

      impactLight.intensity =
        0;

      impactParticles.group.children.forEach(
        (child) => {
          child.visible = false;
        },
      );

      impactTime.current = -1;
    }
  };

  /* ========================================== */
  /* MAIN FRAME LOOP                            */
  /* ========================================== */

  useFrame((_, delta) => {
    const hero =
      playerRef.current;

    if (!hero) return;

    /*
     * IMPORTANT:
     *
     * R3F already provides the
     * correct frame delta.
     *
     * Never call clock.getDelta()
     * inside this frame loop.
     */

    const frameDelta =
      Math.min(
        delta,
        0.033,
      );

    const elapsed =
      performance.now() /
      1000;

    /* ======================================== */
    /* LANDING EFFECT                           */
    /* ======================================== */

    updateImpactEffect(
      frameDelta,
    );

    /* ======================================== */
    /* WEB SWING                                */
    /* ======================================== */

    if (
      isSwinging.current &&
      swingStart.current &&
      swingTarget.current &&
      swingAnchor.current
    ) {
      /*
       * Fast cinematic swing.
       *
       * Total duration:
       * 0.9 seconds
       */

      const duration =
        Math.max(
          0.68,
          0.9 - Math.min(suitLevel - 1, 4) * 0.055,
        );

      swingTime.current +=
        frameDelta;

      const rawProgress =
        Math.min(
          swingTime.current /
            duration,
          1,
        );

      /* ====================================== */
      /* SMOOTH EASING                          */
      /* ====================================== */

      const eased =
        rawProgress *
        rawProgress *
        (3 -
          2 *
            rawProgress);

      const start =
        swingStart.current;

      const target =
        swingTarget.current;

      const anchor =
        swingAnchor.current;

      /* ====================================== */
      /* HORIZONTAL MOVEMENT                    */
      /* ====================================== */

      const x =
        THREE.MathUtils.lerp(
          start.x,
          target.x,
          eased,
        );

      const z =
        THREE.MathUtils.lerp(
          start.z,
          target.z,
          eased,
        );

      /* ====================================== */
      /* CINEMATIC ARC                          */
      /* ====================================== */

      const arc =
        Math.sin(
          rawProgress *
            Math.PI,
        ) *
        (4.5 +
          Math.min(suitLevel - 1, 4) * 0.35);

      const baseY =
        THREE.MathUtils.lerp(
          start.y,
          target.y,
          eased,
        );

      hero.position.set(
        x,
        baseY + arc,
        z,
      );

      for (let i = 0; i < WEB_POINTS; i += 1) {
        const trailT = Math.max(
          0,
          rawProgress -
            (i / (WEB_POINTS - 1)) * 0.22,
        );
        const trailEased =
          trailT * trailT * (3 - 2 * trailT);
        const index = i * 3;

        swingTrailData.positions[index] =
          THREE.MathUtils.lerp(start.x, target.x, trailEased);
        swingTrailData.positions[index + 1] =
          THREE.MathUtils.lerp(start.y, target.y, trailEased) +
          Math.sin(trailT * Math.PI) *
            (4.5 + Math.min(suitLevel - 1, 4) * 0.35) -
          0.12;
        swingTrailData.positions[index + 2] =
          THREE.MathUtils.lerp(start.z, target.z, trailEased);
      }

      swingTrailData.positionAttribute.needsUpdate = true;
      swingTrailData.material.opacity =
        0.12 + Math.min(suitLevel, 5) * 0.04;

      /* ====================================== */
      /* ROTATE TOWARD TARGET                   */
      /* ====================================== */

      const direction =
        new THREE.Vector3(
          target.x -
            hero.position.x,
          0,
          target.z -
            hero.position.z,
        );

      if (
        direction.lengthSq() >
        0.001
      ) {
        direction.normalize();

        const targetRotation =
          Math.atan2(
            direction.x,
            direction.z,
          );

        hero.rotation.y =
          THREE.MathUtils.lerp(
            hero.rotation.y,
            targetRotation,
            0.2,
          );
      }

      /* ====================================== */
      /* CINEMATIC BODY POSE                    */
      /* ====================================== */

      /*
       * Arms open during swing.
       */

      if (
        leftArmRef.current
      ) {
        leftArmRef.current.rotation.z =
          -1.0;

        leftArmRef.current.rotation.x =
          Math.sin(
            rawProgress *
              Math.PI,
          ) * 0.15;
      }

      if (
        rightArmRef.current
      ) {
        rightArmRef.current.rotation.z =
          1.0;

        rightArmRef.current.rotation.x =
          -Math.sin(
            rawProgress *
              Math.PI,
          ) * 0.15;
      }

      /*
       * Legs bend differently
       * for a dynamic airborne pose.
       */

      if (
        leftLegRef.current
      ) {
        leftLegRef.current.rotation.x =
          0.65;

        leftLegRef.current.rotation.z =
          -0.15;
      }

      if (
        rightLegRef.current
      ) {
        rightLegRef.current.rotation.x =
          -0.45;

        rightLegRef.current.rotation.z =
          0.15;
      }

      /* ====================================== */
      /* UPDATE CURVED WEB                      */
      /* ====================================== */

      updateWeb(
        hero,
        anchor,
        elapsed,
      );

      /* ====================================== */
      /* WEB VISUAL                             */
      /* ====================================== */

      webData.material.opacity =
        0.78 +
        Math.sin(
          elapsed * 20,
        ) *
          0.18;

      webData.material.transparent =
        true;

      /* ====================================== */
      /* LANDING                                */
      /* ====================================== */

      if (
        rawProgress >= 1
      ) {
        hero.position.set(
          target.x,
          1,
          target.z,
        );

        /*
         * Trigger impact before
         * clearing swing state.
         */

        startImpactEffect(
          hero.position,
        );

        isSwinging.current =
          false;

        swingTarget.current =
          null;

        swingStart.current =
          null;

        swingAnchor.current =
          null;

        swingTime.current =
          0;

        webData.material.opacity =
          0;

        swingTrailData.material.opacity =
          0;

        /* Reset arms */

        if (
          leftArmRef.current
        ) {
          leftArmRef.current.rotation.z =
            0;

          leftArmRef.current.rotation.x =
            0;
        }

        if (
          rightArmRef.current
        ) {
          rightArmRef.current.rotation.z =
            0;

          rightArmRef.current.rotation.x =
            0;
        }

        /* Reset legs */

        if (
          leftLegRef.current
        ) {
          leftLegRef.current.rotation.x =
            0;

          leftLegRef.current.rotation.z =
            0;
        }

        if (
          rightLegRef.current
        ) {
          rightLegRef.current.rotation.x =
            0;

          rightLegRef.current.rotation.z =
            0;
        }
      }

      return;
    }

    /* ======================================== */
    /* NORMAL MOVEMENT                           */
    /* ======================================== */

    const movement =
      new THREE.Vector3();

    if (
      keys.current["w"] ||
      keys.current["arrowup"]
    ) {
      movement.z -= 1;
    }

    if (
      keys.current["s"] ||
      keys.current["arrowdown"]
    ) {
      movement.z += 1;
    }

    if (
      keys.current["a"] ||
      keys.current["arrowleft"]
    ) {
      movement.x -= 1;
    }

    if (
      keys.current["d"] ||
      keys.current["arrowright"]
    ) {
      movement.x += 1;
    }

    const hasMovement =
      movement.lengthSq() >
      0;

    /* ======================================== */
    /* SPRINT                                   */
    /* ======================================== */

    const isSprinting =
      keys.current["shift"];

    const speed =
      isSprinting
        ? 0.24
        : 0.12;

    /* ======================================== */
    /* MOVE                                     */
    /* ======================================== */

    if (hasMovement) {
      movement.normalize();

      hero.position.addScaledVector(
        movement,
        speed,
      );

      /* ==================================== */
      /* FACE MOVEMENT DIRECTION               */
      /* ==================================== */

      const targetRotation =
        Math.atan2(
          movement.x,
          movement.z,
        );

      hero.rotation.y =
        THREE.MathUtils.lerp(
          hero.rotation.y,
          targetRotation,
          0.18,
        );
    }

    /* ======================================== */
    /* JUMP                                    */
    /* ======================================== */

    if (
      isJumping.current
    ) {
      hero.position.y +=
        jumpVelocity.current;

      jumpVelocity.current -=
        0.012;

      if (
        hero.position.y <= 1
      ) {
        hero.position.y = 1;

        isJumping.current =
          false;

        jumpVelocity.current =
          0;
      }
    }

    /* ======================================== */
    /* WALKING ANIMATION                        */
    /* ======================================== */

    if (
      hasMovement &&
      !isJumping.current
    ) {
      const bob =
        Math.sin(
          elapsed * 12,
        ) * 0.06;

      hero.position.y =
        1 + bob;

      if (
        leftArmRef.current
      ) {
        leftArmRef.current.rotation.z =
          Math.sin(
            elapsed * 12,
          ) * 0.25;
      }

      if (
        rightArmRef.current
      ) {
        rightArmRef.current.rotation.z =
          -Math.sin(
            elapsed * 12,
          ) * 0.25;
      }

      if (
        leftLegRef.current
      ) {
        leftLegRef.current.rotation.x =
          Math.sin(
            elapsed * 12,
          ) * 0.3;
      }

      if (
        rightLegRef.current
      ) {
        rightLegRef.current.rotation.x =
          -Math.sin(
            elapsed * 12,
          ) * 0.3;
      }
    } else if (
      !isJumping.current
    ) {
      /* ==================================== */
      /* IDLE                                  */
      /* ==================================== */

      hero.position.y = 1;

      if (
        leftArmRef.current
      ) {
        leftArmRef.current.rotation.z =
          THREE.MathUtils.lerp(
            leftArmRef.current.rotation.z,
            0,
            0.15,
          );
      }

      if (
        rightArmRef.current
      ) {
        rightArmRef.current.rotation.z =
          THREE.MathUtils.lerp(
            rightArmRef.current.rotation.z,
            0,
            0.15,
          );
      }

      if (
        leftLegRef.current
      ) {
        leftLegRef.current.rotation.x =
          THREE.MathUtils.lerp(
            leftLegRef.current.rotation.x,
            0,
            0.15,
          );

        leftLegRef.current.rotation.z =
          THREE.MathUtils.lerp(
            leftLegRef.current.rotation.z,
            0,
            0.15,
          );
      }

      if (
        rightLegRef.current
      ) {
        rightLegRef.current.rotation.x =
          THREE.MathUtils.lerp(
            rightLegRef.current.rotation.x,
            0,
            0.15,
          );

        rightLegRef.current.rotation.z =
          THREE.MathUtils.lerp(
            rightLegRef.current.rotation.z,
            0,
            0.15,
          );
      }
    }

    /* ======================================== */
    /* HIDE WEB WHEN NOT SWINGING               */
    /* ======================================== */

    webData.material.opacity =
      0;
  });

  /* ========================================== */
  /* HERO MODEL                                */
  /* ========================================== */

  return (
    <>
      {/* ====================================== */}
      {/* HERO                                   */}
      {/* ====================================== */}

      <group
        ref={playerRef}
        position={[
          0,
          1,
          6,
        ]}
      >
        {/* LEVEL-SYNCED SUIT UPGRADES */}
        {enhancedCore && (
          <mesh position={[0, 0.2, -0.38]} scale={[1.18, 1.18, 1]}>
            <boxGeometry args={[0.22, 0.25, 0.05]} />
            <meshStandardMaterial color="#67e8f9" emissive="#06b6d4" emissiveIntensity={4} />
          </mesh>
        )}

        {motionSync && (
          <group position={[0, 0.35, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.72, 0.018, 8, 32]} />
              <meshStandardMaterial color="#67e8f9" emissive="#67e8f9" emissiveIntensity={1.4} transparent opacity={0.5} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]}>
              <torusGeometry args={[0.68, 0.012, 8, 32]} />
              <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.2} transparent opacity={0.32} />
            </mesh>
          </group>
        )}

        {tacticalFrame && (
          <>
            <mesh position={[-0.64, 0.62, 0.04]} rotation={[0, 0, -0.25]}>
              <boxGeometry args={[0.12, 0.42, 0.18]} />
              <meshStandardMaterial color="#0e7490" emissive="#22d3ee" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[0.64, 0.62, 0.04]} rotation={[0, 0, 0.25]}>
              <boxGeometry args={[0.12, 0.42, 0.18]} />
              <meshStandardMaterial color="#0e7490" emissive="#22d3ee" emissiveIntensity={0.8} />
            </mesh>
          </>
        )}

        {apexLoadout && (
          <mesh position={[0, 0.35, 0]}>
            <torusGeometry args={[0.9, 0.014, 8, 40]} />
            <meshStandardMaterial color="#a5f3fc" emissive="#67e8f9" emissiveIntensity={1.8} transparent opacity={0.42} />
          </mesh>
        )}
        {/* ================================== */}
        {/* TORSO                              */}
        {/* ================================== */}

        <mesh
          position={[
            0,
            0.15,
            0,
          ]}
        >
          <boxGeometry
            args={[
              1.0,
              1.15,
              0.62,
            ]}
          />

          <meshStandardMaterial
            color="#ef1d2d"
            roughness={0.55}
            metalness={0.15}
          />
        </mesh>

        {/* ================================== */}
        {/* CHEST CORE                         */}
        {/* ================================== */}

        <mesh
          position={[
            0,
            0.2,
            -0.34,
          ]}
        >
          <boxGeometry
            args={[
              0.22,
              0.25,
              0.05,
            ]}
          />

          <meshStandardMaterial
            color="#67e8f9"
            emissive="#06b6d4"
            emissiveIntensity={3}
          />
        </mesh>

        {/* ================================== */}
        {/* HEAD / MASK                        */}
        {/* ================================== */}

        <mesh
          position={[
            0,
            0.95,
            0,
          ]}
        >
          <sphereGeometry
            args={[
              0.43,
              16,
              16,
            ]}
          />

          <meshStandardMaterial
            color="#05070d"
            roughness={0.65}
            metalness={0.15}
          />
        </mesh>

        {/* ================================== */}
        {/* LEFT EYE                           */}
        {/* ================================== */}

        <mesh
          position={[
            -0.16,
            1.0,
            -0.37,
          ]}
        >
          <sphereGeometry
            args={[
              0.07,
              8,
              8,
            ]}
          />

          <meshStandardMaterial
            color="#dffcff"
            emissive="#67e8f9"
            emissiveIntensity={4}
          />
        </mesh>

        {/* ================================== */}
        {/* RIGHT EYE                          */}
        {/* ================================== */}

        <mesh
          position={[
            0.16,
            1.0,
            -0.37,
          ]}
        >
          <sphereGeometry
            args={[
              0.07,
              8,
              8,
            ]}
          />

          <meshStandardMaterial
            color="#dffcff"
            emissive="#67e8f9"
            emissiveIntensity={4}
          />
        </mesh>

        {/* ================================== */}
        {/* LEFT ARM                           */}
        {/* ================================== */}

        <mesh
          ref={leftArmRef}
          position={[
            -0.65,
            0.18,
            0,
          ]}
        >
          <boxGeometry
            args={[
              0.25,
              0.95,
              0.3,
            ]}
          />

          <meshStandardMaterial
            color="#ef1d2d"
            roughness={0.55}
            metalness={0.12}
          />
        </mesh>

        {/* ================================== */}
        {/* RIGHT ARM                          */}
        {/* ================================== */}

        <mesh
          ref={rightArmRef}
          position={[
            0.65,
            0.18,
            0,
          ]}
        >
          <boxGeometry
            args={[
              0.25,
              0.95,
              0.3,
            ]}
          />

          <meshStandardMaterial
            color="#ef1d2d"
            roughness={0.55}
            metalness={0.12}
          />
        </mesh>

        {/* ================================== */}
        {/* LEFT LEG                           */}
        {/* ================================== */}

        <mesh
          ref={leftLegRef}
          position={[
            -0.25,
            -0.72,
            0,
          ]}
        >
          <boxGeometry
            args={[
              0.32,
              0.75,
              0.38,
            ]}
          />

          <meshStandardMaterial
            color="#05070d"
            roughness={0.65}
            metalness={0.15}
          />
        </mesh>

        {/* ================================== */}
        {/* RIGHT LEG                          */}
        {/* ================================== */}

        <mesh
          ref={rightLegRef}
          position={[
            0.25,
            -0.72,
            0,
          ]}
        >
          <boxGeometry
            args={[
              0.32,
              0.75,
              0.38,
            ]}
          />

          <meshStandardMaterial
            color="#05070d"
            roughness={0.65}
            metalness={0.15}
          />
        </mesh>

        {/* ================================== */}
        {/* LEFT BOOT                          */}
        {/* ================================== */}

        <mesh
          position={[
            -0.25,
            -1.08,
            -0.05,
          ]}
        >
          <boxGeometry
            args={[
              0.4,
              0.18,
              0.5,
            ]}
          />

          <meshStandardMaterial
            color="#ef1d2d"
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>

        {/* ================================== */}
        {/* RIGHT BOOT                         */}
        {/* ================================== */}

        <mesh
          position={[
            0.25,
            -1.08,
            -0.05,
          ]}
        >
          <boxGeometry
            args={[
              0.4,
              0.18,
              0.5,
            ]}
          />

          <meshStandardMaterial
            color="#ef1d2d"
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>

        {enhancedCore && (
          <>
            <mesh position={[0, 0.2, -0.36]}>
              <boxGeometry args={[0.34, 0.42, 0.035]} />
              <meshStandardMaterial
                color="#67e8f9"
                emissive="#06b6d4"
                emissiveIntensity={2.5}
              />
            </mesh>
            <mesh position={[-0.42, 0.15, -0.33]}>
              <boxGeometry args={[0.06, 0.72, 0.035]} />
              <meshStandardMaterial
                color="#67e8f9"
                emissive="#06b6d4"
                emissiveIntensity={1.8}
              />
            </mesh>
            <mesh position={[0.42, 0.15, -0.33]}>
              <boxGeometry args={[0.06, 0.72, 0.035]} />
              <meshStandardMaterial
                color="#67e8f9"
                emissive="#06b6d4"
                emissiveIntensity={1.8}
              />
            </mesh>
          </>
        )}

        {motionSync && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.72, 0.018, 8, 32]} />
            <meshStandardMaterial
              color="#67e8f9"
              emissive="#06b6d4"
              emissiveIntensity={1.4}
              transparent
              opacity={0.5}
            />
          </mesh>
        )}

        {tacticalFrame && (
          <>
            <mesh position={[-0.53, 0.43, -0.02]}>
              <sphereGeometry args={[0.13, 8, 8]} />
              <meshStandardMaterial color="#111827" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0.53, 0.43, -0.02]}>
              <sphereGeometry args={[0.13, 8, 8]} />
              <meshStandardMaterial color="#111827" metalness={0.7} roughness={0.3} />
            </mesh>
          </>
        )}

        {apexLoadout && (
          <mesh>
            <torusGeometry args={[0.88, 0.014, 8, 32]} />
            <meshStandardMaterial
              color="#22d3ee"
              emissive="#06b6d4"
              emissiveIntensity={1.5}
              transparent
              opacity={0.3}
            />
          </mesh>
        )}
      </group>

      {/* ====================================== */}
      {/* CURVED WEB                             */}
      {/* ====================================== */}

      <primitive
        object={webLine}
      />

      <primitive
        object={swingTrailLine}
      />

      {/* ====================================== */}
      {/* LANDING SHOCKWAVE                      */}
      {/* ====================================== */}

      <primitive
        object={impactRing}
      />

      {/* ====================================== */}
      {/* LANDING PARTICLES                      */}
      {/* ====================================== */}

      <primitive
        object={
          impactParticles.group
        }
      />

      {/* ====================================== */}
      {/* LANDING GLOW                           */}
      {/* ====================================== */}

      <primitive
        object={impactLight}
      />
    </>
  );
}