import React, { useEffect, useRef, useState } from 'react'
import FormInput from '../../models/FormInput'
import { titleCase } from 'title-case'
import { useSelector } from 'react-redux'
import { dbDateInputFormatter, maxDate } from '../../../util/formatter'
import { accountFormValidation, isObjEmpty } from '../../../util/validations'
import { useMutation } from '@tanstack/react-query'
import { editUser, queryClient } from '../../../util/http'
import ErrorBlock from '../../models/ErrorBlock'
import Modal from '../../models/ui/Modal'

import DoneSharpIcon from '@mui/icons-material/DoneSharp';
import { useNavigate } from 'react-router-dom'
function ProfileInfo() {
    const navigate = useNavigate()
    const dialog = useRef(null);

    const { mutate, isPending, isError, error } = useMutation(
        {
            mutationFn: editUser,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['user'] });
                dialog.current.open();

            },
        },
    )

    const [errors, setErrors] = useState({})
    const selector = useSelector((state) => state.currentUser)
    const [values, setValues] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        username: '',
        birthdate: '',
        mobile_num: '',
        email: '',
        street: '',
        sex: '',

    })

    useEffect(() => {

        if (selector) {

            if (selector.firstname != '') {

                setValues((prev) => ({
                    firstname: selector.firstname,
                    middlename: selector.middlename || '',
                    lastname: selector.lastname,
                    username: selector.username,
                    birthdate: dbDateInputFormatter(selector.birthdate),
                    mobile_num: selector.mobile_num,
                    email: selector.email,
                    street: selector.street,
                    sex: selector.sex,
                }))
            }

        }
    }, [selector])

    const handleChange = (e) => {
        const { name, value } = e.target

        console.log(name)

        setValues((prev) => ({ ...prev, [name]: value }))

    }


    const handleSubmit = (e) => {
        e.preventDefault();

        const formErrorObj = accountFormValidation(values);
        const isFormValid = isObjEmpty(formErrorObj)
        console.log(isFormValid)
        if (!isFormValid) {
            return setErrors(formErrorObj)
        }


        const formData = new FormData(e.target);
        let data = Object.fromEntries(formData);
        data = { ...data, modified_by: localStorage.getItem('id'), id: localStorage.getItem('id'), };

        mutate({ data })

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
            <div className='grid grid-cols-1 mt-4'>
                <div className="flex items-center p-4 mb-4 text-sm text-accent_color border border-accent_color rounded-lg bg-secondary_color/10" role="alert">
                    <svg className="w-5 h-5 mr-2 text-accent_color" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 00-2 0v4a1 1 0 002 0V6zm-1 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Note:</span> Fill out all required fields before updating your profile.
                </div>
                {isError &&
                    <ErrorBlock message={error?.info?.errors || ['An error occured']} />}

                <form onSubmit={handleSubmit} className='flex flex-col bg-white px-2 md:px-4 py-8 w-full gap-4 rounded-md'>
                    <div className='grid grid-cols-1 gap-4'>
                        <FormInput placeholderName={'First Name'} name='firstname' value={titleCase(values.firstname) || ''} type='text' onChange={handleChange} error={errors.firstname} />
                        <FormInput placeholderName={'Middle Name'} name='middlename' value={titleCase(values.middlename) || ''} type='text' onChange={handleChange} />
                        <FormInput placeholderName={'Last Name'} name='lastname' value={titleCase(values.lastname) || ''} type='text' onChange={handleChange} error={errors.lastname} />
                        <div>
                            <div className='flex  gap-2 md:gap-4'>
                                <p>Sex: </p>
                                <div>
                                    <input className='peer hidden' type='radio' id='sex-male' name='sex' value='male' checked={values.sex == 'male'} onChange={handleChange} />
                                    <label htmlFor='sex-male' className='cursor-pointer border border-light_font text-light_font peer-checked:bg-dark_font peer-checked:text-white px-2 md:px-4 py-2 rounded-md'>Male</label></div>
                                <div>
                                    <input className='peer hidden' type='radio' id='sex-female' name='sex' value='female' checked={values.sex == 'female'} onChange={handleChange} />
                                    <label htmlFor='sex-female' className='cursor-pointer border border-light_font text-light_font peer-checked:bg-dark_font peer-checked:text-white px-2 md:px-4  py-2 rounded-md'>Female</label>
                                </div>

                            </div>
                            {errors.sex && <p className='text-red-500 px-2'>{errors.sex}</p>}
                        </div>
                        <FormInput placeholderName={'Username'} name='username' type='text' value={values.username.replace(' ', '') || ''} onChange={handleChange} error={errors.username} />
                        <FormInput placeholderName={'Birthdate'} name='birthdate' type='date' value={values.birthdate} onChange={handleChange} error={errors.birthdate} max={maxDate()} />
                        <FormInput placeholderName={'Mobile No.'} name='mobile_num' type='number' value={values.mobile_num || ''} onChange={handleChange} error={errors.mobile_num} />
                        <FormInput placeholderName={'Email Address.'} name='email' type='email' value={values.email || ''} onChange={handleChange} error={errors.email} />

                        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>

                            <FormInput placeholderName={'Street'} name='street' type='text' value={titleCase(values.street) || ''} onChange={handleChange} error={errors.street} />
                            <FormInput placeholderName={'Barangay'} value='Batasan Hills' readOnly name='barangay' type='text' />
                            <FormInput placeholderName={'City'} value='Quezon City' readOnly name='city' type='text' />
                            <FormInput placeholderName={'Zip'} value='1126' readOnly name='zip' type='number' />
                        </div>
                    </div>
                    <button className='bg-accent_color py-2 hover:bg-secondary_color rounded-md text-white' disabled={isPending} >{isPending ? 'Updating...' : 'Update'}</button>
                </form>
            </div>
        </>
    )
}

export default ProfileInfo