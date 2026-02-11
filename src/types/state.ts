export interface State {
  timerStart: number | null
  timerTwoStart?: number | null
  bossName?: string
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
