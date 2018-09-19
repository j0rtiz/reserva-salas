export const resetState = (state) => {
  Object.assign(state, require('./state.js').default)
}
export const set = (state, session) => {
  Object.assign(state, session)
}
