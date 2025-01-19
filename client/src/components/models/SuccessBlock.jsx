import React from 'react'

function SuccessBlock({ message }) {
    return (
        <div className='bg-green-300 px-4 py-2 my-4 '>
            <p className='text-green-700'>{message}</p>
        </div>
    )
}

export default SuccessBlock