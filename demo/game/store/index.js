import React, { useReducer } from 'react'
import LogicContext from './contexts/store'

import rootReducer from './reducers'

function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(
    rootReducer,
    rootReducer(undefined, { type: '@@INIT' })
  )

  const store = { state, dispatch }

  return <LogicContext.Provider value={store}>{children}</LogicContext.Provider>
}

export default StoreProvider
