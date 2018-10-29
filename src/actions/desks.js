import { types } from '../constants/types';
import { fetchDesks } from '../mocks/desks'

export const fetchDesksAction = () => {
  let desks = fetchDesks()
  return {
    type: types.FETCH_DESKS,
    desks: desks
  }
}