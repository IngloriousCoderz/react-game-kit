import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import GameLoop from '../utils/game-loop'
import LoopContext from '../contexts/loop'

const defaultStyles = {
  height: '100%',
  width: '100%',
}

function Loop({ style, children }) {
  const loop = useRef(new GameLoop())

  useEffect(() => {
    loop.current.start()

    return () => loop.current.stop()
  }, [])

  return (
    <LoopContext.Provider value={loop.current}>
      <div style={{ ...defaultStyles, ...style }}>{children}</div>
    </LoopContext.Provider>
  )
}

export default Loop

Loop.propTypes = {
  style: PropTypes.object,
  children: PropTypes.any,
}
