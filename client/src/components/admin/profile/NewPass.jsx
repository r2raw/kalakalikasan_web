import React, { useRef, useState } from 'react'
import PasswordSharpIcon from '@mui/icons-material/PasswordSharp';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import VisibilityOffSharpIcon from '@mui/icons-material/VisibilityOffSharp';
import { IconButton } from '@mui/material';
import { isObjEmpty, passwordValidation } from '../../../util/validations';
import { changePassword, queryClient } from '../../../util/http';
import { useMutation } from '@tanstack/react-query';
import Modal from '../../models/ui/Modal';
import DoneSharpIcon from '@mui/icons-material/DoneSharp';
import { useNavigate } from 'react-router-dom';
import ErrorSingle from '../../models/ErrorSingle'
function NewPass() {
    const dialog = useRef(null);

    const navigate = useNavigate()

    const { mutate, isPending, isError, error } = useMutation(
        {
            mutationFn: changePassword,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['user'] });
                dialog.current.open()
            },
        },
    )


    const [seePass, setSeePass] = useState({
        newPass: false,
        confirmPass: false
    })

    const [errorPass, setErrorPass] = useState({})
    const [values, setValues] = useState({
        newPassword: '',
        confirmPass: '',
    })
    const handleVisibility = (pass) => {
        setSeePass(prev => ({
            ...prev,
            [pass]: !prev[pass]
        }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setValues(prev => ({ ...prev, [name]: value }))
    }
    const handleSubmit = (e) => {
        e.preventDefault()

        const errorObj = passwordValidation(values)

        const isValid = isObjEmpty(errorObj)
        console.log(isValid)
        if (!isValid) {
            setErrorPass(errorObj)
            return
        }

        setErrorPass({})
        mutate({ id:localStorage.getItem('id'), password: values.confirmPass })
    }
    const handleModalClose = () => {
        navigate('../..');

    }
    return (
        <>
            <Modal ref={dialog} onClose={handleModalClose} >

                <div className='flex mb-8 items-center gap-2'>
                    <DoneSharpIcon fontSize='large' sx={{ color: '#204d2c' }} />
                    <h2 className='text-dark_font'>Success</h2>
                </div>
                <p className=' max-w-[36rem] w-96 text-lg'>
                    Data updated successfully!
                </p>
                <div className='mt-8 flex gap-2 justify-end'>
                    <button onClick={handleModalClose} className='bg-dark_font hover:bg-light_font rounded-md px-4 py-1 text-white'>Ok</button>
                </div>
            </Modal>
            <div className='px-8 order-2 md:order-1' >
                <form className=' bg-white flex flex-col gap-4  w-full' onSubmit={handleSubmit}>
                    <div>
                        <div className='relative py-2'>
                            <input placeholder=' ' value={values.newPassword} onChange={handleChange} name='newPassword' type={seePass.newPass ? 'text' : 'password'} className='peer border-b-2 border-dark_font shadow-lg hover:shadow-none text-dark_font rounded-lg bg-white ' />
                            <span className=' pointer-events-none absolute -left-0 peer-placeholder-shown:left-2 scale-75 -top-1/2 translate-y-1/2 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 text-secondary_color'>New password</span>
                            <span className='absolute top-1/2 -translate-y-1/2 right-0' >
                                <IconButton onClick={() => { handleVisibility('newPass') }}>
                                    {seePass.newPass ? <VisibilitySharpIcon className='text-accent_color' /> : <VisibilityOffSharpIcon className='text-accent_color' />}

                                </IconButton>
                            </span>
                        </div>
                        {errorPass && errorPass.newPassword && <p className='text-red-500 px-2 m-0'>{errorPass.newPassword}</p>}
                    </div>
                    <div>
                        <div className='relative py-2'>
                            <input placeholder=' ' value={values.confirmPass} onChange={handleChange} type={seePass.confirmPass ? 'text' : 'password'} name='confirmPass' className='peer border-b-2 border-dark_font shadow-lg hover:shadow-none text-dark_font rounded-lg bg-white ' />
                            <span className=' pointer-events-none absolute -left-0 peer-placeholder-shown:left-2 scale-75 -top-1/2 translate-y-1/2 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 text-secondary_color'>Confirm password</span>
                            <span className='absolute top-1/2 -translate-y-1/2 right-0' >
                                <IconButton onClick={() => { handleVisibility('confirmPass') }}>
                                    {seePass.confirmPass ? <VisibilitySharpIcon className='text-accent_color' /> : <VisibilityOffSharpIcon className='text-accent_color' />}

                                </IconButton>
                            </span>
                        </div>
                        {errorPass && errorPass.confirmPass && <p className='text-red-500 px-2 m-0'>{errorPass.confirmPass}</p>}
                        {/* {error && <p className='text-red-500 px-2 m-0'>{error}</p>} */}
                    </div>
                    <button className='bg-accent_color text-white hover:bg-secondary_color px-4 py-2 rounded-md' disabled={isPending}>{isPending ? 'Submitting...' : 'Submit'}</button>

                </form>
               {isError && <ErrorSingle  message={error.info?.error || 'An error occured'}/>}
            </div>
            <div className='flex flex-col gap-4 justify-center items-center px-8 order-1  md:order-2'>
                <PasswordSharpIcon className='text-secondary_color fill-secondary_color' style={{ fontSize: 80 }} />
                <p className='text-secondary_color font-bold text-center'>For your security, we recommend updating your password regularly</p>
            </div>
        </>
    )
}

export default NewPass