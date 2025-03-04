import React from 'react'

function FormInput({ placeholderName, error, ...props },) {

    let content = <>
        <input placeholder=' ' className='peer border-b-2 border-dark_font shadow-lg hover:shadow-none text-dark_font rounded-lg bg-white ' {...props} />
        <span className=' pointer-events-none absolute -left-0 peer-placeholder-shown:left-2 scale-75 -top-1/2 translate-y-1/2 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 text-secondary_color'>{placeholderName}</span>
    </>

    return (
        <div>
            <div className='relative py-2'>
                {content}
            </div>
            {error && <p className='text-red-500 px-2 m-0'>{error}</p>}
        </div>
    )
}

export default FormInput