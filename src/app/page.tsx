'use client'

import { useEffect, useState } from 'react'
import { State } from '@/types/state'

export const defaultState: State = {
  timerStart: null,
}

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

export default function Home() {
  const [state, setState] = useState<State>(defaultState)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    const poll = async () => {
      try {
        const res = await fetch('/api/state', {
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!res.ok) return
        const data = (await res.json()) as State
        if (!cancelled) setState(data)
      } catch {}
    }

    poll()
    const id = setInterval(poll, 1000)

    return () => {
      cancelled = true
      controller.abort()
      clearInterval(id)
    }
  }, [])

  const elapsed = state.timerStart ? now - state.timerStart : 0

  return (
    <div className='min-h-screen min-w-screen p-6'>
      <div className='bg-black/95 rounded-xl text-white p-4 w-fit'>
        <p className='text-4xl font-semibold tabular-nums'>{formatDuration(elapsed)}</p>
        {state.bossName && <p className='text-2xl mt-2'>Boss: {state.bossName}</p>}
        {state.timerTwoStart && <p className='text-2xl mt-2'>Timer Two: {formatDuration(now - state.timerTwoStart)}</p>}
      </div>
    </div>
  )
}
