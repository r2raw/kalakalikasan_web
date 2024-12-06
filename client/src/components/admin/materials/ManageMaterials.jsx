import React from 'react'
import MaterialsContainer from './MaterialsContainer'

function ManageMaterials() {
  return (
    <div className='flex flex-col gap-4'>
        <button className='bg-blue_btn self-end text-white px-4 py-2 rounded-xl'>Create materials</button>
      <div className='card'>
        <div className='px-8 flex-col w-full '>
          <div className='flex gap-4 mb-4'>
            <button className='px-4 py-1 rounded-2xl border-dark_font border'>All</button>
            <button className='px-4 py-1 rounded-2xl border-dark_font border'>Plastics</button>
            <button className='px-4 py-1 rounded-2xl border-dark_font border'>Metals</button>
            <button className='px-4 py-1 rounded-2xl border-dark_font border'>Papers</button>
          </div>
          <div className='w-full flex flex-col gap-16'>
            <MaterialsContainer header={'Plastics'} />
            <MaterialsContainer header={'Papers'} />
            <MaterialsContainer header={'Metals'} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageMaterials