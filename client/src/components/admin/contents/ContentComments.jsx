import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { useParams } from 'react-router-dom';
import { fetchContentComment } from '../../../util/http';
import CustomLoader from '../../models/CustomLoader';
import ErrorSingle from '../../models/ErrorSingle';

function ContentComments() {
    const { id } = useParams()
    const { data, isPending, isError, error } = useQuery({
        queryKey: ["contents", id, ['comments']],
        queryFn: ({ signal }) => fetchContentComment({ signal, id }),
        staleTime: 5000,
        gcTime: 30000,
        refetchInterval: 5000,
    });

    let content = <p className='text-center '>No comment found</p>

    if (isPending) {
        content = <CustomLoader />
    }

    if (isError) {
        content = <ErrorSingle message={error.info?.error || 'An error occur'} />
    }

    if (data && data.length) {
        content = <div className='flex flex-col gap-4'>
            {data.map(content => <div key={data.id} className='w-full card'>
                <p>{content.comment}</p>
            </div>
            )
            }
        </div>
    }
    return (
        <div className=' h-[80dvh] overflow-y-auto custom-scrollbar py-4'>
            {content}
        </div>
    )
}

export default ContentComments