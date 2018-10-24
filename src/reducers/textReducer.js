import { CHANGE_TEXT } from '../constants/actionTypes'

const defaultState = {text: ''}

export const textReducer = (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_TEXT:
      return {
        ...state,
        text: action.text
      }
    default:
      return state
  }
}