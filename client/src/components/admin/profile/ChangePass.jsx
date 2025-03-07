
import { useState } from 'react'
import ConfirmPassword from './ConfirmPassword'
import NewPass from './NewPass'

function ChangePass() {

    const [isConfirmed, setIsConfirmed] = useState(false)

    let content = <ConfirmPassword setIsConfirmed={setIsConfirmed} />

    if (isConfirmed) {
        content = <NewPass />
    }
    return (
        <>
            <div className='grid md:grid-cols-2 gap-8 mt-4 shadow-cardShadow bg-white rounded-md py-16'>

                {content}
            </div>
            <div className="flex flex-col items-start p-4 mb-4 text-sm mt-4 text-accent_color border border-accent_color rounded-lg bg-secondary_color/10" role="alert">
                <p className='flex items-center text-accent_color'><svg className="w-5 h-5 mr-2 text-accent_color" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 00-2 0v4a1 1 0 002 0V6zm-1 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
                    <span className="font-medium">Note:</span>Password requirements:</p>
                    <p className='text-accent_color'>Password must be at least 8 characters long.</p>
                    <p className='text-accent_color'>Password must contain at least one uppercase letter.</p>
                    <p className='text-accent_color'>Password must contain at least one lowercase letter.</p>
                    <p className='text-accent_color'>Password must contain at least one number</p>
                    <p className='text-accent_color'>Password must contain at least one special character (@#$%^&+=!.).</p>

            </div>
        </>
    )
}

export default ChangePass