import React, { useState } from 'react'

import brand_logo from '../../../assets/images/brand_logo.png'
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import { titleCase } from 'title-case';
import { dbDateFormatter } from '../../../util/formatter';
import { IconButton, nativeSelectClasses } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { deactivateContent, queryClient } from '../../../util/http';
import { uiActions } from '../../../store/slices/uiSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactCount from './ReactCount';
import CommentCount from '../profile/CommentCount';
function ContentItem({ data }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false);
    const { mutate, isPending, isError, error } = useMutation(
        {
            mutationFn: deactivateContent, onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['contents'] });
                dispatch(uiActions.handleSuccessMessage('Content successfully deleted!'))
                setTimeout(() => {
                    dispatch(uiActions.handleSuccessMessage(null))
                }, 3000)
            },
        }
    )
    const handleMenu = () => {
        setOpenMenu(prev => !prev)
    };

    const handleDelete = () => {
        const id = data.id;

        mutate({ data: { id, deactivatedBy: localStorage.getItem('id') } })
    }

    const handleClick = () => {
        const id = data.id;
        navigate(id)
    }

    const handleEdit = () => {
        const id = data.id;
        navigate(`edit/${id}`)
    }
    let contentImage = <img src={brand_logo} alt='brand_logo' />
    if (data.images.length > 0) {
        const imageUrl = data.images[0].imgUrl;
        contentImage = <img src={`${import.meta.env.VITE_BASE_URL}/media-content/${imageUrl}`} className='h-full w-full object-cover rounded-md ' alt={imageUrl} />
    }


    return (
        <div className='card flex flex-col gap-4 text-light_font relative' >
            {/* <h5>News and article</h5> */}
            <div className='h-48 w-full flex justify-center items-center'>
                {contentImage}
            </div>
            <h4>{titleCase(data.title)}</h4>
            <div className='flex gap-4 w-full text-sm justify-between'>
                <ReactCount id={data.id} />
                <CommentCount id={data.id}/>
            </div>
            <div className='flex justify-between w-full text-sm'>
                <p>Created: {dbDateFormatter(data.date_created)}</p>
                <IconButton onClick={handleMenu}><MoreVertSharpIcon /></IconButton>
            </div>
            {!isPending && openMenu &&
                <div className='absolute shadow-md bg-white rounded-md bottom-4 right-10'>
                    <ul>
                        <li className='hover:bg-neutral-200 px-2 cursor-pointer' onClick={handleClick}>View</li>
                        <li className='hover:bg-neutral-200 px-2 cursor-pointer' onClick={handleEdit}>Edit</li>
                        <li className='hover:bg-neutral-200 px-2 rounded-b-md cursor-pointer'>
                            <button disabled={isPending} onClick={handleDelete}>Delete</button>
                        </li>
                    </ul>
                </div>}
        </div>
    )
}

export default ContentItem