import { promises as fs } from 'fs'
import { join } from 'path'

import { State } from '@/types/state'

const DATA_DIR = join(process.cwd(), 'data')
const STATE_FILE = join(DATA_DIR, 'state.json')

export const defaultState: State = {
  globalTimer: null,
  globalElapsedTime: null,
  bossElapsedTime: null,
  globalDeaths: 0,
  bossTimer: null,
  bossName: undefined,
  bossDeaths: 0,
  overlayShow: false,
  globalDeathsShow: false,
  globalTimerShow: false,
}

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch {}
}

export async function loadState(): Promise<State> {
  try {
    const data = await fs.readFile(STATE_FILE, 'utf-8')
    return JSON.parse(data) as State
  } catch {
    return { ...defaultState }
  }
}

export async function saveState(state: State): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8')
}

export async function resetState(): Promise<State> {
  const state = { ...defaultState }
  await saveState(state)
  return state
}
