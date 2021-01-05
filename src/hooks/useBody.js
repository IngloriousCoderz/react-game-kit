import { useContext, useEffect, useRef } from 'react'

import Matter from 'matter-js'

import EngineContext from '../contexts/engine'
import { usePrevious } from './usePrevious'

function useBody({
  args = [0, 0, 100, 100],
  shape = 'rectangle',
  onUpdate = () => {},
  ...options
}) {
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

  return body.current
}

export default useBody
