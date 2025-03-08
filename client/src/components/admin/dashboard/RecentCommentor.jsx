import React from 'react'
import { dbDateFormatterShort } from '../../../util/formatter'
import CustomLoader from '../../models/CustomLoader'
import { useQuery } from '@tanstack/react-query'
import { fetchRecentCommentor } from '../../../util/http'

function RecentCommentor() {const { data, isPending, isError, error } = useQuery({
    queryKey: ['comments', 'recent'],
    queryFn: ({ signal }) => fetchRecentCommentor({ signal }),
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

    console.log(data)
    content =
        <table className="w-full">
            <thead>
                <tr className="text-secondary_color">
                    <th className=' text-smm md:text-base'>User Reaction</th>
                    <th className=" text-right text-smm md:text-base">Date</th>
                </tr>
            </thead>
            <tbody>
                {data.map((comment, index) => {

                    return (
                        <tr key={index}>
                            <td className=' text-smm md:text-base'><strong>{comment.info.split(" commented to ")[0]}</strong> commented to <strong>{comment.info.split(" commented to ")[1]}</strong></td>
                            <td className=" text-right text-smm md:text-base">{dbDateFormatterShort(comment.date_commented)}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
}
return (
    <>
        <h4 className="bg-dark_font py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white text-sm md:text-xl">
            Recent user comments
        </h4>
        <div className="card">
            {content}
        </div>
    </>
)
}

export default RecentCommentor