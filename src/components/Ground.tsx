import React from 'react'
import { RigidBody } from '@react-three/rapier'

const Ground: React.FC = () => {
    return (
        <RigidBody type="fixed" colliders="cuboid">
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[10000, 10000]} />
                <meshStandardMaterial color="gray" />
            </mesh>
        </RigidBody>
    )
}

export default Ground
