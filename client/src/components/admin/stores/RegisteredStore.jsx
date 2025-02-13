import React from 'react'
import { fetchApprovedStore } from '../../../util/http'
import { useQuery } from '@tanstack/react-query'
import ErrorBlock from '../../models/ErrorBlock';
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import StoreCard from './StoreCard';
function RegisteredStore() {


  const { data, isPending, isError, error } = useQuery({
    queryKey: ['stores'],
    queryFn: ({ signal }) => fetchApprovedStore({ signal }),
    staleTime: 3000,
    gcTime: 30000,
    refetchInterval: 3000,
  })

  let content = '';

  if (isPending) {
    content = <p>Fetching data...</p>
  }
  if (isError) {
    content = <ErrorBlock message={error.info?.errors || ['Failed to load data.']} />
  }


  if (data) {
    content = <h1 className='text-dark_font text-center'>No store found</h1>
    if (data.length > 0) {
      content =
        <div className='grid grid-cols-4 mt-4'>
          {data.map(store => <StoreCard key={store.id} data={store} />)}
        </div>
    }
  }
  return (
    <div>
      <h2 className='text-dark_font'>Registered Stores</h2>
      {content}
    </div>
  )
}

export default RegisteredStore