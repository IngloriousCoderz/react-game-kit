import React from 'react'
import PropTypes from 'prop-types'

function Fade({ visible }) {
  return <div className={`fade ${visible && 'active'}`} />
}

Fade.propTypes = {
  visible: PropTypes.bool,
}

Fade.defaultProps = {
  visible: true,
}

export default Fade
