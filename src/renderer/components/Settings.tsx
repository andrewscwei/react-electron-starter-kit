import React, { PureComponent } from 'react'
import styled from 'styled-components'

type Props = {
  className?: string
}

class Settings extends PureComponent<Props> {

  render() {
    const { className } = this.props

    return (
      <StyledRoot className={className}>

      </StyledRoot>
    )
  }
}

export default Settings

const StyledRoot = styled.div`

`
