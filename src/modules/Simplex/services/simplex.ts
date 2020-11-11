import _ from 'lodash'

interface ISimplexProps {
  variables: string[];
  matrix: number[][]
}

interface ISimplexResponseProps {
  variables: string[];
  matrix: number[][];
  pivot?: {
    x: number;
    y: number;
  }
  entering?: number;
  exiting?: number;
}

const findPivot = (matrix: number[][], pivotColumn: number) => {
  const lastColumnIndex = matrix[0].length - 1

  // LIT = LOWEST INDEPENDENT TERM (MENOR TERMO INDEPENDENTE)
  let litRowIndex = 1

  // SET LOWEST I.T. AS THE FIRST ROW I.T.
  let lit = matrix[litRowIndex][lastColumnIndex] / matrix[litRowIndex][pivotColumn]

  // FIND THE LOWEST I.T.
  for (let i = 1; i < matrix.length; i++) {
    const independentTerm = matrix[i][lastColumnIndex]
    const independentTermDivided = independentTerm / matrix[i][pivotColumn]
    if (independentTermDivided > 0 && lit > independentTermDivided) {
      lit = independentTermDivided
      litRowIndex = i
    }
  }

  // FIND THE PIVOT
  const pivot = matrix[litRowIndex][pivotColumn]

  return { pivot, pivotX: litRowIndex, pivotY: pivotColumn }
}

const simplex = ({ variables, matrix }: ISimplexProps): ISimplexResponseProps[] => {
  const matrixes: ISimplexResponseProps[] = []

  let counter = 0

  while (matrix[0].find(value => value < 0) && counter < 25) {
    let minValueOnZIndex = 0

    // LOOP TO FIND LOWEST NEGATIVE ELEMENT INDEX ON Z ROW
    for (let i = 0, j = 1; j < matrix[i].length; j++) {
      const newValue = matrix[i][j]
      const oldValue = matrix[i][minValueOnZIndex]
      if (newValue !== undefined && newValue < 0 && oldValue > newValue) {
        minValueOnZIndex = j
      }
    }

    matrixes.push({ variables: _.cloneDeep([...variables]), matrix: _.cloneDeep([...matrix]), entering: minValueOnZIndex })

    const { pivot, pivotX, pivotY } = findPivot(matrix, minValueOnZIndex)

    // PUSH THE CURRENT MATRIX STATE TO HISTORY
    matrixes.push(
      {
        variables: _.cloneDeep([...variables]),
        matrix: _.cloneDeep([...matrix]),
        pivot: { x: pivotX, y: pivotY },
        entering: pivotY,
        exiting: pivotX
      }
    )

    // DIVIDE ALL ELEMENTS OF THE PIVOT ROW BY THE PIVOT
    for (let j = 0; j < matrix[0].length; j++) {
      matrix[pivotX][j] = parseFloat((matrix[pivotX][j] / pivot).toFixed(2))
    }

    // LOOP THROUGH ALL REMAINING ROWS
    for (let i = 0; i < matrix.length; i++) {
      // SET A MULTIPLIER AS THE ELEMENT OF CURRENT ROW IN THE PIVOT COLUMN
      const mult = matrix[i][pivotY]

      // DON'T RUN IF IN PIVOT ROW
      if (i === pivotX) {
        continue
      }

      // LOOP THROUGH ALL COLUMNS OF ROW
      for (let j = 0; j < matrix[0].length; j++) {
        // SUBTRACT FROM THE CURRENT ELEMENT THE VALUE OF MULTIPLIER * THE PIVOT ROW ELEMENT OF SAME COLUMN
        matrix[i][j] = parseFloat((matrix[i][j] - (mult * matrix[pivotX][j])).toFixed(2))
      }
    }

    // PUSH THE CURRENT MATRIX STATE TO HISTORY
    matrixes.push(
      {
        variables: _.cloneDeep([...variables]),
        matrix: _.cloneDeep([...matrix])
      }
    )

    // ADD 1 TO COUNTER
    counter += 1
  }

  return [
    ...matrixes
  ]
}

export default simplex
