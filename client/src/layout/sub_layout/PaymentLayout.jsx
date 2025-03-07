import React from 'react'
import { Outlet } from 'react-router-dom'

function PaymentLayout() {
  return (
    <div>
        <Outlet />
    </div>
  )
}

export default PaymentLayout