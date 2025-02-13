
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import FormInput from '../../models/FormInput';
import { useEffect, useRef, useState } from 'react';
import { imageChangeHandler, imageChangingEffect } from '../../../myFunctions/myFunctions';
import Modal from '../../models/ui/Modal';
import { useMutation } from '@tanstack/react-query';
import { createUser, editUser, queryClient } from '../../../util/http';
import ErrorBlock from '../../models/ErrorBlock';
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux';
import { usersAction } from '../../../store/slices/usersSlice';
import DoneSharpIcon from '@mui/icons-material/DoneSharp';
import { titleCase } from 'title-case';
import { accountFormValidation, isObjEmpty } from '../../../util/validations';
function CrreateOfficer() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [image, setImage] = useState();
    const dialog = useRef(null);
    const [formErrors, setFormErrors] = useState({

    })


    const userSelector = useSelector((state) => state.users);
    const formSelector = userSelector.formData

    const { mutate, isPending, isError, error } = useMutation(
        {
            mutationFn: createUser,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['users'] });
                dialog.current.open()
            },
        },
    )

    const handleSubmit = (e) => {
        e.preventDefault();
        // dialog.current.open();
        const formErrorObj = accountFormValidation(formSelector);
        const isFormValid = isObjEmpty(formErrorObj)
        if (!isFormValid) {
            return setFormErrors(formErrorObj)
        }

        const formData = new FormData(e.target);
        let data = Object.fromEntries(formData);
        data = { ...data, password: '123', role: 'officer', created_by: localStorage.getItem('id') };

        mutate({ data })


    }

    const [preview, setPreview] = useState();
    // let preview = null;

    useEffect(() => {
        imageChangingEffect(image, setPreview);
    }, [image]);


    const handleFileChange = (e) => {
        imageChangeHandler(e, setImage)

    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(usersAction.handleFormData({ [name]: value }))
    }

    const handleModalClose = () => {
        navigate('../active');

    }

    let imageContent = <div className='w-full md:w-56 h-56 bg-slate-400 rounded-md shadow-lg hover:shadow-none'></div>


    if (preview) {
        imageContent = <div className='w-full md:w-56 h-56 bg-slate-400 rounded-md shadow-lg hover:shadow-none'>
            {preview.map((pic) => <img key={pic} src={pic} alt='user-img' className='h-full w-full rounded-md' />)}
        </div>;
    }


    useEffect(() => {


        const formattedData = {
            firstname: '',
            middlename: '',
            lastname: '',
            username: '',
            birthdate: '',
            mobile_num: '',
            email: '',
            street: '',
            sex: '',
        };
        dispatch(usersAction.handleFormData(formattedData));
    }, [dispatch]);


    // useEffect(() => {
    //     setFormErrors(accountFormValidation(formSelector))

    // }, [formSelector])


    let content =
        <div className='card px-4'>
            <form className='flex flex-col gap-4 w-full px-8 py-8' encType="multipart/form-data" onSubmit={handleSubmit}>
                <div className='flex flex-col md:flex-row gap-4'>
                    <div className='flex flex-col'>
                        {imageContent}
                        <FormInput
                            type='file'
                            name='image'
                            accept="image/png, image/jpeg"
                            id='officer-img'
                            className=' hidden'
                            onChange={handleFileChange} />
                        <label htmlFor='officer-img' className='text-center cursor-pointer bg-dark_font text-white px-2 py-1 rounded-md shadow-md hover:shadow-none'>Upload photo</label>
                    </div>
                    <div className='flex flex-col gap-4 w-full'>
                        <FormInput placeholderName={'First Name'} name='firstname' value={titleCase(formSelector.firstname) || ''} type='text' onChange={handleInputChange} error={formErrors.firstname} />
                        <FormInput placeholderName={'Middle Name'} name='middlename' value={titleCase(formSelector.middlename) || ''} type='text' onChange={handleInputChange} />
                        <FormInput placeholderName={'Last Name'} name='lastname' value={titleCase(formSelector.lastname) || ''} type='text' onChange={handleInputChange} error={formErrors.lastname} />
                        <div>
                            <div className='flex gap-4'>
                                <p>Sex: </p>
                                <div>
                                    <input className='peer hidden' type='radio' id='sex-male' name='sex' value='male' checked={formSelector.sex == 'male'} onChange={handleInputChange} />
                                    <label htmlFor='sex-male' className='cursor-pointer border border-light_font text-light_font peer-checked:bg-dark_font peer-checked:text-white px-4 py-2 rounded-md'>Male</label></div>
                                <div>
                                    <input className='peer hidden' type='radio' id='sex-female' name='sex' value='female' checked={formSelector.sex == 'female'} onChange={handleInputChange} />
                                    <label htmlFor='sex-female' className='cursor-pointer border border-light_font text-light_font peer-checked:bg-dark_font peer-checked:text-white px-4 py-2 rounded-md'>Female</label>
                                </div>

                            </div>
                            {formErrors.sex && <p className='text-red-500 px-2'>{formErrors.sex}</p>}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-4'>
                    <FormInput placeholderName={'Username'} name='username' type='text' value={formSelector.username || ''} onChange={handleInputChange} error={formErrors.username} />
                    <FormInput placeholderName={'Birthdate'} name='birthdate' type='date' value={formSelector.birthdate} onChange={handleInputChange} error={formErrors.birthdate} />
                    <FormInput placeholderName={'Mobile No.'} name='mobile_num' type='number' value={formSelector.mobile_num || ''} onChange={handleInputChange} error={formErrors.mobile_num}  />
                    <FormInput placeholderName={'Email Address.'} name='email' type='email' value={formSelector.email || ''} onChange={handleInputChange} error={formErrors.email}  />
                </div>
                <div className='grid md:grid-cols-3 lg:grid-cols-4 gap-4'>

                    <FormInput placeholderName={'Street'} name='street' type='text' value={titleCase(formSelector.street) || ''} onChange={handleInputChange} error={formErrors.street}  />
                    <FormInput placeholderName={'Barangay'} value='Batasan Hills' readOnly name='barangay' type='text' />
                    <FormInput placeholderName={'City'} value='Quezon City' readOnly name='city' type='text' />
                    <FormInput placeholderName={'Zip'} value='1126' readOnly name='zip' type='number' />
                </div>
                <div className='flex justify-end'>
                    <button className='px-4 py-2 bg-dark_font rounded-md text-white shadow-lg hover:shadow-none w-full md:w-fit' disabled={isPending}>{isPending ? 'Submitting...' : 'Submit'}</button>
                </div>
            </form>
        </div>


    return (
        <>
            <Modal ref={dialog} onClose={handleModalClose} >

                <div className='flex mb-8 items-center gap-2'>
                    <DoneSharpIcon fontSize='large' sx={{ color: '#204d2c' }} />
                    <h2 className='text-dark_font'>Success</h2>
                </div>
                <p className=' max-w-[36rem] w-96 text-lg'>
                    Data saved successfully!
                </p>
                <div className='mt-8 flex gap-2 justify-end'>
                    <button onClick={handleModalClose} className='bg-dark_font hover:bg-light_font rounded-md px-4 py-1 text-white' >Ok</button>
                </div>
            </Modal>
            <div>
                <NavLink to='../active'>
                    <ArrowBackSharpIcon />
                </NavLink>
            </div>
            {isError && <ErrorBlock message={error.info?.errors || ['Failed to save data.']} />}
            {content}
        </>
    )
}

export default CrreateOfficer