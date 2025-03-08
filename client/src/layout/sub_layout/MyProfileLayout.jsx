import React, { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { getURLString, imageChangeHandler, imageChangingEffect } from '../../myFunctions/myFunctions';
import { useMutation, useQuery } from '@tanstack/react-query';
import { changeImage, fetchUserData, queryClient } from '../../util/http';
import _ from 'lodash';
import Modal from '../../components/models/ui/Modal';
import { useSelector } from 'react-redux';
import { titleCase } from 'title-case';
import ErrorSingle from '../../components/models/ErrorSingle';

function MyProfileLayout() {

    const dialog = useRef()
    const location = useLocation();

    const [preview, setPreview] = useState();
    const [image, setImage] = useState();

    const selector = useSelector((state) => state.currentUser)
    const userId = localStorage.getItem('id');
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['user', { id: userId }],
        queryFn: ({ signal }) => fetchUserData({ signal, id: userId }),

    })

    const { mutate, isPending: isMutating, isError: isMutateError, error: mutateError } = useMutation(
        {
            mutationFn: changeImage,
            onSuccess: () => {
                setPreview(null)
                queryClient.invalidateQueries({ queryKey: ['user'] });
                dialog.current.close()
            },
        },
    )

    useEffect(() => {
        imageChangingEffect(image, setPreview);
    }, [image]);

    const handleFileChange = (e) => {
        imageChangeHandler(e, setImage)

    }


    const currLoc = getURLString(location)

    let linkContent = <Link to='update-profile' className='text-smm md:text-sm'>
        <p>{"Update profile >>"}</p>
    </Link>

    if (currLoc == 'update-profile') {
        linkContent = <Link to='./' className='text-smm md:text-sm'>
            <p>{'<< Go back to profile'}</p>
        </Link>
    }
    let bannerText = 'Mr. Administrator Admin'
    let imageContent = '';

    if (isPending) {
        bannerText = 'Loading...'
    }

    if (isError) {
        bannerText = error.info?.errors[0] || 'Error fetching user name'
    }

    if (data) {
        const { firstname, lastname, sex } = data;
        bannerText = `${sex == 'male' ? 'Mr.' : 'Ms.'} ${_.startCase(firstname)} ${_.startCase(lastname)}`

        if (data.image) {
            imageContent = <img src={`${import.meta.env.VITE_BASE_URL}/userImg/${data.image}`} className='rounded-full object-cover w-full h-full' alt='profile' />
        } else {
            imageContent = <p className='text-[50px] w-full text-center'>{titleCase(firstname.substring(0, 1)) + titleCase(lastname.substring(0, 1))}</p>
        }
    }

    const handleClick = () => {
        dialog.current.open()
    }

    const handleCloseModal = () => {
        dialog.current.close()
    }

    const handleSubmit= (e)=>{
        e.preventDefault()
        const formData = new FormData(e.target);
        let data = Object.fromEntries(formData);
        data = { ...data, id: localStorage.getItem('id') };
        mutate({ data })

    }

    return (
        <>
            <Modal ref={dialog} onClose={handleCloseModal}>
                <div className='h-[40dvh] flex flex-col gap-4 items-center justify-center'>
                    <h3 className='text-center text-secondary_color'>Upload a new image that best represents you. </h3>
                    <div className='w-96 h-1/2 flex justify-center items-center bg-neutral-400/10 rounded-md'>
                        <div className='bg-neutral-400 shadow-cardShadow w-40 h-40 rounded-full flex items-center justify-center' >
                            {preview &&  preview.map((pic) => <img key={pic} src={pic} alt='user-img' className='h-full w-full rounded-full' />)}
                            {!preview && imageContent}
                        </div>
                    </div>
                    <form className='w-full flex flex-col gap-4' onSubmit={handleSubmit}>
                        <input type='file' onChange={handleFileChange} name='image' id='profile' className='hidden' accept="image/png, image/gif, image/jpeg" />
                        <label htmlFor='profile' className='w-full block text-center cursor-pointer bg-accent_color text-white px-2 py-2 rounded-md hover:bg-secondary_color'>Upload photo</label>
                        {preview && <button className=' bg-accent_color w-full text-white px-2 py-2 rounded-md hover:bg-secondary_color' disabled={isMutating}>{isMutating ? 'Submitting...' :'Submit'}</button>}
                    </form>
                </div>
                {isMutateError &&  <ErrorSingle message={mutateError.info?.error || 'An error occured'} />}
            </Modal>
            <div className=' -z-50'>

                <div className={`rounded-md px-4 py-8 relative textured-bg  text-dark_font  mb-12`}>

                    <h1 className='text-lg md:text-2xl lg:text-4xl'> Welcome,</h1>
                    <h3 className='text-sm md:text-lg lg:text-2xl'>{bannerText}</h3>
                    <div className='w-60'>
                        {linkContent}
                    </div>
                    <div className='bg-neutral-400 shadow-cardShadow cursor-pointer w-20 h-20 md:w-40 md:h-40 rounded-full absolute right-2 flex items-center justify-center -bottom-4 md:right-4 md:top-4' onClick={handleClick}>{imageContent}</div>
                </div>
                <Outlet />
            </div>
        </>
    )
}

export default MyProfileLayout