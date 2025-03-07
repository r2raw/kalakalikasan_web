import React from 'react'

import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';
import { fetchReactCount } from '../../../util/http';
import ErrorSingle from '../../models/ErrorSingle';
import { useQuery } from '@tanstack/react-query';
function ReactCount({id}) {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ["contents", id,  'react', 'counts'],
        queryFn: ({ signal }) => fetchReactCount({ signal, id }),
        staleTime: 5000,
        gcTime: 30000,
        refetchInterval: 5000,
    });

    let count = '0'

    if(isPending){
        count = 'Loading...'
    }

    if(isError){
        count ='Error'
    }

    if(data){
        count = data
    }
    return (
        <div className='flex gap-2 items-center'>
            <FavoriteSharpIcon sx={{ color: '#ff0000' }} />
            <p>{count}</p>
        </div>
    )
}

export default ReactCount