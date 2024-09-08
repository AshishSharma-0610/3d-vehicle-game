import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import Vehicle from './Vehicle'
import FallingShapes from './FallingShapes'
import Ground from './Ground'
import GameOver from './GameOver'

function Scene({ onGameOver }: { onGameOver: () => void }) {
    const vehicleRef = useRef<any>(null)
    const { camera } = useThree()
    const keysPressed = useRef<{ [key: string]: boolean }>({})

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            keysPressed.current[event.key.toLowerCase()] = true
        }
        const handleKeyUp = (event: KeyboardEvent) => {
            keysPressed.current[event.key.toLowerCase()] = false
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    useFrame((state) => {
        if (vehicleRef.current) {
            if (keysPressed.current['w']) {
                vehicleRef.current.moveForward()
            }
            if (keysPressed.current['s']) {
                vehicleRef.current.moveBackward()
            }

            const mouseX = state.mouse.x
            vehicleRef.current.steer(mouseX)

            const vehiclePosition = vehicleRef.current.getPosition()
            camera.position.x = vehiclePosition[0]
            camera.position.y = vehiclePosition[1] + 5
            camera.position.z = vehiclePosition[2] + 10
            camera.lookAt(vehiclePosition[0], vehiclePosition[1], vehiclePosition[2])
        }
    })

    return (
        <>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} castShadow />
            <Physics gravity={[0, -9.81, 0]}>
                <Vehicle ref={vehicleRef} />
                <FallingShapes onCollision={onGameOver} vehicleRef={vehicleRef} />
                <Ground />
            </Physics>
        </>
    )
}

export default function Game() {
    const [gameOver, setGameOver] = useState(false)
    const [score, setScore] = useState(0)
    const [gameKey, setGameKey] = useState(0)
    const startTime = useRef(Date.now())

    useEffect(() => {
        const scoreInterval = setInterval(() => {
            if (!gameOver) {
                const elapsedSeconds = Math.floor((Date.now() - startTime.current) / 1000)
                setScore(elapsedSeconds)
            }
        }, 1000)

        return () => clearInterval(scoreInterval)
    }, [gameOver])

    const handleGameOver = () => {
        setGameOver(true)
    }

    const restartGame = () => {
        setGameOver(false)
        setScore(0)
        startTime.current = Date.now()
        setGameKey(prevKey => prevKey + 1)
    }

    return (
        <div className="relative w-full h-screen">
            <Canvas shadows key={gameKey}>
                <color attach="background" args={['#87CEEB']} />
                <fog attach="fog" args={['#87CEEB', 0, 100]} />
                <PerspectiveCamera makeDefault position={[0, 5, 10]} />
                <OrbitControls enabled={false} />
                <Scene onGameOver={handleGameOver} />
            </Canvas>
            <div className="absolute top-0 left-0 m-4 text-white text-2xl font-bold bg-black bg-opacity-50 p-2 rounded">
                Time Survived: {score} seconds
            </div>
            <div className="absolute bottom-0 left-0 m-4 text-white text-xl bg-black bg-opacity-50 p-2 rounded">
                Controls: W (forward), S (backward), Mouse (steering)
            </div>
            {gameOver && <GameOver score={score} onRestart={restartGame} />}
        </div>
    )
}