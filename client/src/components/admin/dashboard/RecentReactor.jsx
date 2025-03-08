import React from 'react'
import CustomLoader from '../../models/CustomLoader'
import { useQuery } from '@tanstack/react-query'
import { fetchRecentReactor } from '../../../util/http'
import { dbDateFormatterShort } from '../../../util/formatter'

function RecentReactor() {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['reacts', 'recent'],
        queryFn: ({ signal }) => fetchRecentReactor({ signal }),
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
                    {data.map((react) => {

                        return (
                            <tr key={react.info}>
                                <td className=' text-smm md:text-base'><strong>{react.info.split(" reacted to ")[0]}</strong> reacted to <strong>{react.info.split(" reacted to ")[1]}</strong></td>
                                <td className=" text-right text-smm md:text-base">{dbDateFormatterShort(react.date_reacted)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
    }
    return (
        <>
            <h4 className="bg-dark_font py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white text-sm md:text-xl">
                Recent user reaction
            </h4>
            <div className="card">
                {content}
            </div>
        </>
    )
}

export default RecentReactor