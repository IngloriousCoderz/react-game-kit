import { SET_CHARACTER_POSITION } from '../constants/actionTypes'

export default function characterPosition(state = { x: 0, y: 0 }, action) {
  switch (action.type) {
    case SET_CHARACTER_POSITION:
      return action.payload

    default:
      return state
  }
}
