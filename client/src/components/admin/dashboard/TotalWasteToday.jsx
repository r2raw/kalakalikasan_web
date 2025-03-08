import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { fetchTotalWasteToday } from '../../../util/http'
import CustomLoader from '../../models/CustomLoader'

function TotalWasteToday() {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['bin', 'total'],
        queryFn: ({ signal }) => fetchTotalWasteToday({ signal }),
        staleTime: 3000,
        gcTime: 30000,
        refetchInterval: 3000,
    })

    let content = <div className='flex flex-col justify-center items-center'>
        <h1 className='text-secondary_color'>0</h1>
        <p>grams</p>
    </div>

    if (isPending) {
        content = <CustomLoader />
    }

    if (isError) {
        content = <div className="bg-red-200 w-full px-4 py-4">

            <p className="text-red-700">{error.info?.message || 'an error occured'}</p>
        </div>
    }

    if (data) {
        content = <div className='flex flex-col justify-center items-center'>
            <h1 className='text-secondary_color'>{data}</h1>
            <p>grams</p>
        </div>
    }
    return (
        <>
            <h4 className="bg-dark_font py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white text-sm md:text-xl">
                Recyclable waste collected today
            </h4>
            <div className="card">
                {content}
            </div>
        </>
    )
}

export default TotalWasteToday