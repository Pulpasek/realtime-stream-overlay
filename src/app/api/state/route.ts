import { ParamHandler, State } from '@/types/state'

let state: State = {
  timerStart: null,
}

const paramHandlers: ParamHandler[] = [
  {
    key: 'timer',
    update: ({ state, now }, value) => {
      if (value === 'start' || value === 'restart') {
        return { ...state, timerStart: now }
      }
      if (value === 'stop') {
        return { ...state, timerStart: null }
      }

      return state
    },
  },
  {
    key: 'timerTwo',
    update: ({ state, now }, value) => {
      if (value === 'start' || value === 'restart') {
        return { ...state, timerTwoStart: now }
      }
      if (value === 'stop') {
        return { ...state, timerTwoStart: null }
      }

      return state
    },
  },
  {
    key: 'boss',
    update: ({ state }, value) => {
      if (!value) return state

      return { ...state, bossName: value }
    },
  },
]

function applyQueryParams(req: Request) {
  const { searchParams } = new URL(req.url)
  const now = Date.now()

  state = paramHandlers.reduce((nextState, handler) => {
    const value = searchParams.get(handler.key)
    if (value == null) return nextState

    return handler.update({ state: nextState, searchParams, now }, value)
  }, state)
}

export async function GET(req: Request) {
  applyQueryParams(req)
  return Response.json(state, {
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function POST(req: Request) {
  applyQueryParams(req)

  return Response.json(state, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
