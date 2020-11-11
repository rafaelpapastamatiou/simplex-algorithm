import styled from 'styled-components'

import { lighten } from 'polished'

export const StyledSelect = styled.select`
    padding: 5px 10px;
    max-width: 90px;
    border: none;
    outline: none;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
    background-color: ${lighten(0.01, '#191622')};
    color: #fff;
    text-align: center;
    font-size: 22px;
    border-radius: 5px;
`
