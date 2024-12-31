import React from 'react'
import FormInput from '../../models/FormInput'

function CreatePosts() {
  return (
    <>
      <form className='my-card bg-white grid gap-4 px-8 py-8'>
        <h2 className='text-dark_font'>Create post</h2>
        <div className='grid gap-8'>
          <FormInput type='text' placeholderName='Title' />
          <FormInput type='text' placeholderName='Description' textArea />
          
        </div>
      </form>
    </>
  )
}

export default CreatePosts