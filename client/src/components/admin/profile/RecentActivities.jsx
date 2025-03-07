import React from 'react'
import ContentAdminActivities from './ContentAdminActivities'
import AdminStoreActivities from './AdminStoreActivities'

function RecentActivities() {
    return (
        <div className=' flex flex-col gap-4 xl:col-span-2'>
            <h4 className="bg-dark_font py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white">
                Your recent activities
            </h4>
            <div className='grid lg:grid-cols-2 gap-4'>
                <AdminStoreActivities />
                <ContentAdminActivities />
            </div>
        </div>
    )
}

export default RecentActivities