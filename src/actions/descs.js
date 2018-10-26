import { types } from '../constants/types';
import { fetchDescs } from '../mocks/desks'

export const fetchDescsAction = () => {
  let descs = fetchDescs()
  return {
    type: types.FETCH_DESKS,
    descs: descs
  }
}