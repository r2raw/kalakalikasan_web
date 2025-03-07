import React, { useEffect, useRef, useState } from 'react'
import FormInput from '../../models/FormInput'
import { editPost, queryClient } from '../../../util/http';
import { useMutation } from '@tanstack/react-query';
import CustomTextArea from '../../models/CustomTextArea';
import { contentFormValidation, isObjEmpty } from '../../../util/validations';
import { useNavigate, useParams } from 'react-router-dom';
import { titleCase } from 'title-case';
import ErrorSingle from '../../models/ErrorSingle';
import DoneSharpIcon from '@mui/icons-material/DoneSharp';
import Modal from '../../models/ui/Modal';

function ContentEditForm({ data }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const dialog = useRef(null)
    const [postData, setPostData] = useState({ title: '', description: '', type: '' })

    const [formError, setFormError] = useState({});
    const { mutate, isPending: isMutating, isError: isMutateError, error: mutateError } = useMutation(
        {
            mutationFn: editPost,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['contents'] });
                dialog.current.open()
            },
        },
    )
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostData(prev => ({
            ...prev,
            [name]: value

        }))

    }

    useEffect(() => {
        if (data) {
            console.log(data.title)
            setPostData({
                title: data.title,
                description: data.description,
                type: data.type,
            })
        }
    }, [data])
    let selectionPlaceholder = 'translate-y-1/2'

    if (postData.type !== '') {
        selectionPlaceholder = ' scale-75 -translate-y-1/2 -translate-x-7'
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const errorFormObj = contentFormValidation(postData);

        const isFormValid = isObjEmpty(errorFormObj);

        if (!isFormValid) {
            return setFormError(errorFormObj)
        }
        const formData = new FormData();
        formData.append('description', postData.description)
        formData.append('type', postData.type)
        formData.append('title', postData.title)
        formData.append('userId', localStorage.getItem('id'))
        formData.append('contentId', id)

        mutate({ data: formData })
    }

    const handleModalClose = () => {
        navigate('../../contents');

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

            <h4 className="bg-dark_font py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white">
                Update content
            </h4>
            <div className='card px-2'>
                <form onSubmit={handleSubmit} className='w-full flex flex-col gap-6'>
                    <FormInput type='text' placeholderName='Title' onChange={handleChange} name='title' maxLength='50' value={titleCase(postData.title)} error={formError.title} />
                    <CustomTextArea placeholderName='Description' onChange={handleChange} name='description' val={postData.description} error={formError.description} />
                    <div>
                        <div className='relative  shadow-md h-10 text-light_font'>
                            <select name='type' onChange={handleChange} value={postData.type} className='  h-full  w-full outline-none'>
                                <option value=''></option>
                                <option value='news & articles'>News & Articles</option>
                                <option value='announcements'>Announcements</option>
                                <option value='guides'>Guides</option>
                            </select>
                            <label className={`pointer-events-none absolute left-2 -top-1/2 duration-300 ${selectionPlaceholder}`}>Select content type...</label>
                        </div>
                        {formError.type && <p className='text-red-500 px-2'>{formError.type}</p>}
                    </div>
                    <button className='bg-accent_color hover:bg-secondary_color rounded-md text-white py-2' disabled={isMutating}>{isMutating ? 'Submitting...' : 'Submit'}</button>
                    {isMutateError && <ErrorSingle message={mutateError.info?.error || 'An error occured'} />}
                </form>
            </div>
        </>
    )
}

export default ContentEditForm