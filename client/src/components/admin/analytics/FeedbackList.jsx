import React from 'react'
import { fetchFeedback } from '../../../util/http';
import { useQuery } from '@tanstack/react-query';
import CustomLoader from '../../models/CustomLoader';
import {titleCase} from 'title-case'
import { dbDateFormatterShort, truncateText } from '../../../util/formatter';
function FeedbackList() {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ["feedbacks"],
        queryFn: ({ signal }) => fetchFeedback({ signal }),
        staleTime: 3000,
        gcTime: 30000,
        refetchInterval: 3000,
    });
    let content = <p>No feedback found!</p>

    if(isPending){
        content = <CustomLoader />
    }

    console.log(data)
    if (data && data.length > 0) {
        content = data.map(feedback =><div key={feedback.id} className='card w-full flex flex-col'>
                <div className='flex justify-between w-full'>
                    <div>{truncateText(titleCase(feedback.name))}</div>
                    <div>{dbDateFormatterShort(feedback.date_submitted)}</div>
                </div>
                <div className=' w-full break-words text-sm md:text-base'>{feedback.message}</div>
            </div>)
    }
    return (
        <>
            <h4 className="bg-dark_font py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white text-sm md:text-xl">
                User feedbacks
            </h4>
            <div className='flex flex-col gap-4 h-[95dvh] overflow-y-auto custom-scrollbar'>
            {content}</div>
        </>
    )
}

export default FeedbackList