import React from 'react'

import brand_logo from '../../../assets/images/brand_logo.png'
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
function MaterialItem() {
    return (
        <div className='card flex flex-col text-light_font'>
            <h5>News and article</h5>
            <img src={brand_logo} alt='prdasd' />
            <h4>Title</h4>
            <h6>Minimum Kg: 1Kg</h6>
            <div className='flex gap-4 w-full text-sm'>
                <div className='flex gap-2 items-center'>
                    Clean
                    <p>123,222</p>
                </div>
                <div className='flex gap-2 items-center'>
                    Dirty
                    <p>123,222</p>
                </div>
            </div>
            <div className='flex justify-between w-full text-sm'>
                <p>12/13/2024</p>
                <button><MoreVertSharpIcon /></button>
            </div>
        </div>
    )
}

export default MaterialItem