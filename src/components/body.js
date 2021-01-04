import { useContext, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import Matter from 'matter-js'

import EngineContext from '../contexts/engine'
import { usePrevious } from '../hooks/usePrevious'

const Body = function Body({ args, children, shape, onUpdate, ...options }) {
  const engine = useContext(EngineContext)

  const body = useRef(Matter.Bodies[shape](...args, options))
  const update = () => onUpdate(body.current)

  useEffect(() => {
    Matter.World.addBody(engine.world, body.current)
    Matter.Events.on(engine, 'afterUpdate', update)

    return () => {
      Matter.Events.off(engine, 'afterUpdate', update)
      Matter.World.remove(engine.world, body.current)
    }
  }, [])

  const prevOptions = usePrevious(options)
  useEffect(() => {
    Object.keys(options).forEach((key) => {
      if (key in body.current && prevOptions[key] !== options[key]) {
        Matter.Body.set(body.current, key, options[key])
      }
    })
  }, [options])

  return children
}

Body.propTypes = {
  angle: PropTypes.number,
  area: PropTypes.string,
  args: PropTypes.array,
  axes: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  bounds: PropTypes.shape({
    min: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    max: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  }),
  children: PropTypes.any,
  collisionFilter: PropTypes.shape({
    category: PropTypes.number,
    group: PropTypes.number,
    mask: PropTypes.number,
  }),
  density: PropTypes.number,
  force: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  friction: PropTypes.number,
  frictionAir: PropTypes.number,
  frictionStatic: PropTypes.number,
  id: PropTypes.number,
  inertia: PropTypes.number,
  inverseInertia: PropTypes.number,
  inverseMass: PropTypes.number,
  isSensor: PropTypes.bool,
  isSleeping: PropTypes.bool,
  isStatic: PropTypes.bool,
  label: PropTypes.string,
  mass: PropTypes.number,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  restitution: PropTypes.number,
  shape: PropTypes.string,
  sleepThreshold: PropTypes.number,
  slop: PropTypes.number,
  slope: PropTypes.number,
  timeScale: PropTypes.number,
  torque: PropTypes.number,
  vertices: PropTypes.array,
  onUpdate: PropTypes.func,
}

Body.defaultProps = {
  args: [0, 0, 100, 100],
  restitution: 0,
  friction: 1,
  frictionStatic: 0,
  shape: 'rectangle',
  onUpdate: () => {},
}

export default Body
