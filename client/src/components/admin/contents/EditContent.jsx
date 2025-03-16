import React, { useEffect, useRef, useState } from 'react'
import { addImage, fetchContentId, queryClient } from '../../../util/http';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import EditableImageContent from './EditableImageContent';
import CustomLoader from '../../models/CustomLoader';
import { imageChangeHandler } from '../../../myFunctions/myFunctions';
import FormInput from '../../models/FormInput'
import ErrorSingle from '../../models/ErrorSingle';
import ContentEditForm from './ContentEditForm';
import { IconButton } from '@mui/material';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';

function EditContent() {
    const [contentImages, setContentImages] = useState([]);
    const formRef = useRef(null)

    const { id } = useParams();

    const navigate = useNavigate()

    const { data, isPending, isError, error } = useQuery({
        queryKey: ["contents", id, 'edit'],
        queryFn: ({ signal }) => fetchContentId({ signal, id }),
        staleTime: 5000,
        gcTime: 30000,
        refetchInterval: 5000,
    });

    const { mutate, isPending: isMutating, isError: isMutateError, error: mutateError } = useMutation(
        {
            mutationFn: addImage,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['contents', id] });
            },
        },
    )
    useEffect(() => {
        if (data && data.images) {
            setContentImages(data.images);
        }
    }, [data])


    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            console.log("Image selected:", file.name);
            // ✅ Auto-submit when an image is 
            formRef.current?.requestSubmit();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let data = Object.fromEntries(formData);
        data = { ...data, id: localStorage.getItem('id'), contentId: id };
        mutate({ data })
    }


    const removeImage = (id) => {

        setContentImages(prev => {
            const updatedImages = prev.filter(item => item.imageId != id)

            return updatedImages;
        })
    }
    let imageContent = <p>No images found</p>
    let content = <p>No content found</p>

    const handleBack = () => {
        navigate('..')
    }
    if (isPending) {
        imageContent = <CustomLoader />
        content = <CustomLoader />
    }

    if (contentImages.length > 0) {

        imageContent = <div className='card flex flex-col gap-4'>
            <EditableImageContent images={contentImages} removeImage={removeImage} />

            {contentImages.length < 5 && <>
                <form onSubmit={handleSubmit} ref={formRef}>
                    <FormInput
                        type='file'
                        name='image'
                        accept="image/png, image/jpeg"
                        id='content-image'
                        className=' hidden'
                        onChange={handleFileChange} />

                    {isMutating && <p className='text-center'>Loading...</p>}
                    {!isMutating && <label htmlFor='content-image' className='text-center cursor-pointer py-2 bg-accent_color hover:bg-secondary_color text-white px-2  rounded-md shadow-md hover:shadow-none'>Add image</label>}
                </form>
            </>}
        </div>
    }

    if (contentImages.length <= 0) {
        imageContent = <div className='card flex flex-col gap-4'>
            <form onSubmit={handleSubmit} ref={formRef}>

                <FormInput
                    type='file'
                    name='image'
                    accept="image/png, image/jpeg"
                    id='content-image'
                    className=' hidden'
                    onChange={handleFileChange} />

                {isMutating && <p className='text-center'>Loading...</p>}
                {!isMutating && <label htmlFor='content-image' className='text-center cursor-pointer bg-accent_color hover:bg-secondary_color text-white px-2 py-2 rounded-md shadow-md hover:shadow-none'>Add image</label>}
            </form>
            {isMutateError && <ErrorSingle message={mutateError.info?.error || 'An error occured'} />}
        </div>
    }
    if (data) {
        content =
            <ContentEditForm data={data.contentData} />
    }

    return (
        <>

            {isError && <ErrorSingle message={error.info?.error || 'An error occured'} />}
            <IconButton onClick={handleBack} className='text-accent_color fill-accent_color'>
                <ArrowBackSharpIcon className="text-accent_color fill-current" />
            </IconButton>
            <div className='flex flex-col lg:flex-row gap-4'>
                <div className='lg:w-3/5'>
                    {imageContent}
                </div>
                <div className='lg:w-2/5 flex flex-col gap-4'>
                    {content}
                </div>
            </div>
        </>
    )
}

export default EditContent