import styled, { css } from 'styled-components'

import { darken, lighten } from 'polished'

interface IInitialStepProps {
  hasError: boolean;
}

export const Container = styled.div`
    height: 100vh;
    padding: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #191622;
`

export const TableausList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  padding-right: 8px ;

  ::-webkit-scrollbar {
    background-color: ${lighten(0.01, '#191622')}  !important;
    color: ${lighten(0.05, '#191622')}  !important;
  }

  :-webkit-scrollbar-corner {
    background-color: ${lighten(0.01, '#191622')}  !important;
  }

  ::-webkit-scrollbar-thumb {
     background-color: ${lighten(0.05, '#191622')} !important;
  }
`

export const InitialStep = styled.div<IInitialStepProps>`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 0;

    > div:not(${TableausList}) {
      display: flex;
      flex-direction: row;
      align-items: center;

      span {
        font-size: 24px;
      }

      span + input {
        margin-left: 24px;
      }

      > input {
        ${props =>
    props.hasError &&
    css`
            border: 2px solid #c33030;
          `}
      }
    }

    > button {
      font-size: 32px;
      width: 100%;
      margin-top: 24px;

      svg {
        transition: transform linear 0.1s;
      }

      &:hover{
        svg{
          -webkit-transform: rotate(90deg);
          -moz-transform: rotate(90deg);
          -o-transform: rotate(90deg);
          -ms-transform: rotate(90deg);
          transform: rotate(90deg);
        }
        }
    }
`

export const ContentContainer = styled.div`
    overflow-y: hidden;
    padding: 24px 0px;
    height: 100%;
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${darken(0.04, '#191622')};
    box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
    border-radius: 20px;    
    flex-wrap: nowrap;

    .trash-icon {
      color: #c53030;
      font-size: 32px;
      cursor: pointer;

      &:hover{
        color: ${darken(0.1, '#c53030')};
      }
    }

    > header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0px 24px;
      width: 100%;

      span {
        font-size: 44px;
        font-weight: 600;
      }

      > .trash-icon{
        font-size: 40px;
      }
    }

    > header + hr {
      width: 95%;
      margin: 24px 0px;
      border: 0.5px solid ${lighten(0.05, '#191622')};
    }

    > .first-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      width: 100%;

      > span {
        font-size: 20px;
        font-weight: 600;
      }

      > .objective-function-input {
        margin-top: 24px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;

        > span {
          margin-right: 48px;
          font-size: 20px;
        }

      }

      .input-wrapper {

          & + .input-wrapper{
            margin-left: 24px;
          }

          input + span {
            margin-left: 8px;
          }
      }

      .constraints-container {
        margin-top: 48px;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        width: 90%;

        > header{
          span{
            font-size: 20px;
            font-weight: 600;
          }
          margin-bottom: 24px;
        }

        > .constraints-list {          
          > .constraint-wrapper {
          display: flex;
          flex-direction: row;
          align-items: center;

          > select {
            margin-left: 24px;
          }

          > select + input {
            margin-left: 24px;
          }

          & + .constraint-wrapper{
            margin-top: 24px;
          }
          
          > svg {
            margin-left: 24px;
          }

          > .spacer{
            margin-left: 24px;
            width: 32px;
          }

        }
        }

        > svg {
          font-size: 32px;
          margin-top: 24px;
          cursor: pointer;

          &:hover{
            color: ${darken(0.3, '#fff')};
          }
        }

        > button {
          margin-top: auto;
          color: #009908;
          font-size: 30px;

          transition: background-color linear 1.2s;
          transition: color linear 0.2s;

          svg {
            margin-right: 15px;
            padding: 0px;
          }

          &:hover{
            background-color: ${darken(0.05, '#009908')};
            color: #fff;
          }
        }
      }
    }
`

export const Text = styled.p`
    margin-top: 35px;
    font-size: 20px;
    font-weight: bold;
`

export const Error = styled.span`
  display: block;
  color: #c53030;
  margin-top: 24px;
  font-size: 18px;
`
