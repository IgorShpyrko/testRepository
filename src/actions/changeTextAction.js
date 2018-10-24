import { CHANGE_TEXT } from '../constants/actionTypes'

export function changeTextAction(text){
  return {
    type: CHANGE_TEXT,
    text
  }
}