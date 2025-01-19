
import { Outlet } from 'react-router-dom'

function ManageAccountLayout() {
    
    return (
        <div className='flex flex-col gap-4'>
            <Outlet  />
        </div>
    )
}

export default ManageAccountLayout