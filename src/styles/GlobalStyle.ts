import { createGlobalStyle } from 'styled-components'

import RobotoRegular from '../fonts/Roboto-Regular.ttf'

export const GlobalStyle = createGlobalStyle`
  @font-face {
     font-family: 'Roboto';
     src: url(${RobotoRegular}) format('truetype');
     font-style: normal;
     font-display: auto;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    color: #E1E1E6;
    background-color: #191622;
    -webkit-font-smoothing: antialiased;
  }

  body, input, button{
    font-family:  'Roboto', sans-serif;
  }

  button{
    cursor: pointer;
  }
`
