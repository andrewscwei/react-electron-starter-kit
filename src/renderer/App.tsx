import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './containers/Home'
import { deinitIdler, initIdler } from './utils/idle'

export default function App() {
  const [isIdle, setIsIdle] = useState(false)

  useEffect(() => {
    initIdler({
      onEnter: () => setIsIdle(true),
      onExit: () => setIsIdle(false),
    })

    return () => {
      deinitIdler()
    }
  })

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </>
  )
}
