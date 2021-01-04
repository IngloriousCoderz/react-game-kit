import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import ScaleContext from '../contexts/scale'

const wrapperStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
}

const layerStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
}

function TileMap({ rows, columns, layers, src, tileSize, renderTile, style }) {
  const scale = useContext(ScaleContext)

  const generateMap = () => {
    const mappedLayers = layers.map((layer, index) => {
      const mappedLayer = []
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const cell = layer[row * columns + col]
          if (cell !== 0) {
            mappedLayer.push(
              <div
                key={`tile-${index}-${row}-${col}`}
                style={getImageWrapperStyles(row, col)}
              >
                {renderTile(
                  getTileData(row, col, cell),
                  src,
                  getImageStyles(cell)
                )}
              </div>
            )
          }
        }
      }
      return mappedLayer
    })

    return mappedLayers
  }

  const getTileData = (row, column, index) => {
    const size = tileSize
    const left = column * size
    const top = row * size

    return {
      index,
      size,
      left,
      top,
    }
  }

  const getImageStyles = (imageIndex) => {
    const size = Math.round(scale * tileSize)
    const left = (imageIndex - 1) * size

    return {
      position: 'absolute',
      imageRendering: 'pixelated',
      display: 'block',
      height: '100%',
      transform: `translate(-${left}px, 0px)`,
    }
  }

  const getImageWrapperStyles = (row, column) => {
    const size = Math.round(scale * tileSize)
    const left = column * size
    const top = row * size

    return {
      height: size,
      width: size,
      overflow: 'hidden',
      position: 'absolute',
      transform: `translate(${left}px, ${top}px)`,
    }
  }

  const mappedLayers = generateMap()

  return (
    <div style={{ ...wrapperStyles, ...style }}>
      {mappedLayers.map((layer, index) => (
        <div key={`layer-${index}`} style={layerStyles}>
          {layer}
        </div>
      ))}
    </div>
  )
}

TileMap.propTypes = {
  columns: PropTypes.number,
  layers: PropTypes.array,
  renderTile: PropTypes.func,
  rows: PropTypes.number,
  scale: PropTypes.number,
  src: PropTypes.string,
  style: PropTypes.object,
  tileSize: PropTypes.number,
}

TileMap.defaultProps = {
  columns: 16,
  layers: [],
  // eslint-disable-next-line react/display-name
  renderTile: (tile, src, styles) => <img style={styles} src={src} />,
  rows: 9,
  src: '',
  tileSize: 64,
}

export default TileMap
