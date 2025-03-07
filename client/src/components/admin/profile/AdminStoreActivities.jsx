import React from 'react'
import { resentStoreActivties } from '../../../util/http'
import { useQuery } from '@tanstack/react-query'
import CustomLoader from '../../models/CustomLoader'
import ErrorSingle from '../../models/ErrorSingle'
import { dbDateFormatter, dbDateFormatterShort } from '../../../util/formatter'
import { useNavigate } from 'react-router-dom'

function AdminStoreActivities() {

    const id = localStorage.getItem('id')
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['stores', 'recent', 'admin',],
        queryFn: ({ signal }) => resentStoreActivties({ signal, id }),
        staleTime: 5000,
        gcTime: 30000,
        refetchInterval: 5000,
    })

    const navigate = useNavigate();
    let content = <p className=' text-center'>No recent activities found</p>

    if (isPending) {
        content = <CustomLoader />
    }

    const handleClick = (id) => {
        navigate(`../stores/${id}`)
    }

    if (isError) {
        content = <ErrorSingle message={error.info?.message || 'An error occured'} />
    }
    if (data) {
        if (data.length > 0) {
            content = <table>
                <thead >
                    <tr className=''>
                        <th>Activity</th>
                        <th className='text-right'>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((store, index) => {
                        return (<tr key={store.id} >
                            <td>
                                <p>{store.info.split(' ').slice(0, 2).join(' ')} <strong className='cursor-pointer' onClick={() => { handleClick(store.id) }}>{store.info.split(' ').slice(2).join(' ')}</strong></p>
                            </td>
                            <td className='text-right'>
                                {dbDateFormatterShort(store.date)}
                            </td>
                        </tr>)
                    })}
                </tbody>
            </table>
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <h4 className="bg-dark_font py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white">
                Store Approval & Rejections
            </h4>
            <div className='card'>
                {content}
            </div>
        </div>
    )
}

export default AdminStoreActivities