import React from 'react'
import { fetchMostCommentedContents } from '../../../util/http'
import { useQuery } from '@tanstack/react-query'
import CustomLoader from '../../models/CustomLoader'
import { truncate } from 'lodash'
import { titleCase } from 'title-case'

function TopCommentedContent() {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['contents', 'comments','most'],
        queryFn: ({ signal }) => fetchMostCommentedContents({ signal }),
        staleTime: 5000,
        gcTime: 30000,
        refetchInterval: 5000,
    })

    let content = <p>No reacted contents found</p>

    if (isPending) {
        content = <CustomLoader />
    }

    if (isError) {
        content = <div className="bg-red-200 w-full px-4 py-4">

            <p className="text-red-700">{error.info?.error || 'an error occured'}</p>
        </div>
    }

    if (data && data.length > 0) {

        content =
            <table className="w-full">
                <thead>
                    <tr className="text-secondary_color">
                        <th className=' text-smm md:text-base'>Title</th>
                        <th className=" text-right text-smm md:text-base">Comment counts</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(content => {
                        
                        return (
                            <tr key={content.contentId}>
                                <td className=' text-smm md:text-base'><strong>{truncate(titleCase(content.title), 25)}</strong></td>
                                <td className=" text-right text-smm md:text-base">{content.count}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
    }
    return (
        <>
            <h4 className="bg-dark_font py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white text-sm md:text-xl">
                Most commented contents
            </h4>
            <div className="card">
                {content}
            </div>
        </>
    )
}

export default TopCommentedContent