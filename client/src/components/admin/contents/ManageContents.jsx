import React, { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import ContentContainer from './ContentContainer'
import { useQuery } from '@tanstack/react-query'
import { fetchContent } from '../../../util/http'
import { titleCase } from 'title-case'
import SearchOffSharpIcon from '@mui/icons-material/SearchOffSharp';
import loader from '../../../assets/gifs/bigSpinner.svg'
import SuccessBlock from '../../models/SuccessBlock'
import { useSelector } from 'react-redux'
function ManageContents() {

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['contents'],
    queryFn: ({ signal }) => fetchContent({ signal }),
    staleTime: 30000
  })

  const selector = useSelector((state)=> state.ui.successMessage)
  console.log(selector)

  const [selectedFilter, setSelectedFilter] = useState('');
  let contentData = null
  let contentFilters = null;

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setSelectedFilter(value);

  }

  if (isPending) {

    contentData =
      <div className='text-dark_font flex flex-col justify-center items-center h-[70dvh]'>
        <img src={loader} className='h-96' alt='loading-svg' />
      </div>
  }

  if (!isPending && (!data || Object.keys(data).length == 0)) {
    
    contentData =
      <div className='text-dark_font flex flex-col justify-center items-center'>
        <h1>No content found!</h1>
        <SearchOffSharpIcon
          style={{
            width: '30%', // Default size
            height: '20rem',
          }} />
      </div>
  }


  if (data && Object.keys(data).length != 0) {
    contentFilters = <div className='grid grid-cols-1 md:grid-cols-2 lg:flex gap-2 lg:gap-4 mb-4 sticky top-0 bg-white py-2 lg:py-4 z-50'>
      <div className='w-full lg:w-fit flex justify-center'>
        <input className='peer hidden' type='radio' name='content-filter' value='' checked={selectedFilter == ''} onChange={handleRadioChange} id='all-content' />
        <label htmlFor='all-content' className='cursor-pointer text-light_font peer-checked:text-base_color peer-checked:bg-accent_color border-accent_color border rounded-2xl px-2 w-full lg:px-4 py-1'>All</label>
      </div>
      {Object.keys(data).map((contentType) => {
        return (
          <div key={contentType} className='w-full flex justify-center lg:w-fit'>
            <input className='peer hidden' type='radio' name='content-filter' value={contentType} checked={selectedFilter == contentType} onChange={handleRadioChange} id={contentType} />
            <label htmlFor={contentType} className='cursor-pointer text-light_font peer-checked:text-base_color peer-checked:bg-accent_color border-accent_color border rounded-2xl w-full px-2 lg:px-4 py-1'>{titleCase(contentType)}</label>
          </div>
        )
      })}
    </div>
    contentData = <div className='w-full flex flex-col gap-16'>
      {Object.keys(data).map((contentType) => {
        console.log(contentType)
        return (
          <ContentContainer key={contentType} header={titleCase(contentType)} data={data[contentType]} />
        )
      })}
    </div>
    console.log(data)
    if (selectedFilter != '') {

      contentData = <div className='w-full flex flex-col gap-16'>
        {Object.keys(data).filter((contentType) => contentType == selectedFilter).map(contentType => <ContentContainer key={contentType} header={titleCase(contentType)} data={data[contentType]} />)}
      </div>
    }


  }

  return (
    <div className='flex flex-col gap-4 relative'>
      <div className='flex justify-end'>
        <Link to='./add' className='bg-accent_color hover:bg-dark_font text-white px-4 py-2 rounded-xl'>Create posts</Link>
      </div>
      <div className='my-card bg-white py-8 md:px-4'>
        {selector && <SuccessBlock message={selector} />}
        <div className='px-2 lg:px-8 flex-col w-full '>

          {contentFilters}
          {contentData}
        </div>
      </div>
    </div>
  )
}

export default ManageContents