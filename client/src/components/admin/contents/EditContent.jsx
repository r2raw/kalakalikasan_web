import React, { useEffect, useState } from 'react'
import { fetchContentId } from '../../../util/http';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import EditableImageContent from './EditableImageContent';
import CustomLoader from '../../models/CustomLoader';
import { FormInput } from 'lucide-react';
import { imageChangeHandler } from '../../../myFunctions/myFunctions';

function EditContent() {
    const [contentImages, setContentImages] = useState([]);


    const { id } = useParams();
    const [image, setImage] = useState();
    const { data, isPending, isError, error } = useQuery({
        queryKey: ["contents", id, 'edit'],
        queryFn: ({ signal }) => fetchContentId({ signal, id }),
        staleTime: 5000,
        gcTime: 30000,
        refetchInterval: 5000,
    });

    useEffect(() => {
        if (data && data.images) {
            setContentImages(data.images);
        }
    }, [data])


    const handleFileChange = (e) => {
        imageChangeHandler(e, setImage)
    }

    const removeImage = (id)=>{
        setContentImages((prev)=>{

            const updatedImages = prev.filter(img => img.imageId != id);

            return updatedImages;
        })
    }

    let imageContent = <p>No images found</p>

    if (isPending) {
        imageContent = <CustomLoader />
    }
    if (data) {
        const { contentData } = data;
    }

    if (contentImages.length > 0) {

        imageContent = <div className='card flex flex-col gap-4'>
            <EditableImageContent images={contentImages} />

            {contentImages.length < 5 && <>
            <FormInput
                type='file'
                name='image'
                accept="image/png, image/jpeg"
                id='content-image'
                className=' hidden'
                onChange={handleFileChange} />
                <label htmlFor='content-image' className='text-center cursor-pointer bg-dark_font text-white px-2 py-1 rounded-md shadow-md hover:shadow-none'>Add image</label>
            </>}
        </div>
    }

    if (contentImages.length <= 0) {
        imageContent = <div className='card flex flex-col gap-4'>

            <FormInput
                type='file'
                name='image'
                accept="image/png, image/jpeg"
                id='content-image'
                className=' hidden'
                onChange={handleFileChange} />
            <label htmlFor='content-image' className='text-center cursor-pointer bg-dark_font text-white px-2 py-1 rounded-md shadow-md hover:shadow-none'>Add image</label>
        </div>
    }
    return (
        <div className='flex gap-4'>
            <div className='w-3/5'>
                {imageContent}
            </div>
        </div>
    )
}

export default EditContent