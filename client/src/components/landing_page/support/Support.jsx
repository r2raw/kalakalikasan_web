import React from 'react'
import wavedSvg from '../../../assets/images/wave-haikei.svg'
import phone_img from '../../../assets/images/phone_img.png'
import FeedbackForm from './FeedbackForm'
function Support() {
  return (
    <>
      <div className='mb-20'>
        <img className=' w-full -z-10 absolute  left-0 top-0 lg:top-32 xl:top-28' src={wavedSvg} alt='svg wave' />
        <div className='pt-64 px-8  lg:pt-40 lg:px-20  xl:pt-40 xl:px-32' >
          <div className='relative  xl:w-1/3  flex flex-col gap-2 text-white  lg:text-dark_font'>
            <h1 className='text-lg xl:text-3xl'>We value your feedback!</h1>
            <p className='text-sm text-white xl:text-lg lg:text-light_font'> At KalaKalikasan, we are committed to making waste management easier, more efficient, and environmentally sustainable. We value your opinions and suggestions to improve our app and services. Whether it’s a feature request, a bug report, or general feedback, your input helps us make KalaKalikasan better for everyone. Please take a moment to share your thoughts with us! </p>
          </div>
        </div>
      </div>
      <div className='pb-40'>
        <FeedbackForm />
        <img src={phone_img} alt='phone_img' className='hidden absolute right-20 lg:block md:top-80 lg:top-72 md:h-[40rem] lg:w-1/2 xl:w-1/3 xl:h-3/4' />
      </div>
    </>
  )
}

export default Support