import React from 'react'
import EuroSymbolSharpIcon from '@mui/icons-material/EuroSymbolSharp';
function ServiceCard({ message, icon, title }) {
  return (
    <div className='shadow-md bg-[#ebffe1] relative px-10 pt-[80px] pb-[40px]  rounded-md'>
      <h2 className='text-center mb-4 text-secondary_color'>{title}</h2>
      <div className='rounded-full bg-dark_font w-24 h-24 lg:w-32 lg:h-32 flex justify-center items-center -top-[50px]  text-white text-4xl absolute shadow-xl left-1/2 -translate-x-1/2'>
        <img src={icon} className='w-full h-full' />
      </div>

      <p>{message}</p>
    </div>
  )
}

export default ServiceCard