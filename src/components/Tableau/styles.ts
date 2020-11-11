import styled from 'styled-components'

import { lighten } from 'polished'

export const Table = styled.table`
  padding: 5px;
  background-color:  ${lighten(0.01, '#191622')} ;
  margin-top: 20px;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;

  thead, tbody{
    background-color: ${lighten(0.01, '#191622')} ;
  }

  th {
    padding: 5px 10px;
    text-align: center;
    color: ${lighten(0.2, '#191622')} ;
    font-size: 22px;
    font-weight: 600;    
    width: 80px;
    border-color: ${lighten(0.04, '#191622')}; 
    border-width: 0px;
    border-style: solid;
    border-spacing: 0px;
    border-collapse: collapse;
    border-bottom-width: 1px;

    :not(:last-of-type){
      border-right-width: 1px;
    }

    :not(:first-of-type){
      border-left-width: 1px;
    }
  }

  td {
    text-align: center;
    padding: 5px 10px;
    font-size: 18px;
    border-color: ${lighten(0.04, '#191622')} ;
    border-width: 0px;
    border-style: solid;
    border-spacing: 0px;
    border-collapse: collapse;
  }

  .z-row{
    color: ${lighten(0.2, '#191622')} ;
  }

  .entering {
    color: green;
  }

  .exiting {
    color: yellow;
  }

  .pivot {
    color: red;
  }

  

  tbody{
    tr:not(:last-of-type){
      td{
        border-top-width: 1px;
        border-bottom-width: 1px;
        :not(:last-of-type){
          border-right-width: 1px;
        }
        :not(:first-of-type){
          border-left-width: 1px;
        }
      }
    }

    tr:last-of-type{
      td{
        border-top-width: 1px;
        :not(:last-of-type){
          border-right-width: 1px;
        }
        :not(:first-of-type){
          border-left-width: 1px;
        }
      }
    }

  }
`
