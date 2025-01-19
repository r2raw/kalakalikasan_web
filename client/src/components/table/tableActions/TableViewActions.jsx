import React from 'react'

function TableViewActions({ onView, id, ...props}) {

  return (
    <button {...props} onClick={()=>{onView(id)}}>View</button>
  )
}

export default TableViewActions