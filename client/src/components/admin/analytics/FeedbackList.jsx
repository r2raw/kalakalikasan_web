import React from 'react'
import { fetchFeedback } from '../../../util/http';
import { useQuery } from '@tanstack/react-query';
import CustomLoader from '../../models/CustomLoader';
import {titleCase} from 'title-case'
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
                    <div>{titleCase(feedback.name)}</div>
                    <div>{}</div>
                </div>
                <div className=' w-full'>{feedback.message}</div>
            </div>)
    }
    return (
        <>
            <h4 className="bg-dark_font py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white custom-scrollbar">
                User feedbacks
            </h4>
            {content}
        </>
    )
}

export default FeedbackList