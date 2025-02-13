import React from 'react'

import brand_logo from '../../../assets/images/brand_logo_no_circle_fit.png'
import { titleCase } from 'title-case'
import { dbDateFormatter } from '../../../util/formatter'
function StoreCard({ data }) {

    let storeLogo = <img src={brand_logo} alt='logo' className='w-40 h-40' />

    if(data.store_logo){
        storeLogo = <img src={`${import.meta.env.VITE_BASE_URL}/store-cred/store_logo/${data.store_logo}`} alt='logo' className='w-40 h-40' />
    }
    return (
        <div className='card flex flex-col gap-4 hover:scale-105 cursor-pointer'>
            {storeLogo}
            <h3 className='text-dark_font'>{titleCase(data.store_name)}</h3>
            <div className='flex justify-between w-full items-center'>
                <p>Date approved:</p>
                <p>{dbDateFormatter(data.approval_date)}</p>
            </div>
        </div>
    )
}

export default StoreCard