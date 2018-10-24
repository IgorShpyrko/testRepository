const defaultState = {}

const TEST_ACTION = 'TEST_ACTION'

export const myTestAction = (state = defaultState, action) => {
  switch (action.type) {
    case TEST_ACTION:
      return action.data
    default:
      return state
  }
}
