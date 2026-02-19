'use client'

import { Divider } from '@heroui/react'
import { useEffect, useState } from 'react'
import { State } from '@/types/state'

export const defaultState: State = {
  globalTimer: null,
  globalDeaths: 0,
  bossTimer: null,
  bossName: undefined,
  bossDeaths: 0,
  overlayShow: false,
  globalDeathsShow: false,
  globalTimerShow: false,
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

  const elapsed = state.globalTimer ? (state.globalElapsedTime || 0) + (now - state.globalTimer) : state.globalElapsedTime || 0
  const bElapsed = state.bossTimer ? (state.bossElapsedTime || 0) + (now - state.bossTimer) : state.bossElapsedTime || 0

  const hasOverlayContent = !!(
    state.globalDeathsShow || state.globalTimerShow || state.bossName
  )

  if (!state.overlayShow || !hasOverlayContent) return null

  return (
    <div className='min-h-screen min-w-screen p-6 bg-transparent'>
      <div className='bg-black/95 border border-white/20 rounded-xl text-white p-4 w-fit'>
        {/* Global Deaths */}
        {state.globalDeathsShow && (
          <div className='flex gap-4 text-4xl'>
            <p className='font-semibold'>Deaths:</p>
            <p>{state.globalDeaths || 0}</p>
          </div>
        )}
        {/* Global Timer */}
        {state.globalTimerShow && (
          <div className='flex gap-4 text-4xl'>
            <p className='font-semibold'>Timer:</p>
            <p className='tabular-nums'>{formatDuration(elapsed)}</p>
          </div>
        )}
        {/* Boss Specific */}
        {state.bossName && (
          <div className='text-blue-400'>
            <Divider className='my-4 bg-white/20' />

            <div className='flex gap-4 text-4xl'>
              <p className='font-semibold'>Boss:</p>
              <p>{state.bossName || 'N/A'}</p>
            </div>

            <div className='flex gap-4 text-4xl'>
              <p className='font-semibold'>Deaths:</p>
              <p>{state.bossDeaths || 0}</p>
            </div>

            <div className='flex gap-4 text-4xl'>
              <p className='font-semibold'>Timer:</p>
              <p className='tabular-nums'>
                {formatDuration(bElapsed)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
