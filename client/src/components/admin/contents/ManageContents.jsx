import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import ContentContainer from './ContentContainer'
function ManageContents() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-end'>
        <button className='bg-blue_btn text-white px-4 py-2 rounded-xl'>Create posts</button>
      </div>
      <div className='card'>
        <div className='px-8 flex-col w-full '>
          <div className='flex gap-4 mb-4'>
            <button className='px-4 py-1 rounded-2xl border-dark_font border'>All</button>
            <button className='px-4 py-1 rounded-2xl border-dark_font border'>News & Article</button>
            <button className='px-4 py-1 rounded-2xl border-dark_font border'>Announcements</button>
            <button className='px-4 py-1 rounded-2xl border-dark_font border'>Guides</button>
          </div>
          <div className='w-full flex flex-col gap-16'>
            <ContentContainer header='News & Article' />
            <ContentContainer header='Announcements' />
            <ContentContainer header='Guides' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageContents