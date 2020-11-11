import styled, { css } from 'styled-components'

import { darken, lighten } from 'polished'

interface IButtonProps {
  danger?: boolean;
}

export const StyledButton = styled.button<IButtonProps>`
    box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
    background-color: ${lighten(0.01, '#191622')};
    border: none;
    padding: 8px 24px;
    font-size: 22px;
    color: #E1E1E6;
    cursor: pointer;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    border-radius: 5px;

    &:hover{
      background-color: ${lighten(0.05, '#191622')};
    }

    ${props => props.danger && css`
      background-color: #cf0e00;

      &:hover{
        background-color: ${darken(0.08, '#cf0e00')};
      }
    `}
`
