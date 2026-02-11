import { defaultState, loadState, saveState } from '@/lib/storage'
import { ParamHandler, State } from '@/types/state'

let state: State = { ...defaultState }
let stateLoaded = false

async function ensureStateLoaded() {
  if (!stateLoaded) {
    state = await loadState()
    stateLoaded = true
  }
}

const paramHandlers: ParamHandler[] = [
  {
    key: 'globalTimerStart',
    update: ({ state, now }) => {
      return { ...state, globalTimer: now }
    },
  },
  {
    key: 'globalTimerRestart',
    update: ({ state, now }) => {
      return { ...state, globalTimer: now }
    },
  },
  {
    key: 'globalTimerStop',
    update: ({ state }) => {
      return { ...state, globalTimer: null }
    },
  },
  {
    key: 'addGlobalDeaths',
    update: ({ state }, value) => {
      if (!value) {
        return { ...state, globalDeaths: (state.globalDeaths || 0) + 1 }
      }
      return { ...state, globalDeaths: (state.globalDeaths || 0) + Number(value) }
    },
  },
  {
    key: 'removeGlobalDeaths',
    update: ({ state }, value) => {
      if (!value) {
        return { ...state, globalDeaths: Math.max(0, (state.globalDeaths || 0) - 1) }
      }
      return { ...state, globalDeaths: Math.max(0, (state.globalDeaths || 0) - Number(value)) }
    },
  },
  {
    key: 'bossStart',
    update: ({ state, now }, value) => {
      if (!value) return state
      return { ...state, bossTimer: now, bossName: value }
    },
  },
  {
    key: 'addBossDeaths',
    update: ({ state }, value) => {
      if (!state.bossName) return state
      if (!value) {
        return {
          ...state,
          globalDeaths: (state.globalDeaths || 0) + 1,
          bossDeaths: (state.bossDeaths || 0) + 1,
        }
      }
      return {
        ...state,
        globalDeaths: (state.globalDeaths || 0) + Number(value),
        bossDeaths: (state.bossDeaths || 0) + Number(value),
      }
    },
  },
  {
    key: 'removeBossDeaths',
    update: ({ state }, value) => {
      if (!state.bossName) return state
      if (!value) {
        return {
          ...state,
          globalDeaths: Math.max(0, (state.globalDeaths || 0) - 1),
          bossDeaths: Math.max(0, (state.bossDeaths || 0) - 1),
        }
      }
      return {
        ...state,
        globalDeaths: Math.max(0, (state.globalDeaths || 0) - Number(value)),
        bossDeaths: Math.max(0, (state.bossDeaths || 0) - Number(value)),
      }
    },
  },
  {
    key: 'bossStop',
    update: ({ state }) => {
      return { ...state, bossTimer: null, bossName: undefined, bossDeaths: 0 }
    },
  },
  {
    key: 'bossRestart',
    update: ({ state, now }) => {
      if (!state.bossName) return state
      return { ...state, bossTimer: now }
    },
  },
  {
    key: 'setGlobalDeaths',
    update: ({ state }, value) => {
      if (!value) return state
      return { ...state, globalDeaths: Math.max(0, Number(value)) }
    },
  },
  {
    key: 'setGlobalTimer',
    update: ({ state }, value) => {
      if (!value) return { ...state, globalTimer: null }
      const timestamp = Number(value)
      return { ...state, globalTimer: timestamp > 0 ? timestamp : null }
    },
  },
  {
    key: 'setBossDeaths',
    update: ({ state }, value) => {
      if (!state.bossName) return state
      if (!value) return state
      return { ...state, bossDeaths: Math.max(0, Number(value)) }
    },
  },
  {
    key: 'setBossTimer',
    update: ({ state }, value) => {
      if (!state.bossName) return state
      if (!value) return { ...state, bossTimer: null }
      const timestamp = Number(value)
      return { ...state, bossTimer: timestamp > 0 ? timestamp : null }
    },
  },
  {
    key: 'setBossName',
    update: ({ state }, value) => {
      if (!value) return state
      return { ...state, bossName: value }
    },
  },
  {
    key: 'resetGlobalDeaths',
    update: ({ state }) => {
      return { ...state, globalDeaths: 0 }
    },
  },
  {
    key: 'resetBossDeaths',
    update: ({ state }) => {
      return { ...state, bossDeaths: 0 }
    },
  },
  {
    key: 'resetAll',
    update: () => {
      return { ...defaultState }
    },
  },
]

async function applyQueryParams(req: Request) {
  const { searchParams } = new URL(req.url)
  const now = Date.now()

  let stateChanged = false

  const newState = paramHandlers.reduce((nextState, handler) => {
    const value = searchParams.get(handler.key)
    if (value == null) return nextState

    stateChanged = true
    return handler.update({ state: nextState, searchParams, now }, value)
  }, state)

  if (stateChanged) {
    state = newState
    await saveState(state)
  }
}

export async function GET(req: Request) {
  await ensureStateLoaded()
  await applyQueryParams(req)
  return Response.json(state, {
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function POST(req: Request) {
  await ensureStateLoaded()
  await applyQueryParams(req)

  return Response.json(state, {
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function PUT(req: Request) {
  await ensureStateLoaded()

  try {
    const body = await req.json()
    state = { ...state, ...body }
    await saveState(state)

    return Response.json(state, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export async function DELETE() {
  state = { ...defaultState }
  await saveState(state)

  return Response.json(state, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
