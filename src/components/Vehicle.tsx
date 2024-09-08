import React, { useRef, useImperativeHandle, forwardRef } from 'react'
import { RigidBody, useRapier } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface VehicleRef {
    moveForward: () => void;
    moveBackward: () => void;
    steer: (mouseX: number) => void;
    getPosition: () => [number, number, number];
    reset: () => void;
}

const Vehicle = forwardRef<VehicleRef>((_, ref) => {
    const rigidBodyRef = useRef<any>(null)
    const steeringAngle = useRef(0)
    const velocity = useRef(new THREE.Vector3())
    const { rapier, world } = useRapier()

    const maxSpeed = 30
    const acceleration = 0.5
    const deceleration = 0.98
    useImperativeHandle(ref, () => ({
        moveForward: () => {
            if (rigidBodyRef.current) {
                const rotation = rigidBodyRef.current.rotation()
                const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(rotation)
                velocity.current.add(direction.multiplyScalar(acceleration))
            }
        },
        moveBackward: () => {
            if (rigidBodyRef.current) {
                const rotation = rigidBodyRef.current.rotation()
                const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(rotation)
                velocity.current.add(direction.multiplyScalar(acceleration * 0.5))
            }
        },
        steer: (mouseX: number) => {
            const targetAngle = mouseX * Math.PI * 0.3
            steeringAngle.current += (targetAngle - steeringAngle.current) * 0.1
        },
        getPosition: () => {
            if (rigidBodyRef.current) {
                const position = rigidBodyRef.current.translation()
                return [position.x, position.y, position.z]
            }
            return [0, 0, 0]
        },
        reset: () => {
            if (rigidBodyRef.current) {
                rigidBodyRef.current.setTranslation({ x: 0, y: 2, z: 0 })
                rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 })
                rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 })
                steeringAngle.current = 0
                velocity.current.set(0, 0, 0)
            }
        }
    }))

    useFrame(() => {
        if (rigidBodyRef.current) {

            rigidBodyRef.current.setLinvel(velocity.current)

            rigidBodyRef.current.setAngvel({ x: 0, y: steeringAngle.current * 2, z: 0 }) // 

            velocity.current.multiplyScalar(deceleration)

            const currentSpeed = velocity.current.length()
            if (currentSpeed > maxSpeed) {
                velocity.current.multiplyScalar(maxSpeed / currentSpeed)
            }

            const rotation = rigidBodyRef.current.rotation()
            const up = new THREE.Vector3(0, 1, 0).applyQuaternion(rotation)
            const alignmentForce = new THREE.Vector3(0, 1, 0).sub(up).multiplyScalar(20)
            rigidBodyRef.current.applyTorqueImpulse(alignmentForce)
        }
    })

    return (
        <RigidBody
            ref={rigidBodyRef}
            colliders="cuboid"
            mass={600}
            type="dynamic"
            position={[0, 2, 0]}
            name="vehicle"
            linearDamping={0.5}
            angularDamping={0.5}
            friction={1}
        >
            <group>
                <mesh castShadow>
                    <boxGeometry args={[1.8, 0.8, 3]} />
                    <meshStandardMaterial color="darkblue" />
                </mesh>
                <mesh position={[0, -0.4, -1.25]} castShadow>
                    <sphereGeometry args={[0.4, 32, 32]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <mesh position={[-0.8, -0.4, 1.25]} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                <mesh position={[0.8, -0.4, 1.25]} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
                    <meshStandardMaterial color="black" />
                </mesh>
            </group>
        </RigidBody>
    )
})

export default Vehicle