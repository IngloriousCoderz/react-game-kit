import React, { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import LoopContext from '../contexts/loop'

function Sprite(props) {
  const {
    offset,
    onPlayStateChanged,
    repeat,
    scale,
    src,
    state,
    steps,
    style,
    ticksPerFrame,
    tileHeight,
    tileWidth,
  } = props
  const loop = useContext(LoopContext)

  const loopID = useRef()
  const tick = useRef(0)
  const finished = useRef(false)

  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    reset()
    onPlayStateChanged(true)
    loopID.current = loop.subscribe(animate)

    return () => loop.unsubscribe(loopID.current)
  }, [state])

  useEffect(() => {
    if (currentStep >= steps[state] - 1) {
      reset()
      if (!repeat) {
        finished.current = true
        onPlayStateChanged(false)
      }
    }
  }, [currentStep])

  const reset = () => {
    tick.current = 0
    finished.current = false
    setCurrentStep(0)
  }

  const animate = () => {
    if (!finished.current) {
      tick.current++
    }
    if (tick.current >= ticksPerFrame) {
      tick.current = 0
      setCurrentStep((step) => step + 1)
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
  scale: PropTypes.number,
  repeat: PropTypes.bool,
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
