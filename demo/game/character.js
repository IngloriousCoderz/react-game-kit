import React, { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Matter from 'matter-js'

import { AudioPlayer, Body, KeyListener, Sprite } from '../../src'
import useBody from '../../src/hooks/useBody'
import ScaleContext from '../../src/contexts/scale'
import LoopContext from '../../src/contexts/loop'
import StoreContext from './store/contexts/store'
import { CHARACTER_HEIGHT, CHARACTER_WIDTH } from './store/constants/sizes'
import { getCharacterPosition, getStageX } from './store/reducers'
import { moveStageX, setCharacterPosition } from './store/actions'

export const State = {
  RIGHT: 0,
  LEFT: 1,
  IDLE: 2,
  LEAVING: 3,
  PUNCHING: 4,
}

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
  const isAnimationPlaying = useRef(true)
  const lastX = useRef(characterPosition.x)
  const lastStageX = useRef(stageX)
  useEffect(() => {
    lastStageX.current = stageX
  }, [stageX])

  const [characterState, setCharacterState] = useState({
    state: State.IDLE,
    repeat: false,
  })

  const handleBodyUpdate = (body) => {
    const midPoint = Math.abs(lastStageX.current) + 448

    const shouldMoveStageLeft =
      body.position.x < midPoint && lastStageX.current < 0
    const shouldMoveStageRight =
      body.position.x > midPoint && lastStageX.current > -2048

    const velY = parseFloat(body.velocity.y.toFixed(10))

    if (velY === 0) {
      Matter.Body.set(body, 'friction', 0.9999)
      isJumping.current = false
    }

    if (!isLeaving.current && !isPunching.current && !isJumping.current) {
      checkKeys(body)
    }

    if (isPunching.current && !isAnimationPlaying.current) {
      isPunching.current = false
    }

    dispatch(setCharacterPosition(body.position))

    if (shouldMoveStageLeft || shouldMoveStageRight) {
      dispatch(moveStageX(lastX.current - body.position.x))
    }

    lastX.current = body.position.x
  }

  const body = useBody({
    args: [characterPosition.x, 384, CHARACTER_WIDTH, CHARACTER_HEIGHT],
    inertia: Infinity,
    onUpdate: handleBodyUpdate,
  })

  useEffect(() => {
    jumpNoise.current = new AudioPlayer('/assets/jump.wav')
  }, [])

  const handlePlayStateChanged = (playing) => {
    isAnimationPlaying.current = playing
  }

  const enterBuilding = (body) => {
    const doorIndex = getDoorIndex(body.position.x)

    if (doorIndex != null) {
      isLeaving.current = true
      setCharacterState({
        state: State.LEAVING,
        repeat: false,
      })
      onEnterBuilding(doorIndex)
    }
  }

  const punch = () => {
    isPunching.current = true
    setCharacterState({
      state: State.PUNCHING,
      repeat: false,
    })
  }

  const jump = (body) => {
    isJumping.current = true
    jumpNoise.current.play()
    Matter.Body.applyForce(body, { x: 0, y: 0 }, { x: 0, y: -0.15 })
    Matter.Body.set(body, 'friction', 0.0001)
  }

  const move = (body, x) => Matter.Body.setVelocity(body, { x, y: 0 })

  const checkKeys = (body) => {
    let state = State.IDLE

    if (keys.isDown(KeyListener.UP)) {
      return enterBuilding(body)
    }

    if (keys.isDown(65)) {
      return punch()
    }

    if (keys.isDown(KeyListener.SPACE)) {
      jump(body)
    }

    if (keys.isDown(KeyListener.LEFT)) {
      state = State.LEFT
      move(body, -5)
    } else if (keys.isDown(KeyListener.RIGHT)) {
      state = State.RIGHT
      move(body, 5)
    }

    setCharacterState({
      state,
      repeat: state < 2,
    })
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
      <Sprite
        onPlayStateChanged={handlePlayStateChanged}
        repeat={characterState.repeat}
        src="assets/character-sprite.png"
        scale={scale * 2}
        state={characterState.state}
        steps={[10, 10, 1, 5, 6]}
      />
    </div>
  )
}

Character.propTypes = {
  keys: PropTypes.object,
  onEnterBuilding: PropTypes.func,
}

export default Character

function getDoorIndex(x) {
  let doorIndex = null

  const doorPositions = [...Array(6).keys()].map((a) => [
    512 * a + 208,
    512 * a + 272,
  ])

  doorPositions.forEach((dp, di) => {
    if (x + 64 > dp[0] && x + 64 < dp[1]) {
      doorIndex = di
    }
  })

  return doorIndex
}
