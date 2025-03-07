import React from 'react'

function ErrorSingle({ message }) {
    return (
        <div className='bg-red-300 px-4 py-2 my-4 border border-red-700 rounded-md'>
            <p className='text-red-700' >{message}</p>
        </div>
    )
}

export default ErrorSingle