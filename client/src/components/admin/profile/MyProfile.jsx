import React, { useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import img1 from '../../../assets/images/OIP.jpg'
import { useSelector } from 'react-redux'
import { titleCase } from 'title-case'
import AdminInfoCard from './AdminInfoCard'
import RecentActivities from './RecentActivities'

function MyProfile() {
  return (
    <>
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>
        <div className='  w-full'>
          <AdminInfoCard />
        </div>
        <RecentActivities />
      </div>
    </>
  )
}

export default MyProfile