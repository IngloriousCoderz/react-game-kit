import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { AudioPlayer } from '../src'

const ENTER_KEY = 13

function Intro({ onStart }) {
  const startNoise = useRef()
  const animationFrame = useRef()

  const [blink, setBlink] = useState(false)

  useEffect(() => {
    startNoise.current = new AudioPlayer('/assets/start.wav')

    addEventListener('keypress', handleKeyPress)
    animationFrame.current = requestAnimationFrame(startUpdate)
    const interval = setInterval(toggleBlink, 500)

    return () => {
      removeEventListener('keypress', handleKeyPress)
      cancelAnimationFrame(animationFrame.current)
      clearInterval(interval)
    }
  }, [])

  const handleKeyPress = ({ keyCode }) => {
    if (keyCode === ENTER_KEY) {
      startNoise.current.play()
      onStart()
    }
  }

  const startUpdate = () => {
    animationFrame.current = requestAnimationFrame(startUpdate)
  }

  const toggleBlink = () => setBlink((blink) => !blink)

  return (
    <div>
      <img className="intro" src="assets/intro.png" />
      <p className="start" style={{ display: blink ? 'block' : 'none' }}>
        Press Start
      </p>
    </div>
  )
}

Intro.propTypes = {
  onStart: PropTypes.func,
}

export default Intro
