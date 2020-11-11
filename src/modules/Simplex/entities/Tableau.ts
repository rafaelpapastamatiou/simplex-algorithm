interface IConstraintVariablesValue {
  name: string;
  value: number | undefined;
}

interface IConstraintProps {
  variables: IConstraintVariablesValue[];
  signal: string;
  independentTermValue: number | undefined;
}

interface ITableauConstructorProps {
  variables: string[];
  constraints: IConstraintProps[];
  objective: IConstraintProps;
  rows?: number;
  columns?: number;
}

export default class Tableau implements ITableauConstructorProps {
  variables: string[]
  constraints: IConstraintProps[]
  objective: IConstraintProps
  matrix: number[][]

  constructor({ variables, constraints, objective }: ITableauConstructorProps) {
    this.variables = [...variables]
    this.constraints = constraints
    this.objective = objective
    this.matrix = [[0], [0]]

    const matrix = []

    matrix[0] = [...objective.variables.map(v => v.value as number * -1)]

    for (const [constraintIndex, constraint] of constraints.entries()) {
      matrix[constraintIndex + 1] =
        [
          ...constraint.variables.map(v => parseFloat(v.value?.toString() || '0'))
        ]
    }

    // add slack, surplus and artificial variables

    for (const [constraintIndex, constraint] of constraints.entries()) {
      const lastVar = this.variables[this.variables.length - 1]

      const newVar =
        `x${parseInt(lastVar.slice(1)) + 1
        } `

      this.variables.push(newVar)

      matrix[0].push(0)

      for (const [addToConstraintIndex] of constraints.entries()) {
        if (constraintIndex === addToConstraintIndex) {
          matrix[addToConstraintIndex + 1].push(constraint.signal === '<=' ? 1 : constraint.signal === '>=' ? -1 : 0)
          //
          // TODO not working as expected if greater than
          if (constraint.signal === '>=') {
            this.variables.push(`x${parseInt(lastVar.slice(1)) + 2}`)
            matrix[addToConstraintIndex + 1].push(1)
            matrix[0].push(1)
            for (const [aConstraintIndex] of constraints.entries()) {
              if (aConstraintIndex !== addToConstraintIndex + 1 && aConstraintIndex > 0) matrix[aConstraintIndex].push(0)
            }
          }
          //
        } else matrix[addToConstraintIndex + 1].push(0)
      }
    }

    matrix[0] = [...matrix[0], 0]

    for (const [constraintIndex, constraint] of constraints.entries()) {
      matrix[constraintIndex + 1] =
        [
          ...matrix[constraintIndex + 1],
          parseFloat(constraint.independentTermValue?.toString() || '0')
        ]
    }

    this.variables = [...this.variables, 'b']

    this.matrix = matrix
  }

  showMatrix(): void {
    console.table(this.matrix)
  }
}
