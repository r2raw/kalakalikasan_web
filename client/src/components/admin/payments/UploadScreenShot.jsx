import React, { useEffect, useState } from 'react'
import FormInput from '../../models/FormInput'
import { imageChangeHandler, imageChangingEffect } from '../../../myFunctions/myFunctions';

function UploadScreenShot() {

    const [preview, setPreview] = useState();
    const [image, setImage] = useState();

    useEffect(() => {
        imageChangingEffect(image, setPreview);
    }, [image]);

    const handleFileChange = (e) => {
        imageChangeHandler(e, setImage)

    }

    let imageContent =
        <div className='w-full h-80 flex items-center justify-center'>
            <p className='text-center'>Please attach a payment proof screenshot</p>
        </div>


    if (preview) {
        imageContent = <div className='w-full md:w-56 h-80 bg-slate-400 rounded-md shadow-lg hover:shadow-none'>
            {preview.map((pic) => <img key={pic} src={pic} alt='user-img' className='h-full w-full rounded-md' />)}
        </div>;
    }

    return (
        <div>
            <form className='card flex flex-col gap-4'>{imageContent}
                <FormInput
                    type='file'
                    name='image'
                    accept="image/png, image/jpeg"
                    id='payment-image'
                    className=' hidden'
                    onChange={handleFileChange} />

                <label htmlFor='payment-image' className='text-center cursor-pointer bg-accent_color hover:bg-dark_font text-white px-2 py-1 rounded-md shadow-md hover:shadow-none'>Upload photo</label>

                {preview && <button className='bg-accent_color hover:bg:secondary_color text-white px-4 py-1 rounded-md'>Submit</button>}
            </form>

        </div>
    )
}

export default UploadScreenShot