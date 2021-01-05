import { MOVE_STAGE_X } from '../constants/actionTypes'

export default function stageX(state = 0, action) {
  switch (action.type) {
    case MOVE_STAGE_X:
      return clamp(state + action.payload, -2048, 0)

    default:
      return state
  }
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max)
}
