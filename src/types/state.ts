export interface State {
  globalTimer: number | null
  globalDeaths?: number
  bossTimer?: number | null
  bossName?: string
  bossDeaths?: number
}

export interface UpdateContext {
  state: State
  searchParams: URLSearchParams
  now: number
}

export interface ParamHandler {
  key: string
  update: ParamUpdate
}

export type ParamUpdate = (ctx: UpdateContext, value: string) => State
