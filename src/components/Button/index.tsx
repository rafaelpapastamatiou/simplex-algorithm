import React, { ReactNode, ButtonHTMLAttributes } from 'react'

import { StyledButton } from './styles'

interface IButtonInterface extends ButtonHTMLAttributes<HTMLButtonElement>{
  children: ReactNode;
  danger?: boolean;
}

const Button: React.FC<IButtonInterface> = ({ children, danger = false, ...props }: IButtonInterface) => {
  return <StyledButton danger={danger} type="button" {...props}>{children}</StyledButton>
}

export default Button
