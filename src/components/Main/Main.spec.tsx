import React from 'react'
import { render } from '@testing-library/react'

import Main from './index'

test('Main should renders', () => {
  const { getByText, getByAltText } = render(<Main />)

  expect(
    getByText('An Electron boilerplate including TypeScript, React, Jest and ESLint.')
  ).toBeTruthy()
  expect(getByAltText('ReactJS logo')).toBeTruthy()
})
