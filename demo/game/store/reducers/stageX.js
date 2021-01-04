import { MOVE_STAGE_X } from '../constants/actionTypes'

export default function stageX(state = 0, action) {
  switch (action.type) {
    case MOVE_STAGE_X:
      if (action.payload > 0) {
        return 0
      }

      if (action.payload < -2048) {
        return -2048
      }

      return state + action.payload

    default:
      return state
  }
}
