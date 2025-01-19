import React, { useState } from 'react'

import brand_logo from '../../../assets/images/brand_logo.png'
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';
import CommentSharpIcon from '@mui/icons-material/CommentSharp';
import { titleCase } from 'title-case';
import { dbDateFormatter } from '../../../util/formatter';
import { IconButton } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { deactivateContent, queryClient } from '../../../util/http';
import { uiActions } from '../../../store/slices/uiSlice';
import { useDispatch } from 'react-redux';
function ContentItem({ data }) {
    const dispatch = useDispatch();
    const [openMenu, setOpenMenu] = useState(false);
    const { mutate, isPending, isError, error } = useMutation(
        {
            mutationFn: deactivateContent, onSuccess: () => {
                dispatch(uiActions.handleSuccessMessage('Content successfully deleted!'))
                setTimeout(() => {
                  dispatch(uiActions.handleSuccessMessage(null))
                }, 3000)
                queryClient.invalidateQueries({ queryKey: ['posts'] });
            },
        }
    )
    const handleMenu = () => {
        setOpenMenu(prev => !prev)
    };

    const handleDelete = () => {
        const id = data.id;
        
        mutate({ data: id })
    }
    let contentImage = <img src={brand_logo} alt='brand_logo' />
    if (data.images.length > 0) {
        const imageUrl = data.images[0].imgUrl;
        contentImage = <img src={`${import.meta.env.VITE_BASE_URL}/media-content/${imageUrl}`} className='h-full w-full object-cover rounded-md ' alt={imageUrl} />
    }


    return (
        <div className='card flex flex-col gap-4 text-light_font cursor-pointer relative'>
            {/* <h5>News and article</h5> */}
            <div className='h-48 w-full flex justify-center items-center'>
                {contentImage}
            </div>
            <h4>{titleCase(data.title)}</h4>
            <div className='flex gap-4 w-full text-sm justify-between'>
                <div className='flex gap-2 items-center'>
                    <FavoriteSharpIcon sx={{ color: '#ff0000' }} />
                    <p>123,222</p>
                </div>
                <div className='flex gap-2 items-center'>
                    <CommentSharpIcon />
                    <p>123,22</p>
                </div>
            </div>
            <div className='flex justify-between w-full text-sm'>
                <p>Created: {dbDateFormatter(data.date_created)}</p>
                <IconButton onClick={handleMenu}><MoreVertSharpIcon /></IconButton>
            </div>
            {openMenu &&
                <div className='absolute shadow-md bg-white rounded-md bottom-4 right-10'>
                    <ul>
                        <li className='hover:bg-neutral-200 px-2 rounded-t-md'>Hide</li>
                        <li className='hover:bg-neutral-200 px-2'>View</li>
                        <li className='hover:bg-neutral-200 px-2'>Edit</li>
                        <li className='hover:bg-neutral-200 px-2 rounded-b-md' onClick={handleDelete}>Delete</li>
                    </ul>
                </div>}
        </div>
    )
}

export default ContentItem