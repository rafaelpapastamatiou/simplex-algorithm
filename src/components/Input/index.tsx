import React, { InputHTMLAttributes } from 'react'

import { StyledInput } from './styles'

interface IInputInterface extends InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  value?: number;
  className?: string;
  name?: string;
  id?: string;
}

const Input: React.FC<IInputInterface> = ({ type = 'string', value, className, name, id, onChange, ...props }: IInputInterface) => {
  return (
    <StyledInput
      type={type}
      value={value}
      className={className}
      name={name}
      id={id}
      onChange={onChange}
      {...props}
    />
  )
}

export default Input
