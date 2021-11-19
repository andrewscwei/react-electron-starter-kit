import React from 'react'
import styled from 'styled-components'

type Props = {
  className?: string
}

export default function Settings({ className }: Props) {
  return (
    <StyledRoot className={className}>

    </StyledRoot>
  )
}

const StyledRoot = styled.div`

`
