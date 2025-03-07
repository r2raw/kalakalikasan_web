import React from 'react'
import { useSelector } from 'react-redux'
import { titleCase } from 'title-case'

function AdminInfoCard() {

    const selector = useSelector((state) => state.currentUser)
  
    const address = `${selector.street}, ${selector.barangay}, ${selector.city}`
  return (
    <div className='card flex flex-col w-full '>
      <p className='w-full'>Address: <strong>{titleCase(address)}</strong></p>
      <p className='w-full'>Mobile number: <strong>{selector.mobile_num}</strong></p>
      <p className='w-full'>Email: <strong>{selector.email}</strong></p>
      <p className='w-full'>Role: <strong>{selector.role}</strong></p>
    </div>
  )
}

export default AdminInfoCard