import React from 'react'
import wavedSvg from '../../../assets/images/wave-haikei.svg'
import FormInput from '../../models/FormInput'
import CustomTextArea from '../../models/CustomTextArea'
function Support() {
  return (
    <>
      <div className='mb-20'>
        <img className=' w-full -z-10 absolute top-32 left-0 xl:top-0 ' src={wavedSvg} alt='svg wave' />
        <div className='pt-64 px-8 md:pt-40 lg:px-20  xl:pt-32 xl:px-32' >
          <div className='relative  xl:w-1/3  flex flex-col gap-2 text-white md:text-dark_font lg:text-red-400'>
            <h1 className='text-lg xl:text-3xl'>We value your feedback!</h1>
            <p className='text-sm text-white md:text-dark_font xl:text-lg'> At KalaKalikasan, we are committed to making waste management easier, more efficient, and environmentally sustainable. We value your opinions and suggestions to improve our app and services. Whether it’s a feature request, a bug report, or general feedback, your input helps us make KalaKalikasan better for everyone. Please take a moment to share your thoughts with us! </p>
          </div>
        </div>
      </div>
      <form className='ml-20 relative z-50 bottom-8 w-1/3 bg-slate-100/10 rounded-md my-card px-4 py-8 backdrop-blur-md flex flex-col gap-6'>
        <FormInput placeholderName={'Name'} />
        <FormInput placeholderName={'Email'} />
        <CustomTextArea placeholderName='Share your thoughts' />
      </form>
    </>
  )
}

export default Support