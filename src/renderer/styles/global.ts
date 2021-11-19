import { css } from 'styled-components'
import normalize from 'styled-normalize'
import * as theme from './theme'

export default css`
  /* stylelint-disable-next-line max-empty-lines */
  ${normalize}

  @font-face {
    font-family: 'RobotoMono';
    src: url('fonts/RobotoMono-Regular.ttf') format('truetype');
    font-style: normal;
    font-weight: 400;
  }

  html,
  body {
    background: ${theme.colors.background};
    font-family: ${theme.fonts.body};
    height: 100%;
    width: 100%;
  }

  #app {
    width: 100%;
    height: 100%;
  }
`
