import React from 'react'
import { fetchAccumulatedPoints } from '../../../util/http'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import CustomLoader from '../../models/CustomLoader'

function AccumulatedPoints() {
    const { id } = useParams()
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['stores', id, 'points'],
        queryFn: ({ signal }) => fetchAccumulatedPoints({ signal, id }),
        staleTime: 5000,
        gcTime: 30000,
        refetchInterval: 5000,
    })

    let content = <h1>0</h1>

    if(isPending){
        content = <CustomLoader />
    }

    if(data){
        content = <h1>{data}</h1>;
    }
    return (
        <div className=' flex flex-col gap-4'>
            <h4 className="bg-dark_font w-full py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white">
                Total Points from Orders
            </h4>
            <div className='card'>{content}</div>
        </div>
    )
}

export default AccumulatedPoints