import characterPosition from './characterPosition'
import stageX from './stageX'

export const getCharacterPosition = ({ characterPosition }) => characterPosition
export const getStageX = ({ stageX }) => stageX

const combineReducers = (reducers) => (state = {}, action) => {
  const combinedStates = {}
  Object.keys(reducers).forEach((key) => {
    combinedStates[key] = reducers[key](state[key], action)
  })
  return combinedStates
}

export default combineReducers({ characterPosition, stageX })
