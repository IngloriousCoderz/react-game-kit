import { MOVE_STAGE_X, SET_CHARACTER_POSITION } from '../constants/actionTypes'

export const setCharacterPosition = (position) => ({
  type: SET_CHARACTER_POSITION,
  payload: position,
})

export const moveStageX = (x) => ({ type: MOVE_STAGE_X, payload: x })
