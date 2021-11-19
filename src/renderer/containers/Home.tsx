import React, { createRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { Action, bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'
import Logo from '../components/Logo'
import { AppState } from '../store'
import { increment, reset } from '../store/counter'
import app from '../utils/app'
import { useChangeLocale, useLocale, useLtxt } from '../utils/i18n'

type StateProps = {
  count: number
}

type DispatchProps = {
  incrementCount: typeof increment
  resetCount: typeof reset
}

type Props = StateProps & DispatchProps

function Home({ count, incrementCount, resetCount }: Props) {
  const locale = useLocale()
  const ltxt = useLtxt()
  const changeLocale = useChangeLocale()

  const nodeRefs = {
    root: createRef<HTMLDivElement>(),
  }

  useEffect(() => {
    nodeRefs.root.current?.querySelectorAll('[href]').forEach(el => {
      el.addEventListener('click', event => {
        event.preventDefault()
        const url = (event.target as HTMLElement)?.getAttribute('href')
        if (url) app?.open?.(url)
      })
    })
  })

  function toggleLocale() {
    if (locale === 'en') {
      changeLocale('ja')
    }
    else {
      changeLocale('en')
    }
  }

  return (
    <StyledRoot ref={nodeRefs.root}>
      <StyledLogo/>
      <summary>
        <h1 dangerouslySetInnerHTML={{ __html: ltxt('hello', { count0: count, count1: count*2 }) }}/>
        <p dangerouslySetInnerHTML={{ __html: ltxt('description') }}/>
      </summary>
      <nav>
        <button onClick={toggleLocale}>{ltxt('switch-lang')}</button>
        <button onClick={() => incrementCount()}>{ltxt('increment')}</button>
        <button onClick={() => resetCount()}>{ltxt('reset')}</button>
      </nav>
    </StyledRoot>
  )
}

export default connect(
  (state: AppState): StateProps => ({
    count: state.counter.count,
  }),
  (dispatch: Dispatch<Action>): DispatchProps => bindActionCreators({
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
