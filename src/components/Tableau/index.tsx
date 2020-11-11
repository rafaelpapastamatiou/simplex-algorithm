import React from 'react'

import { Table } from './styles'

interface ITableauProps {
  matrix: number[][];
  variables: string[];
  pivot?: {
    x: number;
    y: number;
  }
  entering?: number;
  exiting?: number;
}

const Tableau: React.FC<ITableauProps> = ({ matrix, variables, pivot, entering, exiting }: ITableauProps) => {
  return (
    <Table cellSpacing={0}>
      <thead>
        <tr>
          {variables.map(v => <th key={v} >{v}</th>)}
        </tr>
      </thead>
      <tbody>
        {matrix.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className={
              rowIndex === 0
                ? 'z-row'
                : exiting !== undefined && exiting === rowIndex
                  ? 'exiting'
                  : ''
            }>
            {row.map(
              (column, columnIndex) =>
                <td
                  key={columnIndex}
                  className={
                    pivot && pivot.x === rowIndex && pivot.y === columnIndex
                      ? 'pivot'
                      : entering !== undefined && entering === columnIndex
                        ? 'entering'
                        : ''
                  }
                >
                  {column}
                </td>
            )
            }
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default Tableau
