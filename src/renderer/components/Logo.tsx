import $$ElectronLogo from '../assets/images/electron-logo.svg'
import $$ReactLogo from '!!raw-loader!../assets/images/react-logo.svg'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

export type Props = {
  className?: string
}

export default class Logo extends PureComponent<Props> {

  render() {
    const { className } = this.props

    return (
      <StyledRoot className={className}>
        <StyledElectronLogo src={$$ElectronLogo}/>
        <StyledReactLogo dangerouslySetInnerHTML={{ __html: $$ReactLogo }}/>
      </StyledRoot>
    )
  }
}

const StyledElectronLogo = styled.img`
  animation: rotate-cw 5s linear infinite;
  transform-origin: center;

  @keyframes rotate-cw {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

const StyledReactLogo = styled.figure`
  animation: rotate-ccw 8s linear infinite;
  transform-origin: center;

  @keyframes rotate-ccw {
    from { transform: rotate(0deg); }
    to { transform: rotate(-360deg); }
  }
`

const StyledRoot = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;

  & > * {
    height: 100%;
    margin: 0;
    padding: 0;

    &:not(:last-child) {
      margin-right: 20px;
    }

    & > svg {
      height: 100%;
      width: auto;
    }
  }
`
