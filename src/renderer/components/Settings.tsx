import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'

type Props = HTMLAttributes<HTMLElement>

export default function Settings({ ...props }: Props) {
  return (
    <StyledRoot {...props}>

    </StyledRoot>
  )
}

const StyledRoot = styled.div`

`
