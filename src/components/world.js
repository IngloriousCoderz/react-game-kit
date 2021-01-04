import React, { useContext, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import Matter from 'matter-js'
import LoopContext from '../contexts/loop'
import EngineContext from '../contexts/engine'

const defaultStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
}

function World({ gravity, onInit, onUpdate, onCollision, children }) {
  const loop = useContext(LoopContext)

  const world = useRef(Matter.World.create({ gravity }))
  const engine = useRef(Matter.Engine.create({ world: world.current }))
  const lastTime = useRef()
  const loopID = useRef()

  useEffect(() => {
    loopID.current = loop.subscribe(performLoop)
    onInit(engine.current)
    Matter.Events.on(engine.current, 'afterUpdate', onUpdate)
    Matter.Events.on(engine.current, 'collisionStart', onCollision)

    return () => {
      loop.unsubscribe(loopID.current)
      Matter.Events.off(engine.current, 'afterUpdate', onUpdate)
      Matter.Events.off(engine.current, 'collisionStart', onCollision)
    }
  }, [])

  useEffect(() => {
    engine.current.world.gravity = gravity
  }, [gravity])

  const performLoop = () => {
    const currTime = 0.001 * Date.now()
    Matter.Engine.update(
      engine.current,
      1000 / 60,
      lastTime.current ? currTime / lastTime.current : 1
    )
    lastTime.current = currTime
  }

  return (
    <EngineContext.Provider value={engine.current}>
      <div style={defaultStyles}>{children}</div>
    </EngineContext.Provider>
  )
}

World.propTypes = {
  children: PropTypes.any,
  gravity: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    scale: PropTypes.number,
  }),
  onCollision: PropTypes.func,
  onInit: PropTypes.func,
  onUpdate: PropTypes.func,
}

World.defaultProps = {
  gravity: {
    x: 0,
    y: 1,
    scale: 0.001,
  },
  onCollision: () => {},
  onInit: () => {},
  onUpdate: () => {},
}

export default World
