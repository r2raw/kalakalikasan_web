import React from 'react'
import { Outlet } from 'react-router-dom'

function MaterialLayout() {
  return (
    <div>
        <Outlet />
    </div>
  )
}

export default MaterialLayout