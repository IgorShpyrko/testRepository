import { combineReducers } from 'redux'
import { testReducer } from './testReducer'
import { textReducer } from './textReducer'

export default combineReducers({
  testReducer,
  textReducer
})