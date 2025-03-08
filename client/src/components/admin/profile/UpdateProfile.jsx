import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ProfileInfo from './ProfileInfo';
import ChangePass from './ChangePass';
import { useMutation } from '@tanstack/react-query';
import { editUser, queryClient } from '../../../util/http';

function UpdateProfile() {

  const [selectedMode, setSelectedMode] = useState('update');

  const handleRadioChange = (e) => {
    const { value } = e.target
    console.log(value)
    setSelectedMode(value)

  }

  let content = <ProfileInfo />

  if(selectedMode == 'confirmPass'){
    content = <ChangePass/>
  }
  return (
    <div className='mt-4'>
      <div className='grid grid-cols-2'>
        <div className="w-full">
          <input className="hidden peer" type="radio" name="user-info" id="update" value="update" checked={selectedMode === 'update'} onChange={handleRadioChange} />
          <label htmlFor="update" className="block text-smm md:text-md rounded-l-md w-full text-center cursor-pointer  px-1 lg:px-4  py-2 border border-gray-300 peer-checked:bg-accent_color peer-checked:text-white">
            Update info
          </label>
        </div>

        {/* Change Password */}
        <div className="w-full">
          <input className="hidden peer" type="radio" name="user-info" id="confirmPass" value="confirmPass" checked={selectedMode === 'confirmPass'} onChange={handleRadioChange} />
          <label htmlFor="confirmPass" className="block text-smm md:text-md rounded-r-md w-full text-center cursor-pointer px-1 lg:px-4 py-2 border border-gray-300 peer-checked:bg-accent_color peer-checked:text-white">
            Change password
          </label>
        </div>
      </div>
      {content}
    </div>
  )
}

export default UpdateProfile