import React, { Fragment, FunctionComponent, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled, { createGlobalStyle } from 'styled-components'
import routesConf from '../routes.conf'
import globalStyles from '../styles/global'
import { deinitIdler, initIdler } from '../utils/idle'

const App: FunctionComponent = () => {
  const [isIdle, setIsIdle] = useState(false)
  const location = useLocation()

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
    <Fragment>
      <GlobalStyles/>
      <StyledBody>
        <CSSTransition key={location.key} timeout={300} classNames='route-transition'>
          <Routes>
            {routesConf.map((route, index) => (
              <Route path={route.path} key={`route-${index}`} element={<route.component/>}/>
            ))}
          </Routes>
        </CSSTransition>
      </StyledBody>
    </Fragment>
  )
}

export default App

const GlobalStyles = createGlobalStyle`
  ${globalStyles}
`

const StyledBody = styled(TransitionGroup)`
  height: 100%;
  position: absolute;
  width: 100%;

  .route-transition-enter {
    opacity: 0;
  }

  .route-transition-enter.route-transition-enter-active {
    opacity: 1;
    transition: all .3s;
  }

  .route-transition-exit {
    opacity: 1;
  }

  .route-transition-exit.route-transition-exit-active {
    opacity: 0;
    transition: all .3s;
  }
`
