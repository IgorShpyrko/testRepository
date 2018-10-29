import { types } from '../constants/types'

const initialState = {
  desks: null
}

export const deskReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_DESKS:
      return {
        ...state,
        desks: action.desks
      }
    default:
      return state
  }
}