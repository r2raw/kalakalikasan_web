import KeyIcon from '@mui/icons-material/Key';
import { confirmPassword, queryClient } from '../../../util/http';
import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import VisibilityOffSharpIcon from '@mui/icons-material/VisibilityOffSharp';
import { IconButton } from '@mui/material';
function ConfirmPassword({ setIsConfirmed }) {
    const passwordRef = useRef(null)
    const [errorString, setErrorString] = useState(null)
    const [seePass, setSeePass] = useState(false)
    const { mutate, isPending, isError, error } = useMutation(
        {
            mutationFn: confirmPassword,
            onSuccess: () => {
                setIsConfirmed(true)
                // dialog.current.open()
            }, onError: (error) => {
                setErrorString(error.info?.error || 'An error occured')
                setTimeout(() => {
                    setErrorString(null)
                }, 3000)
            },
        },
    )


    const handleVisibility = ()=>{
        setSeePass(prev => !prev)
    }
    const handleSubmit = (e) => {
        e.preventDefault()

        const data = {}

        const password = passwordRef.current.value;

        if (password.trim() == '') {
            setErrorString('Please enter your password!')
            return
        }
        setErrorString(null)

        mutate({ id: localStorage.getItem('id'), password })
    }
    return (
        <>
            <div className='flex flex-col gap-4 justify-center items-center px-8'>
                <KeyIcon className='text-secondary_color fill-secondary_color' style={{ fontSize: 80 }} />
                <p className='text-secondary_color font-bold text-center'>To protect your account, we require you to confirm your password before making changes.</p>
            </div>
            <div className='px-8'>
                <form onSubmit={handleSubmit} className=' bg-white flex flex-col gap-4  w-full'>
                    <div>
                        <div className='relative py-2'>
                            <input placeholder=' ' ref={passwordRef} type={seePass?'text' : 'password'} className='peer border-b-2 border-dark_font shadow-lg hover:shadow-none text-dark_font rounded-lg bg-white ' />
                            <span className=' pointer-events-none absolute -left-0 peer-placeholder-shown:left-2 scale-75 -top-1/2 translate-y-1/2 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 text-secondary_color'>Confirm password</span>
                            <span className='absolute top-1/2 -translate-y-1/2 right-0' >
                                <IconButton onClick={handleVisibility}>
                                    {seePass ? <VisibilitySharpIcon className='text-accent_color' /> : <VisibilityOffSharpIcon  className='text-accent_color' />}

                                </IconButton>
                            </span>
                        </div>
                        {errorString != null && <p className='text-red-500 px-2 m-0'>{errorString}</p>}
                    </div>
                    <button className='bg-accent_color text-white hover:bg-secondary_color px-4 py-2 rounded-md' disabled={isPending}>{isPending ?'Loading...' : 'Confirm'}</button>
                </form>
            </div>
        </>
    )
}

export default ConfirmPassword