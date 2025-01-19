import React from 'react'

function ErrorBlock({ message }) {
    return (
        <div className='bg-red-300 px-4 py-2 my-4 '>
            {message.map((error, index) => <p className='text-red-700' key={index}>{error}</p>)}
        </div>
    )
}

export default ErrorBlock