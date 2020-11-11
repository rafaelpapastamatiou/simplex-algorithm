import React, { SelectHTMLAttributes } from 'react'

import { StyledSelect } from './styles'

type ISelectInterface = SelectHTMLAttributes<HTMLSelectElement>

const Input: React.FC<ISelectInterface> = ({ value, className, name, id, ...props }: ISelectInterface) => {
  return <StyledSelect value={value} className={className} name={name} id={id} {...props} />
}

export default Input
