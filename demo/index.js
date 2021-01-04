import React from 'react'
import ReactDOM from 'react-dom'

import StoreProvider from './game/store'
import Presentation from './presentation'

ReactDOM.render(
  <StoreProvider>
    <Presentation />
  </StoreProvider>,
  document.getElementById('root')
)
