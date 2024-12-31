import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import ContentContainer from './ContentContainer'
function ManageContents() {
  return (
    <div className='flex flex-col gap-4 relative'>
      <div className='flex flex-end'>
        <Link to='add' className='bg-blue_btn text-white px-4 py-2 rounded-xl'>Create posts</Link>
      </div>
      <div className='my-card bg-white py-8'>
        <div className='px-2 lg:px-8 flex-col w-full '>
          <div className='grid grid-cols-2 lg:flex gap-2 lg:gap-4 mb-4 sticky top-0 bg-white py-2 lg:py-4'>
            <button className='px-2 lg:px-4 py-1 rounded-2xl border-dark_font text-sm lg:text-lg border'>All</button>
            <button className='px-2 lg:px-4 py-1 rounded-2xl border-dark_font text-sm lg:text-lg  border'>News & Article</button>
            <button className='px-2 lg:px-4 py-1 rounded-2xl border-dark_font text-sm lg:text-lg  border'>Announcements</button>
            <button className='px-2 lg:px-4 py-1 rounded-2xl border-dark_font text-sm lg:text-lg  border'>Guides</button>
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