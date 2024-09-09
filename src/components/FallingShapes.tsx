import React, { useState, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

const shapeTypes = ['box', 'sphere', 'pyramid'] as const
const colors = ['red', 'pink', 'silver', 'yellow'] as const

interface FallingShapeProps {
    position: [number, number, number];
    shape: 'box' | 'sphere' | 'pyramid';
    color: string;
    size: [number, number, number];
    mass: number;
    onCollision: () => void;
    vehiclePosition: THREE.Vector3;
}

const FallingShape: React.FC<FallingShapeProps> = ({ position, shape, color, size, mass, onCollision, vehiclePosition }) => {
    const rigidBodyRef = useRef<any>(null)

    useFrame(() => {
        if (rigidBodyRef.current) {
            const currentPosition = rigidBodyRef.current.translation()
            if (currentPosition.y < -10) {
                const newX = vehiclePosition.x + (Math.random() * 20 - 10)
                const newZ = vehiclePosition.z + (Math.random() * 20 - 10)
                rigidBodyRef.current.setTranslation({ x: newX, y: 20, z: newZ })
                rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 })
                rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 })
            }
        }
    })

    return (
        <RigidBody ref={rigidBodyRef} colliders="cuboid" mass={mass} type="dynamic" position={position} onCollisionEnter={({ other }) => {
            if (other.rigidBodyObject?.name === 'vehicle') {
                onCollision()
            }
        }}>
            <mesh castShadow>
                {shape === 'box' && <boxGeometry args={size} />}
                {shape === 'sphere' && <sphereGeometry args={[size[0] / 2, 32, 32]} />}
                {shape === 'pyramid' && <coneGeometry args={[size[0], size[1], 4]} />}
                <meshStandardMaterial color={color} />
            </mesh>
        </RigidBody>
    )
}

interface FallingShapesProps {
    onCollision: () => void;
    vehicleRef: React.RefObject<any>;
}

const FallingShapes: React.FC<FallingShapesProps> = ({ onCollision, vehicleRef }) => {
    const [fallingShapes, setFallingShapes] = useState<any[]>([])
    const vehiclePosition = useRef(new THREE.Vector3())

    useFrame(() => {
        if (vehicleRef.current) {
            const position = vehicleRef.current.getPosition()
            vehiclePosition.current.set(position[0], position[1], position[2])
        }
    })

    const createShape = () => {
        return {
            shape: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            size: [Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5],
            mass: Math.random() * 2 + 0.5,
            position: [
                vehiclePosition.current.x + (Math.random() * 20 - 10),
                20 + Math.random() * 10,
                vehiclePosition.current.z + (Math.random() * 20 - 10)
            ] as [number, number, number],
        }
    }

    useEffect(() => {
        const initialShapes = Array(10).fill(null).map(createShape)
        setFallingShapes(initialShapes)

        const addShape = () => {
            setFallingShapes((prevShapes) => [...prevShapes, createShape()])
        }

        const intervalId = setInterval(() => {
            if (fallingShapes.length < 50) {
                addShape()
            }
        }, 1000)

        return () => clearInterval(intervalId)
    }, [])

    return (
        <>
            {fallingShapes.map((fallingShape, index) => (
                <FallingShape
                    key={index}
                    position={fallingShape.position}
                    shape={fallingShape.shape}
                    color={fallingShape.color}
                    size={fallingShape.size}
                    mass={fallingShape.mass}
                    onCollision={onCollision}
                    vehiclePosition={vehiclePosition.current}
                />
            ))}
        </>
    )
}

export default FallingShapes
