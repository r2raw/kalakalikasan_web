import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchContentId } from '../../../util/http';
import { useQuery } from '@tanstack/react-query';
import CustomLoader from '../../models/CustomLoader';
import ErrorSingle from '../../models/ErrorSingle';
import { titleCase } from 'title-case';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import { IconButton } from '@mui/material';
import ImagesCarousel from './ImagesCarousel';
import { dbDateFormatter } from '../../../util/formatter';
import ContentComments from './ContentComments';
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';
import CommentSharpIcon from '@mui/icons-material/CommentSharp';
function ViewContent() {
    const { id } = useParams()
    const navigate = useNavigate()

    const handleBack = () => {
        navigate('..')
    }

    const { data, isPending, isError, error } = useQuery({
        queryKey: ["contents", id],
        queryFn: ({ signal }) => fetchContentId({ signal, id }),
        staleTime: 5000,
        gcTime: 30000,
        refetchInterval: 5000,
    });

    let content = <p>Content not found</p>
    let commentCount = 0
    let reactCount = 0
    if (isPending) {
        content = <CustomLoader />
        commentCount = 'Loading...'
        reactCount = 'Loading...'
    }

    if (isError) {
        content = <ErrorSingle message={error.info?.error || 'An error occur'} />
    }

    if (data) {

        const { contentData, images = [] } = data;

        if (images.length > 0) {
            content = <>
                <div className='card flex flex-col gap-4'>
                    <h2 className='text-secondary_color w-full'>{titleCase(contentData.title)}</h2>
                    <p className='text-secondary_color w-full'>{titleCase(contentData.type)}</p>
                    <ImagesCarousel images={images} />
                </div>

                <div className='card flex flex-col gap-4 w-full'>

                    <p className='w-full break-words'>{contentData.description}</p>
                    <p className='w-full text-right'>Created  on {dbDateFormatter(contentData.date_created)}</p>
                </div>
            </>

        }

        if (images.length <= 0) {
            content = <>
                <div className='card flex flex-col gap-4'>
                    <h2 className='text-secondary_color w-full'>{titleCase(contentData.title)}</h2>
                    <p className='text-secondary_color w-full'>{titleCase(contentData.type)}</p>
                </div>

                <div className='card flex flex-col gap-4 w-full'>

                    <p className='w-full break-words'>{contentData.description}</p>
                    <p className='w-full text-right'>Created  on {dbDateFormatter(contentData.date_created)}</p>
                </div>
            </>

        }

        commentCount = data.commentCount
        reactCount = data.reactCount
    }
    return (
        <>
            <IconButton onClick={handleBack} className='text-accent_color fill-accent_color'>
                <ArrowBackSharpIcon className="text-accent_color fill-current" />
            </IconButton>
            <div className='flex flex-col lg:flex-row gap-4 mt-4'>
                <div className='lg:w-3/5'>
                    <div className=' flex flex-col gap-4 w-full'>
                        {content}
                        <div className='flex gap-2'>
                            <div className='bg-red-600 rounded-full flex gap-2 items-center px-4 py-2'>
                                <FavoriteSharpIcon className='text-white fill-current' />
                                <p className='text-white'>{reactCount}</p>
                            </div>
                            <div className='bg-accent_color rounded-full flex gap-2 items-center  px-4 py-2'>
                                <CommentSharpIcon className='text-white fill-current' />
                                <p className='text-white'>{commentCount}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='lg:w-2/5 '>
                    <h4 className="bg-dark_font w-full py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white custom-scrollbar">
                        Comments
                    </h4>
                    <ContentComments />
                </div>
            </div>
        </>
    )
}

export default ViewContent