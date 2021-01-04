import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import ScaleContext from '../contexts/scale'

const wrapperStyles = {
  height: '100%',
  width: '100%',
  position: 'relative',
}

function Stage({ width, height, style, children }) {
  const container = useRef()

  const [dimensions, setDimensions] = useState([0, 0])

  useEffect(() => {
    addEventListener('resize', updateDimensions)
    updateDimensions()

    return () => {
      removeEventListener('resize', updateDimensions)
    }
  }, [])

  const updateDimensions = () => {
    setDimensions([
      container.current.offsetWidth,
      container.current.offsetHeight,
    ])
  }

  const getScale = () => {
    const [vwidth, vheight] = dimensions

    let targetWidth
    let targetHeight
    let targetScale

    if (height / width > vheight / vwidth) {
      targetHeight = vheight
      targetWidth = (targetHeight * width) / height
      targetScale = vheight / height
    } else {
      targetWidth = vwidth
      targetHeight = (targetWidth * height) / width
      targetScale = vwidth / width
    }

    if (!container.current) {
      return {
        height,
        width,
        scale: 1,
      }
    } else {
      return {
        height: targetHeight,
        width: targetWidth,
        scale: targetScale,
      }
    }
  }

  const getInnerStyles = () => {
    const scale = getScale()
    const xOffset = Math.floor((dimensions[0] - scale.width) / 2)
    const yOffset = Math.floor((dimensions[1] - scale.height) / 2)

    return {
      height: Math.floor(scale.height),
      width: Math.floor(scale.width),
      position: 'absolute',
      overflow: 'hidden',
      transform: `translate(${xOffset}px, ${yOffset}px)`,
    }
  }

  return (
    <ScaleContext.Provider value={getScale().scale}>
      <div style={wrapperStyles} ref={container}>
        <div style={{ ...getInnerStyles(), ...style }}>{children}</div>
      </div>
    </ScaleContext.Provider>
  )
}

Stage.propTypes = {
  children: PropTypes.any,
  height: PropTypes.number,
  style: PropTypes.object,
  width: PropTypes.number,
}

Stage.defaultProps = {
  width: 1024,
  height: 576,
}

export default Stage
