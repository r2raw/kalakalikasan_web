
import FormInput from '../../models/FormInput'
import CustomTextArea from '../../models/CustomTextArea'
import { postsActions } from '../../../store/slices/postsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { uid } from 'uid';

import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { imageChangeHandler, imageChangingEffect, multiImageChangeHandler, multiImageChangingEffect } from '../../../myFunctions/myFunctions';

function CreatePosts() {
  // const [images, setImages] = useState([]);
  // const [images, setImages] = useState();
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState();
  const fileInputRef = useRef(null);
  const selector = useSelector((state) => state.posts);
  const medias = selector.medias;
  console.log(selector.medias)
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(postsActions.addPostChange({ ...selector, [name]: value }))

  }

  const selectFile = () => {
    fileInputRef.current.click();

  }
  const onFileSelect = (e) => {
    const { files } = e.target;
    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split('/')[0] !== 'image') continue;

      if (!medias.some((e) => e.name === files[i].name)) {
        dispatch(postsActions.addMedias({
          id: uid(),
          name: files[i].name,
          imgUrl: URL.createObjectURL(files[i]),
        }))
      }
    }

    // imageChangeHandler(e, setImage)
    // multiImageChangeHandler(e, setImages)



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

      if (!medias.some((e) => e.name === files[i].name)) {
        dispatch(postsActions.addMedias({
          id: uid(),
          name: files[i].name,
          imgUrl: URL.createObjectURL(files[i]),
        }))
      }
    }
  }
  // useEffect(() => {
  //   const objectUrl = multiImageChangingEffect(image);
  //   if (image) {
  //     const imgId = uid();

  //     dispatch(postsActions.addMedias({ id: imgId, imageUrl: objectUrl }))
  //     // setPreviews((prev) =>[...prev, {id: imgId , imageUrl :objectUrl}])
  //     for (let i = 0; i < objectUrl.length; i++) {
  //       return () => {
  //         URL.revokeObjectURL(objectUrl[i]);
  //       };
  //     }
  //   }
  // }, [image]);


  const removeImage = (id) => {

    dispatch(postsActions.removeMedia(id))
  };

  let dndContent = <h2 className='text-light_font text-center text-lg md:text-xl lg:text-3xl '>Drag & drop or browse an image here.</h2>

  if (isDragging) {
    dndContent = <h2 className='text-light_font'>Drop image here</h2>
  }

  return (
    <>
      <form className='my-card bg-white grid gap-4 px-8 py-8'>
        <h2 className='text-dark_font'>Create post</h2>
        <div className='grid gap-8'>
          <FormInput type='text' placeholderName='Title' onChange={handleChange} name='title' val={selector.title} />
          <CustomTextArea placeholderName='Description' onChange={handleChange} name='description' val={selector.description} />
          <div className='w-full border-dashed border-2 min-h-40 rounded-md border-dark_font select-none flex justify-center items-center cursor-pointer'
            onClick={selectFile}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}>
            {dndContent}
            <input ref={fileInputRef} className='hidden' type='file' multiple onChange={onFileSelect} />
          </div>
          <div className='flex gap-4'>
            {medias.map((image, index) => {

              const isEven = index % 2 == 0

              let classes = 'bg-slate-400 w-20 h-20 rounded-md shadow-lg relative flex justify-center items-center'

              if(isEven){
                classes = classes + ' -rotate-6'
              }

              if(!isEven){
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

        </div>
      </form>
    </>
  )
}

export default CreatePosts