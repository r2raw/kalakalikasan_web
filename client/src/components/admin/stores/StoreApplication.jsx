import React from 'react'
import CustomTable from '../../table/CustomTable'
import { storeColumns } from '../../table/columns/columns'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchPendingStores } from '../../../util/http'
import ErrorBlock from '../../models/ErrorBlock'
import CustomLoader from '../../models/CustomLoader'
function StoreApplication() {

  const navigate = useNavigate();

  const handleViewClick = (id) => {
    navigate('./' + id)
  }

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['stores', 'application'],
    queryFn: ({ signal }) => fetchPendingStores({ signal }),
    staleTime: 3000,
    gcTime: 30000,
    refetchInterval: 3000,
  })


  let content = <div className=' my-auto w-full h-[75dvh] flex justify-center items-center text-secondary_color'><h1>No store application found!</h1></div>

  if (isPending) {
    content = <div className=' h-[75dvh]'><CustomLoader /></div>
  }

  if (isError) {
    content = <ErrorBlock message={error.info?.errors || ['Failed to load data.']} />
  }


  if (data) {


    if (data.length > 0) {
      content = <CustomTable
        tableData={data}
        column={storeColumns}
        collapsible_col={[]}
        actionType='view'
        onView={handleViewClick} />
    }

  }

  return (
    <div className='flex gap-8 flex-col'>
      <h2 className='text-dark_font'>Application Requests</h2>
      {content}
    </div>
  )
}

export default StoreApplication