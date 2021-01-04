import React, { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Matter from 'matter-js'

import { AudioPlayer, Body, KeyListener, Sprite } from '../../src'
import ScaleContext from '../../src/contexts/scale'
import LoopContext from '../../src/contexts/loop'
import StoreContext from './store/contexts/store'
import { getCharacterPosition, getStageX } from './store/reducers'
import { moveStageX, setCharacterPosition } from './store/actions'

function Character({ keys, onEnterBuilding }) {
  const loop = useContext(LoopContext)
  const scale = useContext(ScaleContext)
  const { state, dispatch } = useContext(StoreContext)

  const characterPosition = getCharacterPosition(state)
  const stageX = getStageX(state)

  const jumpNoise = useRef()
  const isJumping = useRef(false)
  const isPunching = useRef(false)
  const isLeaving = useRef(false)
  const lastX = useRef(0)

  const [characterState, setCharacterState] = useState(2)
  const [repeat, setRepeat] = useState(false)
  const [spritePlaying, setSpritePlaying] = useState(true)

  useEffect(() => {
    jumpNoise.current = new AudioPlayer('/assets/jump.wav')
  }, [])

  const handlePlayStateChanged = (playing) => setSpritePlaying(playing)

  const move = (body, x) => Matter.Body.setVelocity(body, { x, y: 0 })

  const jump = (body) => {
    jumpNoise.current.play()
    isJumping.current = true
    Matter.Body.applyForce(body, { x: 0, y: 0 }, { x: 0, y: -0.15 })
    Matter.Body.set(body, 'friction', 0.0001)
  }

  const punch = () => {
    isPunching.current = true
    setCharacterState(4)
    setRepeat(false)
  }

  const getDoorIndex = (body) => {
    let doorIndex = null

    const doorPositions = [...Array(6).keys()].map((a) => {
      return [512 * a + 208, 512 * a + 272]
    })

    doorPositions.forEach((dp, di) => {
      if (body.position.x + 64 > dp[0] && body.position.x + 64 < dp[1]) {
        doorIndex = di
      }
    })

    return doorIndex
  }

  const enterBuilding = (body) => {
    const doorIndex = getDoorIndex(body)

    if (doorIndex != null) {
      setCharacterState(3)
      isLeaving.current = true
      onEnterBuilding(doorIndex)
    }
  }

  const checkKeys = (body, shouldMoveStageLeft, shouldMoveStageRight) => {
    let state = 2

    if (keys.isDown(65)) {
      return punch()
    }

    if (keys.isDown(KeyListener.SPACE)) {
      jump(body)
    }

    if (keys.isDown(KeyListener.UP)) {
      return enterBuilding(body)
    }

    if (keys.isDown(KeyListener.LEFT)) {
      if (shouldMoveStageLeft) {
        dispatch(moveStageX(5))
      }

      move(body, -5)
      state = 1
    } else if (keys.isDown(KeyListener.RIGHT)) {
      if (shouldMoveStageRight) {
        dispatch(moveStageX(-5))
      }

      move(body, 5)
      state = 0
    }

    setCharacterState(state)
    setRepeat(state < 2)
  }

  const handleUpdate = (body) => {
    const midPoint = Math.abs(stageX) + 448

    const shouldMoveStageLeft = body.position.x < midPoint && stageX < 0
    const shouldMoveStageRight = body.position.x > midPoint && stageX > -2048

    const velY = parseFloat(body.velocity.y.toFixed(10))

    if (velY === 0) {
      isJumping.current = false
      Matter.Body.set(body, 'friction', 0.9999)
    }

    if (!isJumping.current && !isPunching.current && !isLeaving.current) {
      checkKeys(body, shouldMoveStageLeft, shouldMoveStageRight)

      dispatch(setCharacterPosition(body.position))
    } else {
      if (isPunching.current && !spritePlaying) {
        isPunching.current = false
      }
      if (isJumping.current) {
        dispatch(setCharacterPosition(body.position))
      }
      if (shouldMoveStageLeft || shouldMoveStageRight) {
        dispatch(moveStageX(lastX.current - body.position.x))
      }
    }

    lastX.current = body.position.x
  }

  const getWrapperStyles = () => {
    const { x, y } = characterPosition
    const targetX = x + stageX

    return {
      position: 'absolute',
      transform: `translate(${targetX * scale}px, ${y * scale}px)`,
      transformOrigin: 'left top',
    }
  }

  return (
    <div style={getWrapperStyles()}>
      <Body
        args={[characterPosition.x, 384, 64, 64]}
        inertia={Infinity}
        onUpdate={handleUpdate}
      >
        <Sprite
          repeat={repeat}
          onPlayStateChanged={handlePlayStateChanged}
          src="assets/character-sprite.png"
          scale={scale * 2}
          state={characterState}
          steps={[9, 9, 0, 4, 5]}
        />
      </Body>
    </div>
  )
}

Character.propTypes = {
  keys: PropTypes.object,
  onEnterBuilding: PropTypes.func,
}

export default Character
