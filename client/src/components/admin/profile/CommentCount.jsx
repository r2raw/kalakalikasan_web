import React from 'react'
import { fetchCommentCount } from '../../../util/http';
import { useQuery } from '@tanstack/react-query';

import CommentSharpIcon from '@mui/icons-material/CommentSharp';
function CommentCount({ id }) {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ["contents", id, 'comment', 'counts'],
        queryFn: ({ signal }) => fetchCommentCount({ signal, id }),
        staleTime: 5000,
        gcTime: 30000,
        refetchInterval: 5000,
    });
    let count = '0'

    if (isPending) {
        count = 'Loading...'
    }

    if (isError) {
        count = 'Error'
    }

    if (data) {
        count = data
    }
    return (
        <div className='flex gap-2 items-center'>
            <CommentSharpIcon />
            <p>{count}</p>
        </div>
    )
}

export default CommentCount