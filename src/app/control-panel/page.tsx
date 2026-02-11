'use client'

import { Button, Input } from '@heroui/react'
import { useEffect, useState } from 'react'
import { State } from '@/types/state'

function formatDuration(ms: number) {
  if (!ms) return '00:00:00'
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

export default function ControlPanel() {
  const [state, setState] = useState<State | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [bossNameInput, setBossNameInput] = useState('')
  const [globalDeathsInput, setGlobalDeathsInput] = useState('')
  const [bossDeathsInput, setBossDeathsInput] = useState('')

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    async function fetchState() {
      try {
        const response = await fetch('/api/state')
        const data = (await response.json()) as State
        setState(data)
      } catch {}
    }

    fetchState()
    const id = setInterval(fetchState, 2000)
    return () => clearInterval(id)
  }, [])

  async function sendCommand(command: string, value: string | null = null) {
    try {
      const url = value
        ? `/api/state?${command}=${encodeURIComponent(value)}`
        : `/api/state?${command}`

      const response = await fetch(url)
      const data = (await response.json()) as State

      setState(data)
    } catch {}
  }

  async function refreshState() {
    try {
      const response = await fetch('/api/state')
      const data = (await response.json()) as State
      setState(data)
    } catch {}
  }

  const globalTimer = state?.globalTimer ? formatDuration(now - state.globalTimer) : '00:00:00'
  const bossTimer = state?.bossTimer ? formatDuration(now - state.bossTimer) : '00:00:00'

  return (
    <div className='min-h-screen bg-black text-white p-5'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-4xl font-bold mb-8 text-white'>Control Panel</h1>

        {/* Current State */}
        <section className='bg-neutral-900 border border-neutral-600 rounded-lg p-5 mb-5'>
          <h2 className='text-2xl font-semibold mb-4 text-neutral-100'>Current State</h2>
          <div className='bg-black/30 border border-neutral-600 rounded-lg p-4 mb-4'>
            <StateItem label='Global Deaths' value={state?.globalDeaths || 0} />
            <StateItem label='Global Timer' value={globalTimer} />
            <StateItem label='Boss Name' value={state?.bossName || 'N/A'} />
            <StateItem label='Boss Deaths' value={state?.bossDeaths || 0} />
            <StateItem label='Boss Timer' value={bossTimer} />
          </div>

          <div className='flex gap-2'>
            <Button
              onPress={() => refreshState()}
              className='bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded'
            >
              Refresh State
            </Button>
            <Button
              color='danger'
              onPress={() => sendCommand('resetAll')}
              className='text-white px-4 py-2 rounded'
            >
              Reset All
            </Button>
          </div>
        </section>

        {/* Global */}
        <section className='bg-neutral-900 border border-neutral-600 rounded-lg p-5 mb-5'>
          <h2 className='text-2xl font-semibold mb-4 text-neutral-100'>Global Control</h2>
          <p className='uppercase mt-4 mb-3 text-sm opacity-55'>Timer</p>
          <div className='flex gap-2'>
            <Button
              onPress={() => sendCommand('globalTimerStart')}
              className='bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded'
            >
              Start Timer
            </Button>
            <Button
              onPress={() => sendCommand('globalTimerPause')}
              className='bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded'
            >
              Pause Timer
            </Button>
            <Button
              onPress={() => sendCommand('globalTimerRestart')}
              className='bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded'
            >
              Restart Timer
            </Button>
            <Button
              color='danger'
              onPress={() => sendCommand('globalTimerStop')}
              className='text-white px-4 py-2 rounded'
            >
              Stop Timer
            </Button>
          </div>
          <p className='uppercase mt-4 mb-3 text-sm opacity-55'>Deaths</p>
          <div className='flex gap-2 mt-2'>
            <Button
              onPress={() => sendCommand('addGlobalDeaths')}
              className='bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded'
            >
              Add Death (+1)
            </Button>
            <Button
              onPress={() => sendCommand('removeGlobalDeaths')}
              className='bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded'
            >
              Remove Death (-1)
            </Button>
            <Button
              color='danger'
              onPress={() => sendCommand('resetGlobalDeaths')}
              className='text-white px-4 py-2 rounded'
            >
              Reset Deaths
            </Button>
          </div>
          <div className='flex gap-2 flex-wrap mt-2'>
            <Input
              value={globalDeathsInput}
              onChange={e => setGlobalDeathsInput(e.target.value)}
              placeholder='Enter death count'
              radius='sm'
              classNames={{
                base: 'flex-1 max-w-[350px]',
                inputWrapper:
                  'bg-neutral-800 border-neutral-600 data-[hover=true]:!bg-neutral-700 group-data-[focus-within=true]:!bg-neutral-700',
                input: '!text-white placeholder:text-neutral-400',
              }}
            />
            <Button
              onPress={() => {
                sendCommand('setGlobalDeaths', globalDeathsInput)
                setGlobalDeathsInput('')
              }}
              className='bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded'
            >
              Set Deaths
            </Button>
          </div>
        </section>

        {/* Boss */}
        <section className='bg-neutral-900 border border-neutral-600 rounded-lg p-5 mb-5'>
          <h2 className='text-2xl font-semibold mb-4 text-neutral-100'>Boss Control</h2>
          <p className='uppercase mt-4 mb-3 text-sm opacity-55'>Timer</p>
          <div className='flex gap-2'>
            <Input
              value={bossNameInput}
              onChange={e => setBossNameInput(e.target.value)}
              placeholder='Enter boss name'
              radius='sm'
              classNames={{
                base: 'flex-1 max-w-[350px]',
                inputWrapper:
                  'bg-neutral-800 border-neutral-600 data-[hover=true]:!bg-neutral-700 group-data-[focus-within=true]:!bg-neutral-700',
                input: '!text-white placeholder:text-neutral-400',
              }}
            />
            <Button
              onPress={() => {
                sendCommand('bossStart', bossNameInput)
                setBossNameInput('')
              }}
              className='bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded'
            >
              Start Boss
            </Button>
          </div>
          <div className='flex gap-2 mt-2'>
            <Button
              onPress={() => sendCommand('bossRestart')}
              className='bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded'
            >
              Restart Boss Timer
            </Button>
            <Button
              color='danger'
              onPress={() => sendCommand('bossStop')}
              className='text-white px-4 py-2 rounded'
            >
              End Boss
            </Button>
          </div>

          <p className='uppercase mt-4 mb-3 text-sm opacity-55'>Deaths</p>
          <div className='flex gap-2 mt-2'>
            <Button
              onPress={() => sendCommand('addBossDeaths')}
              className='bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded'
            >
              Add Boss Death (+1)
            </Button>
            <Button
              onPress={() => sendCommand('removeBossDeaths')}
              className='bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded'
            >
              Remove Boss Death (-1)
            </Button>
            <Button
              color='danger'
              onPress={() => sendCommand('resetBossDeaths')}
              className='text-white px-4 py-2 rounded'
            >
              Reset Boss Deaths
            </Button>
          </div>
          <div className='flex gap-2 mt-2'>
            <Input
              value={bossDeathsInput}
              onChange={e => setBossDeathsInput(e.target.value)}
              placeholder='Enter boss death count'
              radius='sm'
              classNames={{
                base: 'flex-1 max-w-[350px]',
                inputWrapper:
                  'bg-neutral-800 border-neutral-600 data-[hover=true]:!bg-neutral-700 group-data-[focus-within=true]:!bg-neutral-700',
                input: '!text-white placeholder:text-neutral-400',
              }}
            />
            <Button
              onPress={() => {
                sendCommand('setBossDeaths', bossDeathsInput)
                setBossDeathsInput('')
              }}
              className='bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded'
            >
              Set Boss Deaths
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

function StateItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className='flex justify-between py-2 border-b border-neutral-600 last:border-b-0'>
      <span className='text-neutral-400 font-semibold'>{label}:</span>
      <span className='text-white font-bold'>{value}</span>
    </div>
  )
}
