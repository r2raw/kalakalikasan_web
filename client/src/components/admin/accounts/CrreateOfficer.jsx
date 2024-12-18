import React from 'react'
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import { NavLink, useNavigate } from 'react-router-dom';
import FormInput from '../../models/FormInput';

function CrreateOfficer() {
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('../');

    }

    return (
        <>
            <div>
                <NavLink to='../'>
                    <ArrowBackSharpIcon />
                </NavLink>
            </div>
            <div className='card px-4'>
                <form className='flex flex-col gap-4 w-full px-8 py-8' onSubmit={handleSubmit}>
                    <div className='flex gap-4'>
                        <div className='flex flex-col'>
                            <div className='w-40 h-40 bg-slate-400 rounded-md shadow-lg hover:shadow-none'></div>
                            <FormInput type='file' accept="image/png, image/gif, image/jpeg" id='officer-img' className=' hidden' />
                            <label htmlFor='officer-img' className='text-center cursor-pointer bg-dark_font text-white px-2 py-1 rounded-md shadow-md hover:shadow-none'>Upload photo</label>
                        </div>
                        <div className='flex flex-col gap-4 w-full'>
                            <FormInput placeholderName={'First Name'} type='text' />
                            <FormInput placeholderName={'Middle Name'} type='text' />
                            <FormInput placeholderName={'Last Name'} type='text' />
                        </div>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <FormInput placeholderName={'Birthdate'} type='date' />
                        <FormInput placeholderName={'Mobile No.'} type='number' />
                        <FormInput placeholderName={'Email Address.'} type='email' />
                    </div>
                    <div className='grid grid-cols-3 gap-4'>
                        <FormInput placeholderName={'Street'} type='text' />
                        <FormInput placeholderName={'Barangay'} type='text' />
                        <FormInput placeholderName={'Zip/Postal'} type='number' />

                    </div>
                    <div className='flex justify-end'>
                        <button className='px-4 py-2 bg-dark_font rounded-md text-white shadow-lg hover:shadow-none'>Submit</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default CrreateOfficer