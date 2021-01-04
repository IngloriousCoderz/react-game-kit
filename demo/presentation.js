import { hot } from 'react-hot-loader/root'
import React, { useState } from 'react'

import Intro from './intro'
import Game from './game'
import Slides from './slides'

function Presentation() {
  const [gameState, setGameState] = useState(0)
  const [slideIndex, setSlideIndex] = useState(0)

  const handleStart = () => setGameState(1)

  const handleDone = () => setGameState(1)

  const handleLeave = (index) => {
    setGameState(2)
    setSlideIndex(index)
  }

  const gameStates = [
    <Intro onStart={handleStart} />,
    <Game onLeave={handleLeave} />,
    <Slides onDone={handleDone} index={slideIndex} />,
  ]

  return gameStates[gameState]
}

export default hot(Presentation)
