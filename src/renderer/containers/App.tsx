import React, { Fragment, PureComponent } from 'react'
import { RouteComponentProps } from 'react-router'
import { Route, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled, { createGlobalStyle } from 'styled-components'
import routesConf from '../routes.conf'
import globalStyles from '../styles/global'
import { deinitIdler, initIdler } from '../utils/idle'

type Props = {
  route: RouteComponentProps
}

type State = {
  isIdle: boolean
}

class App extends PureComponent<Props, State> {

  state: State = {
    isIdle: false,
  }

  componentDidMount() {
    initIdler({
      onEnter: () => this.setState({ isIdle: true }),
      onExit: () => this.setState({ isIdle: false }),
    })
  }

  componentWillUnmount() {
    deinitIdler()
  }

  render() {
    const { route } = this.props

    return (
      <Fragment>
        <GlobalStyles/>
        <StyledBody>
          <CSSTransition key={route.location.key} timeout={300} classNames='route-transition'>
            <Switch location={route.location}>{this.generateRoutes()}</Switch>
          </CSSTransition>
        </StyledBody>
      </Fragment>
    )
  }

  private generateRoutes() {
    return routesConf.map((route, index) => (
      <Route exact={route.exact} path={route.path} key={`route-${index}`} component={route.component}/>
    ))
  }
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
