import { css } from 'styled-components'
import normalize from 'styled-normalize'
import * as theme from './theme'

export default css`
  @font-face {
    font-family: 'RobotoMono';
    src: url('fonts/RobotoMono-Regular.ttf') format('truetype');
    font-style: normal;
    font-weight: 400;
  }

  /* stylelint-disable-next-line max-empty-lines */
  ${normalize}

  html,
  body {
    background: ${theme.colors.background};
    font-family: ${theme.fonts.body};
    height: 100%;
    width: 100%;
  }
`
