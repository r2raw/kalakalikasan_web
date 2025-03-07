import React from 'react'

import brand_logo from '../../../assets/images/brand_logo_no_circle_fit.png'
import { titleCase } from 'title-case'
import { dbDateFormatter, truncateText } from '../../../util/formatter'
import { useNavigate } from 'react-router-dom'
function StoreCard({ data }) {
    const navigate = useNavigate();
    let storeLogo = <img src={brand_logo} alt='logo' className='w-full h-4/5 object-contain  ' />

    if (data.store_logo) {
        storeLogo = <img src={`https://kalakalikasan-server.onrender.com/store-cred/store_logo/${data.store_logo}`} alt={`${data.store_name}-logo`} className='w-full h-4/5 object-contain rounded-md' />
    }

    const handleClick = ()=>{
        navigate(data.id)
    }
    return (
        <div className='card flex text-base_color flex-col gap-4 hover:scale-105 h-96 cursor-pointer' onClick={handleClick}>
            {/* <div className='bg-base_color w-full flex items-center justify-center py-2 rounded-md h-40 px-4'> */}
            {storeLogo}
            {/* </div> */}
            {/* <div className='bg-base_color w-full flex flex-col items-center justify-between py-2 rounded-md h-40 px-2'> */}
                <h3 className='text-secondary_color'>{truncateText(titleCase(data.store_name), 20)}</h3>
                <div className='flex justify-between  w-full items-center'>
                    <p className='text-secondary_color'>Date approved:</p>
                    <p className='text-secondary_color'>{dbDateFormatter(data.approval_date)}</p>
                </div>
            {/* </div> */}
        </div>
    )
}

export default StoreCard