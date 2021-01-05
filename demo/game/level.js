import React, { Component, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { TileMap } from '../../src'

import ScaleContext from '../../src/contexts/scale'
import StoreContext from './store/contexts/store'
import { getStageX } from './store/reducers'
import { BOARDWALK_HEIGHT, BUILDING_HEIGHT } from './store/constants/sizes'

function Level() {
  const scale = useContext(ScaleContext)
  const { state } = useContext(StoreContext)
  const stageX = getStageX(state)

  const [internalStageX, setInternalStageX] = useState(stageX)

  useEffect(() => {
    setInternalStageX(Math.round(stageX * scale))
  }, [stageX, scale])

  const getWrapperStyles = () => ({
    position: 'absolute',
    transform: `translate(${internalStageX}px, 0px) translateZ(0)`,
    transformOrigin: 'top left',
  })

  return (
    <div style={getWrapperStyles()}>
      <TileMap
        style={{ top: Math.floor(64 * scale) }}
        src="assets/boardwalktile.png"
        tileSize={BOARDWALK_HEIGHT}
        columns={24}
        rows={4}
        layers={[
          [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
          ],
        ]}
      />
      <TileMap
        style={{ top: Math.ceil(-64 * scale) }}
        src="assets/buildings.png"
        rows={1}
        columns={6}
        tileSize={BUILDING_HEIGHT}
        layers={[[1, 2, 3, 4, 5, 6]]}
      />
    </div>
  )
}

export default Level
