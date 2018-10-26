import { types } from '../constants/types'

const initialState = {
  descs: null
}

export const descReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_DESKS:
      return {
        ...state,
        descs: action.descs
      }
    default:
      return state
  }
}