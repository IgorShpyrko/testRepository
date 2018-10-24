const defaultState = {id: 1}

export const testReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'TEST_ACTION':
      return {
        ...state
      }
    default:
      return state
  }
}