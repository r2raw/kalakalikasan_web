import React from 'react'
import { resentContentActivties } from '../../../util/http'
import CustomLoader from '../../models/CustomLoader'
import ErrorSingle from '../../models/ErrorSingle'
import { useQuery } from '@tanstack/react-query'
import { dbDateFormatterShort } from '../../../util/formatter'
import { join } from 'lodash'
import { useNavigate } from 'react-router-dom'

function ContentAdminActivities() {

    const navigate = useNavigate()
    const id = localStorage.getItem('id')
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['contents', 'recent', 'admin',],
        queryFn: ({ signal }) => resentContentActivties({ signal, id }),
        staleTime: 5000,
        gcTime: 30000,
        refetchInterval: 5000,
    })

    let content = <p className=' text-center'>No recent activities found</p>

    if (isPending) {
        content = <CustomLoader />
    }

    if (isError) {
        content = <ErrorSingle message={error.info?.message || 'An error occured'} />
    }

    const handleClick = (id)=>{
        navigate(`../contents/${id}`)
    }

    if (data) {
        if (data.length > 0) {
            content = <table>
                <thead>
                    <tr>
                        <th className='text-smm md:text-base'>Activity</th>
                        <th className='text-right text-smm md:text-base'>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((content,index) => {

                        return (<tr key={content.id + index} >
                            <td className='text-smm md:text-base'>
                                <p>{content.info.split(' ').slice(0, 2).join(' ')} <strong className='cursor-pointer' onClick={()=>{handleClick(content.id)}}>{content.info.split(' ').slice(2).join(' ')}</strong></p>
                            </td>
                            <td className='text-right text-smm md:text-base'>
                                {dbDateFormatterShort(content.date)}
                            </td>
                        </tr>)
                    })}
                </tbody>
            </table>
        }
    }
    return (
        <div className='flex flex-col gap-4'>
            <h4 className="bg-dark_font py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white text-sm md:text-xl">
            Recent Content Change
            </h4>
            <div className='card'>
                {content}
            </div>
        </div>
    )
}

export default ContentAdminActivities