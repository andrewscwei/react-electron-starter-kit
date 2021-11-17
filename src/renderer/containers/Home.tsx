import React, { createRef, PureComponent } from 'react'
import { connect } from 'react-redux'
import { Action, bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'
import Logo from '../components/Logo'
import { AppState } from '../store'
import { increment, reset } from '../store/counter'
import { changeLocale, I18nState } from '../store/i18n'
import app from '../utils/app'

type StateProps = {
  count: number
  locale: I18nState['locale']
  ltxt: I18nState['ltxt']
}

type DispatchProps = {
  changeLocale: typeof changeLocale
  incrementCount: typeof increment
  resetCount: typeof reset
}

type Props = StateProps & DispatchProps

class Home extends PureComponent<Props> {

  private nodeRefs = {
    root: createRef<HTMLDivElement>(),
  }

  componentDidMount() {
    this.nodeRefs.root.current?.querySelectorAll('[href]').forEach(el => {
      el.addEventListener('click', event => {
        event.preventDefault()
        const url = (event.target as HTMLElement)?.getAttribute('href')
        if (url) app?.open?.(url)
      })
    })
  }

  toggleLocale = () => {
    if (this.props.locale === 'en') {
      this.props.changeLocale('ja')
    }
    else {
      this.props.changeLocale('en')
    }
  }

  render() {
    const { count, ltxt, incrementCount, resetCount } = this.props

    return (
      <StyledRoot ref={this.nodeRefs.root}>
        <StyledLogo/>
        <summary>
          <h1 dangerouslySetInnerHTML={{ __html: ltxt('hello', { count0: count, count1: count*2 }) }}/>
          <p dangerouslySetInnerHTML={{ __html: ltxt('description') }}/>
        </summary>
        <nav>
          <button onClick={this.toggleLocale}>{ltxt('switch-lang')}</button>
          <button onClick={() => incrementCount()}>{ltxt('increment')}</button>
          <button onClick={() => resetCount()}>{ltxt('reset')}</button>
        </nav>
      </StyledRoot>
    )
  }
}

export default connect(
  (state: AppState): StateProps => ({
    count: state.counter.count,
    ...state.i18n,
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
    changeLocale,
    incrementCount: increment,
    resetCount: reset,
  }, dispatch),
)(Home)

const StyledLogo = styled(Logo)`
  height: 140px;
  margin-bottom: 50px;
`

const StyledRoot = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  width: 100%;

  nav {
    align-items: center;
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    justify-content: center;
    margin-top: 30px;

    > * {
      :not(:last-child) {
        margin-right: 10px;
      }
    }

    a, button {
      align-items: center;
      background: ${props => props.theme.colors.grey};
      border: none;
      color: ${props => props.theme.colors.white};
      cursor: pointer;
      display: flex;
      font-family: ${props => props.theme.fonts.body};
      font-size: 1em;
      height: 50px;
      justify-content: center;
      letter-spacing: 2px;
      outline: none;
      transition: opacity .2s ease-out;
      width: 150px;

      :hover {
        opacity: .6;
      }
    }
  }

  h1 {
    color: ${props => props.theme.colors.white};
    font-family: ${props => props.theme.fonts.body};
    font-size: 4em;
    font-weight: 600;
    margin: 0 0 20px;
    text-align: center;

    em {
      opacity: .2;
    }
  }

  p {
    color: ${props => props.theme.colors.white};
    font-family: ${props => props.theme.fonts.body};
    font-size: 1em;
    text-align: center;

    a {
      color: ${props => props.theme.colors.white};
      font-weight: 600;
      transition: opacity .2s ease-out;

      &:hover {
        opacity: .6;
      }
    }
  }
`
