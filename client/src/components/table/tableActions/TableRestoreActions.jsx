import React from 'react'

function TableRestoreActions({id, onRestore, props}) {
  return (
    <button {...props} onClick={()=>{onRestore(id)}}>Restore</button>
  )
}

export default TableRestoreActions