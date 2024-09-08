import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to the 3D Vehicle Game!
        </h1>

        <p className="mt-3 text-2xl">
          Get ready for an exciting adventure!
        </p>

        <div className="mt-6">
          <Link href="/game" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Start Game
          </Link>
        </div>
      </main>
    </div>
  )
}