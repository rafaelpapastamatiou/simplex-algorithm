import React, { useEffect, useState } from 'react'

import _ from 'lodash'

import { FiChevronRight, FiPlusCircle, FiMinusCircle, FiCheck } from 'react-icons/fi'

import { FaCalculator } from 'react-icons/fa'

import { VscClearAll } from 'react-icons/vsc'

import TableauClass from '../../modules/Simplex/entities/Tableau'

import simplex from '../../modules/Simplex/services/simplex'

import Input from '../Input'

import Button from '../Button'

import Select from '../Select'

import Tableau from '../Tableau'

import { Container, ContentContainer, Error, InitialStep, TableausList, TableauResults } from './styles'

interface ICustomTableauProps {
  matrix: number[][];
  variables: string[];
  pivot?: {
    x: number;
    y: number;
  }
  entering?: number;
  exiting?: number;
}

interface IConstraintVariablesValue {
  name: string;
  value: number | undefined;
}

interface IConstraintProps {
  variables: IConstraintVariablesValue[];
  signal: string;
  independentTermValue: number | undefined;
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

interface ISolveResponse {
  matrixes: ICustomTableauProps[];
  result: null | IResult;
}

const Main: React.FC = () => {
  const [variablesCount, setVariablesCount] = useState<number | undefined>()

  const [objFunctionVariables, setObjFunctionVariables] = useState<Array<number | undefined>>([])

  const [variablesName, setVariablesName] = useState<string[]>([])

  const [constraints, setConstraints] = useState<IConstraintProps[]>([])

  const [currentStep, setCurrentStep] = useState(0)

  const [varCountInputError, setVarCountInputError] = useState<string | null>(null)

  const [tableaus, setTableaus] = useState<ICustomTableauProps[]>([])

  const [result, setResult] = useState<IResult | null>()

  const handleReset = () => {
    setVariablesCount(undefined)
    setObjFunctionVariables([])
    setVariablesName([])
    setConstraints([])
    setCurrentStep(0)
    setVarCountInputError(null)
    setTableaus([])
  }

  const handleInit = () => {
    if (!variablesCount) {
      setVarCountInputError('Enter the number of variables.')
      return
    }

    if (variablesCount < 2) {
      setVarCountInputError('The number of variables must be at least 2.')
      return
    }

    setCurrentStep(1)
  }

  useEffect(() => {
    setObjFunctionVariables(Array.from(Array(variablesCount), () => undefined))

    const newVariablesName: string[] = []
    Array.from(Array(variablesCount), (_, i) => {
      newVariablesName.push(`x${i + 1}`)
    })

    setVariablesName(newVariablesName)

    handleAddConstraint()

    const firstConstraint: IConstraintProps = {
      variables: newVariablesName.map(v => ({ name: v, value: undefined })),
      signal: '<=',
      independentTermValue: undefined
    }

    setConstraints([firstConstraint])
  }, [variablesCount])

  const handleChangeObjFunctionVariableValue = (index: number, value: string) => {
    const newVariables = objFunctionVariables

    newVariables[index] = value ? parseFloat(value) : undefined

    setObjFunctionVariables([...newVariables])
  }

  interface IChangeConstraint {
    constraintIndex: number;
    type: 'var' | 'signal' | 'term';
    value: number | string;
    varName?: string;
  }

  const handleChangeConstraint = ({ constraintIndex, type, value, varName }: IChangeConstraint) => {
    const newConstraints = [...constraints]

    const actions = {
      var: () => {
        const varIndex = newConstraints[constraintIndex].variables.findIndex(v => v.name === varName)

        if (varIndex < 0) {

        }

        newConstraints[constraintIndex].variables[varIndex].value = value as number
      },
      signal: () => {
        newConstraints[constraintIndex].signal = value as string
      },
      term: () => {
        newConstraints[constraintIndex].independentTermValue = value as number
      }
    }

    if (actions[type]) {
      actions[type]()
    }

    setConstraints([...newConstraints])
  }

  const handleAddConstraint = () => {
    const newConstraint: IConstraintProps = {
      variables: variablesName.map(v => ({ name: v, value: undefined })),
      signal: '<=',
      independentTermValue: undefined
    }

    setConstraints([...constraints, newConstraint])
  }

  const handleDeleteConstraint = (constraintIndex: number) => {
    const newConstraints = [...constraints]

    newConstraints.splice(constraintIndex, 1)

    setConstraints(newConstraints)
  }

  const handleSolve = () => {
    for (const v of objFunctionVariables) {
      if (v === undefined) {
        return
      }
    }

    for (const c of constraints) {
      if (c.signal === '') return
      if (c.independentTermValue === undefined) return
      for (const v of c.variables) {
        if (v.value === undefined) return
      }
    }

    const originTableau =
      new TableauClass(
        {
          constraints,
          variables: variablesName,
          objective: {
            variables: objFunctionVariables.map((v, i) => ({ name: `x${i + 1}`, value: v })),
            independentTermValue: 0,
            signal: '='
          }
        }
      )

    originTableau.showMatrix()

    const tableauClone = _.cloneDeep(originTableau)

    const { matrixes: tableauSolveHistory, result }: ISolveResponse = simplex({ variables: tableauClone.variables, matrix: tableauClone.matrix })

    setResult(result)

    setTableaus([originTableau, ...tableauSolveHistory])

    setCurrentStep(currentStep + 1)
  }

  return (
    <Container>
      <ContentContainer>
        <header>
          <span>Simplex Algorithm</span>
          <VscClearAll className='trash-icon' onClick={handleReset} />
        </header>

        <hr />

        {currentStep === 0 && (
          <InitialStep hasError={!!varCountInputError}>
            <div>
              <span>Number of variables : </span>
              <Input
                type='number'
                onChange={
                  e => {
                    const value = parseInt(e.target.value)
                    if (!value) {
                      setVarCountInputError(null)
                      setVariablesCount(undefined)
                    }
                    if (Number.isInteger(value) && value > 0) {
                      setVarCountInputError(null)
                      setVariablesCount(value)
                    }
                  }
                }
                value={variablesCount}
              />
            </div>

            {varCountInputError && <Error>{varCountInputError}</Error>}

            <Button onClick={handleInit}><FiChevronRight /></Button>

            {/* <TableausList>
              <Tableau matrix={[[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]]} variables={['x1', 'x2', 'x3', 'b']} pivot={{ x: 1, y: 1 }} entering={1} exiting={1} />
              <Tableau matrix={[[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]]} variables={['x1', 'x2', 'x3', 'b']} pivot={{ x: 1, y: 1 }} entering={1} exiting={1} />
              <Tableau matrix={[[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]]} variables={['x1', 'x2', 'x3', 'b']} pivot={{ x: 1, y: 1 }} entering={1} exiting={1} />
              <Tableau matrix={[[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]]} variables={['x1', 'x2', 'x3', 'b']} pivot={{ x: 1, y: 1 }} entering={1} exiting={1} />
              <Tableau matrix={[[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]]} variables={['x1', 'x2', 'x3', 'b']} pivot={{ x: 1, y: 1 }} entering={1} exiting={1} />
              <Tableau matrix={[[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]]} variables={['x1', 'x2', 'x3', 'b']} pivot={{ x: 1, y: 1 }} entering={1} exiting={1} />
              <Tableau matrix={[[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]]} variables={['x1', 'x2', 'x3', 'b']} pivot={{ x: 1, y: 1 }} entering={1} exiting={1} />
            </TableausList> */}

          </InitialStep>

        )}

        {currentStep === 1 && (

          <div className='first-step'>
            <span>Values of the objective function: </span>
            <div className='objective-function-input'>
              <span>Max <strong>Z</strong> = </span>
              {Array.from(Array(variablesCount), (_, i) => (
                <div className='input-wrapper' key={i}>
                  <Input
                    type='number'
                    onChange={(e) => handleChangeObjFunctionVariableValue(i, e.target.value)}
                    value={objFunctionVariables[i]}
                  />
                  <span>{variablesName[i]}</span>
                </div>
              ))}
            </div>

            <div className='constraints-container'>
              <header>
                <span>Constraints</span>
              </header>
              <div className='constraints-list'>
                {constraints.map((constraint, cIndex) => (
                  <div className='constraint-wrapper' key={cIndex} >
                    {constraint.variables.map((v, vIndex) => (
                      <div className='input-wrapper' key={vIndex}>
                        <Input
                          type='number'
                          onChange={(e) => handleChangeConstraint({ type: 'var', value: e.target.value, varName: v.name, constraintIndex: cIndex })}
                          value={v.value}
                        />
                        <span>{v.name}</span>
                      </div>
                    ))}

                    <Select value={constraint.signal} onChange={(e) => handleChangeConstraint({ type: 'signal', value: e.target.value, constraintIndex: cIndex })} >
                      <option>{'<='}</option>
                      {/*
                        Greater than and equal disabled due to unexpected behavior
                      */}
                    </Select>

                    <Input
                      type='number'
                      onChange={(e) => handleChangeConstraint({ type: 'term', value: e.target.value, constraintIndex: cIndex })}
                      value={constraint.independentTermValue}
                    />

                    {cIndex > 0 && <FiMinusCircle className='trash-icon' onClick={() => handleDeleteConstraint(cIndex)} />}
                    {cIndex === 0 && <span className='spacer' />}

                  </div>
                ))}
              </div>

              <FiPlusCircle onClick={handleAddConstraint} />
              <Button onClick={handleSolve}><FaCalculator />Solve</Button>
            </div>
          </div>

        )}

        {currentStep === 2 && (
          <>
            {result && (
              <TableauResults>
                {
                  result.unbounded
                    ? (
                      <span>Unbounded</span>
                    )
                    : (
                      <>
                        <span>Optimal value: Z = {result.optimalValue}</span>
                        <span>Basic variables:</span>
                        <div>
                          {result.basicVariables && result.basicVariables.map(bvar => <span key={bvar.name} >{bvar.name} = {bvar.value}</span>)}
                        </div>
                        <br />
                        <span>Non Basic variables:</span>
                        <div>
                          {result.nonBasicVariables && result.nonBasicVariables.map(nbvar => <span key={nbvar.name} >{nbvar.name} = {nbvar.value}</span>)}
                        </div>
                      </>
                    )
                }

              </TableauResults>
            )}
            <TableausList>
              {tableaus.map((t: ICustomTableauProps, i: number) => (
                <Tableau
                  key={i}
                  matrix={t.matrix}
                  variables={t.variables}
                  pivot={t.pivot}
                  entering={t.entering}
                  exiting={t.exiting}
                />
              ))}
            </TableausList>
          </>
        )}

      </ContentContainer>
    </Container >
  )
}

export default Main
