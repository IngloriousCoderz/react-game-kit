import React, { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import LoopContext from '../contexts/loop'

function Sprite(props) {
  const {
    offset,
    onPlayStateChanged,
    scale,
    src,
    state,
    style,
    tileHeight,
    tileWidth,
  } = props
  const loop = useContext(LoopContext)

  const loopID = useRef()
  const tickCount = useRef(0)
  const finished = useRef(false)

  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    loopID.current = loop.subscribe(animate)

    return () => loop.unsubscribe(loopID.current)
  }, [])

  useEffect(() => {
    loop.unsubscribe(loopID.current)
    tickCount.current = 0
    finished.current = false
    setCurrentStep(0)

    loopID.current = loop.subscribe(animate)
    onPlayStateChanged(true)
  }, [state])

  const animate = () => {
    const { repeat, ticksPerFrame, state, steps } = props
    if (tickCount.current === ticksPerFrame && !finished.current) {
      if (steps[state] !== 0) {
        const lastStep = steps[state]
        const nextStep = currentStep === lastStep ? 0 : currentStep + 1

        setCurrentStep(nextStep)

        if (currentStep === lastStep && repeat === false) {
          finished.current = true
          onPlayStateChanged(false)
        }
      }

      tickCount.current = 0
    } else {
      tickCount.current++
    }
  }

  const getWrapperStyles = () => ({
    height: tileHeight,
    width: tileWidth,
    overflow: 'hidden',
    position: 'relative',
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    imageRendering: 'pixelated',
  })

  const getImageStyles = () => {
    const left = offset[0] + currentStep * tileWidth
    const top = offset[1] + state * tileHeight

    return {
      position: 'absolute',
      transform: `translate(-${left}px, -${top}px)`,
    }
  }

  return (
    <div style={{ ...getWrapperStyles(), ...style }}>
      <img style={getImageStyles()} src={src} />
    </div>
  )
}

Sprite.propTypes = {
  offset: PropTypes.array,
  onPlayStateChanged: PropTypes.func,
  repeat: PropTypes.bool,
  scale: PropTypes.number,
  src: PropTypes.string,
  state: PropTypes.number,
  steps: PropTypes.array,
  style: PropTypes.object,
  ticksPerFrame: PropTypes.number,
  tileHeight: PropTypes.number,
  tileWidth: PropTypes.number,
}

Sprite.defaultProps = {
  offset: [0, 0],
  onPlayStateChanged: () => {},
  repeat: true,
  src: '',
  state: 0,
  steps: [],
  ticksPerFrame: 4,
  tileHeight: 64,
  tileWidth: 64,
}

export default Sprite
