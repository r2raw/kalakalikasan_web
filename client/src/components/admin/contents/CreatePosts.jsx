
import FormInput from '../../models/FormInput'
import CustomTextArea from '../../models/CustomTextArea'
import { useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import { uid } from 'uid';

import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { useMutation } from '@tanstack/react-query';
import { createPost, queryClient } from '../../../util/http';
import Modal from '../../models/ui/Modal';
import DoneSharpIcon from '@mui/icons-material/DoneSharp';
import { useNavigate } from 'react-router-dom';
import ErrorBlock from '../../models/ErrorBlock'
import { contentFormValidation, isObjEmpty } from '../../../util/validations';

function CreatePosts() {
  const [isDragging, setIsDragging] = useState();
  const fileInputRef = useRef(null);
  const navigate = useNavigate()
  const dialog = useRef(null);
  const [postData, setPostData] = useState({ title: '', description: '', type: '', medias: [] })
  const [formError, setFormError] = useState({});
  const { mutate, isPending, isError, error } = useMutation(
    {
      mutationFn: createPost,
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

  const selectFile = () => {
    fileInputRef.current.click();

  }
  const onFileSelect = (e) => {
    const { files } = e.target;
    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split('/')[0] !== 'image') continue;

      if (!postData.medias.some((e) => e.name === files[i].name)) {
        const imgId = uid()

        const fileObj = {
          id: imgId,
          name: files[i].name,
          imgUrl: URL.createObjectURL(files[i]),
          file: files[i]

        }

        setPostData(prev => {
          return ({
            ...prev,
            medias: [fileObj, ...prev.medias]
          })
        })
      }
    }



  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
    e.dataTransfer.dropEffect = 'copy';

  }

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);

  }

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;

    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split('/')[0] !== 'image') continue;

      if (!postData.medias.some((e) => e.name === files[i].name)) {
        const imgId = uid()
        const fileObj = {
          id: imgId,
          name: files[i].name,
          imgUrl: URL.createObjectURL(files[i]),
          file: files[i]

        }

        setPostData(prev => {
          return ({
            ...prev,
            medias: [fileObj, ...prev.medias]
          })
        })
      }
    }
  }


  const removeImage = (id) => {

    setPostData(prev => {
      const newMedia = prev.medias.filter(file => file.id !== id)
      return { ...prev, medias: newMedia }
    })

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // dialog.current.open();

    const errorFormObj = contentFormValidation(postData);

    const isFormValid = isObjEmpty(errorFormObj);

    if (!isFormValid) {
      return setFormError(errorFormObj)
    }
    const formData = new FormData();

    formData.append('description', postData.description)
    formData.append('type', postData.type)
    formData.append('title', postData.title)
    formData.append('created_by', localStorage.getItem('id'))
    postData.medias.forEach((image) => {
      formData.append('uploadedFiles', image.file)
    })

    // let data = Object.fromEntries(formData);
    // console.log('FormData before mutation:', data);

    mutate({ data: formData })

  }
  const handleModalClose = () => {
    navigate('..');

  }

  // console.log(medias)
  let dndContent = <h2 className='text-light_font text-center text-lg md:text-xl lg:text-3xl '>Drag & drop or browse an image here.</h2>

  if (isDragging) {
    dndContent = <h2 className='text-light_font'>Drop image here</h2>
  }

  if (isError) {
    console.log(error)
  }

  let selectionPlaceholder = 'translate-y-1/2'

  if (postData.type !== '') {
    selectionPlaceholder = ' scale-75 -translate-y-1/2 -translate-x-7'
  }


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
          <button onClick={handleModalClose} className='bg-dark_font hover:bg-light_font rounded-md px-4 py-1 text-white'>Ok</button>
        </div>
      </Modal>
      {isError && <ErrorBlock message={error.info?.errors || ['Failed to save data.']} />}
      <form className='my-card bg-white grid gap-4 px-8 py-8' onSubmit={handleSubmit}>
        <h2 className='text-dark_font'>Create post</h2>
        <div className='grid gap-8'>
          <FormInput type='text' placeholderName='Title' onChange={handleChange} name='title' maxLength='50' val={postData.title} error={formError.title} />
          <CustomTextArea placeholderName='Description' onChange={handleChange} name='description' val={postData.description} error={formError.description} />
          <div>
            <div className='relative  shadow-md h-10 text-light_font'>
              <select name='type' onChange={handleChange} className='  h-full  w-full outline-none'>
                <option value=''></option>
                <option value='news & articles'>News & Articles</option>
                <option value='announcements'>Announcements</option>
                <option value='guides'>Guides</option>
              </select>
              <label className={`pointer-events-none absolute left-2 -top-1/2 duration-300 ${selectionPlaceholder}`}>Select content type...</label>
            </div>
            {formError.type && <p className='text-red-500 px-2'>{formError.type}</p>}
          </div>
          <div className='w-full border-dashed border-2 min-h-40 rounded-md border-dark_font select-none flex justify-center items-center cursor-pointer'
            onClick={selectFile}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}>
            {dndContent}
            <input ref={fileInputRef} className='hidden' name='uploadedFiles' type='file' multiple onChange={onFileSelect} />
          </div>
          <div className='flex gap-4'>
            {postData.medias.map((image, index) => {

              const isEven = index % 2 == 0

              let classes = 'bg-slate-400 w-20 h-20 rounded-md shadow-lg relative flex justify-center items-center'

              if (isEven) {
                classes = classes + ' -rotate-6'
              }

              if (!isEven) {
                classes = classes + ' rotate-6'
              }

              return (
                <div key={image.id} className={classes}>
                  <button className='absolute top-1 right-1 text-dark_font' onClick={() => { removeImage(image.id) }}><CloseSharpIcon /></button>
                  <img src={image.imgUrl} className='w-full h-full rounded-md object-fit' />
                </div>
              )
            })}
          </div>
          <button className='bg-accent_color text-white rounded-md py-2 hover:bg-dark_font' disabled={isPending}>{isPending ? 'Submitting' : 'Submit'}</button>

        </div>
      </form>
    </>
  )
}

export default CreatePosts