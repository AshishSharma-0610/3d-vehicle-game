'use client'

import dynamic from 'next/dynamic'

const Game = dynamic(() => import('@/components/Game'), { ssr: false })

export default function GamePage() {
  return (
    <div className="w-full h-screen">
      <Game />
    </div>
  )
}