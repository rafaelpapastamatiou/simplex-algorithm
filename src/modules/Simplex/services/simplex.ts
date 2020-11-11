import _ from 'lodash'

interface ISimplexProps {
  variables: string[];
  matrix: number[][]
}

interface IMatrixProps {
  variables: string[];
  matrix: number[][];
  pivot?: {
    x: number;
    y: number;
  }
  entering?: number;
  exiting?: number;
}

interface IVariables {
  name: string;
  value: number;
}

interface IResult {
  optimalValue?: number;
  basicVariables?: IVariables[];
  nonBasicVariables?: IVariables[];
  unbounded?: boolean;
}

interface ISimplexResponseProps {
  matrixes: IMatrixProps[];
  result: null | IResult;
}

interface IFindPivot {
  pivot: number;
  pivotX: number;
  pivotY: number;
  unbounded: false;
}

interface IFindPivotUnbounded {
  unbounded: true;
}

const findPivot = (matrix: number[][], pivotColumn: number): IFindPivot | IFindPivotUnbounded => {
  const lastColumnIndex = matrix[0].length - 1

  // LIT = LOWEST INDEPENDENT TERM (MENOR TERMO INDEPENDENTE)
  let lowestRatioRowIndex = 1

  // SET LOWEST I.T. AS THE FIRST ROW I.T.
  let lowestRatio = -1

  // FIND THE LOWEST I.T.
  for (let i = 1; i < matrix.length; i++) {
    const independentTerm = matrix[i][lastColumnIndex]
    const ratio = independentTerm / matrix[i][pivotColumn]
    if ((ratio >= 0 && lowestRatio > ratio) || lowestRatio === -1) {
      lowestRatio = ratio
      lowestRatioRowIndex = i
    }
  }

  if (lowestRatio < 0) {
    return { unbounded: true }
  } else {
    // FIND THE PIVOT
    const pivot = matrix[lowestRatioRowIndex][pivotColumn]

    return { pivot, pivotX: lowestRatioRowIndex, pivotY: pivotColumn, unbounded: false }
  }
}

const simplex = ({ variables, matrix }: ISimplexProps): ISimplexResponseProps => {
  const matrixes: IMatrixProps[] = []

  let counter = 0

  const maxCounter = 25

  while (matrix[0].find(value => value < 0) && counter < maxCounter) {
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

    // FIND PIVOT
    const find = findPivot(matrix, minValueOnZIndex)

    // IF UNBOUNDED RETURN
    if (find.unbounded) {
      return {
        result: {
          unbounded: true
        },
        matrixes
      }
    }

    // ELSE CONTINUE AND GET PIVOT PROPS
    const { pivot, pivotX, pivotY } = find as IFindPivot

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

  let result = null

  if (counter < maxCounter) {
    result = {}

    const lastMatrix = matrixes[matrixes.length - 1].matrix

    const optimalValue = lastMatrix[0][lastMatrix[0].length - 1]

    const basicVariables: IVariables[] = []

    let nonBasicVariables: IVariables[] = []

    for (let i = 1; i < lastMatrix.length; i++) {
      for (let j = 0; j < lastMatrix[i].length - 1; j++) {
        if (lastMatrix[i][j] === 1 && !lastMatrix[i].find((vVal, vIndex) => vVal === 1 && vIndex !== j && vIndex < j)) {
          basicVariables.push({ name: variables[j], value: lastMatrix[i][lastMatrix[i].length - 1] })
        } else {
          nonBasicVariables.push({ name: variables[j], value: 0 })
        }
      }
    }

    nonBasicVariables = _.uniqBy(nonBasicVariables.filter(nbvar => !basicVariables.find(bvar => bvar.name === nbvar.name)), 'name')

    result = {
      optimalValue,
      basicVariables,
      nonBasicVariables
    }
  }

  console.log('RESULT: ', result)

  return {
    matrixes,
    result: result || null
  }
}

export default simplex
