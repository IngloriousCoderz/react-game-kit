import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Matter from 'matter-js'

import { AudioPlayer, Loop, Stage, KeyListener, World } from '../../src'

import Character from './character'
import Level from './level'
import Fade from './fade'

function Game({ onLeave }) {
  const [fade, setFade] = useState(true)

  const stopMusic = useRef()
  const keyListener = useRef(new KeyListener())
  window.AudioContext = window.AudioContext || window.webkitAudioContext
  window.context = window.context || new AudioContext()

  useEffect(() => {
    const player = new AudioPlayer('/assets/music.wav', () => {
      stopMusic.current = player.play({
        loop: true,
        offset: 1,
        volume: 0.35,
      })
    })

    setFade(false)

    keyListener.current.subscribe([
      KeyListener.LEFT,
      KeyListener.RIGHT,
      KeyListener.UP,
      KeyListener.SPACE,
      65,
    ])

    return () => {
      stopMusic.current()
      keyListener.current.unsubscribe()
    }
  }, [])

  const initPhysics = (engine) => {
    const ground = Matter.Bodies.rectangle(512 * 3, 448, 1024 * 3, 64, {
      isStatic: true,
    })

    const leftWall = Matter.Bodies.rectangle(-64, 288, 64, 576, {
      isStatic: true,
    })

    const rightWall = Matter.Bodies.rectangle(3008, 288, 64, 576, {
      isStatic: true,
    })

    Matter.World.addBody(engine.world, ground)
    Matter.World.addBody(engine.world, leftWall)
    Matter.World.addBody(engine.world, rightWall)
  }

  const handleEnterBuilding = (index) => {
    setFade(true)
    setTimeout(() => onLeave(index), 500)
  }

  return (
    <Loop>
      <Stage style={{ background: '#3a9bdc' }}>
        <World onInit={initPhysics}>
          <Level />
          <Character
            onEnterBuilding={handleEnterBuilding}
            keys={keyListener.current}
          />
        </World>
      </Stage>

      <Fade visible={fade} />
    </Loop>
  )
}

Game.propTypes = {
  onLeave: PropTypes.func,
}

export default Game
