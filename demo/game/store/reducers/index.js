import characterPosition from './characterPosition'
import stageX from './stageX'

export const getCharacterPosition = ({ characterPosition }) => characterPosition
export const getStageX = ({ stageX }) => stageX

const combineReducers = (reducers) => (state = {}, action) =>
  Object.keys(reducers).reduce((acc, key) => {
    acc[key] = reducers[key](state[key], action)
    return acc
  }, {})

export default combineReducers({ characterPosition, stageX })
