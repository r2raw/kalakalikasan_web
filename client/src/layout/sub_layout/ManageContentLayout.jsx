import React from 'react'
import { Outlet } from 'react-router-dom'

function ManageContentLayout() {
    return (
        <div>
            <Outlet />
        </div>
    )
}

export default ManageContentLayout