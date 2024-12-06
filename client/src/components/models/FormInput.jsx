import React from 'react'

function FormInput({ placeholderName, ...props },) {
    return (
        <div className='relative py-2'>
            <input placeholder=' ' className='peer border-b-2 border-dark_font shadow-lg hover:shadow-none text-dark_font rounded-lg ' {...props} />
            <span className=' pointer-events-none absolute -left-2 peer-placeholder-shown:left-2 scale-75 -top-1/2 translate-y-1/2 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100'>{placeholderName}</span>
        </div>
    )
}

export default FormInput