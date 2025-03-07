import { IconButton } from '@mui/material'
import React, { useRef } from 'react'
import { deleteImage, queryClient } from '../../../util/http';
import { useMutation } from '@tanstack/react-query';
import Modal from '../../models/ui/Modal';
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { useParams } from 'react-router-dom';
import ErrorSingle from '../../models/ErrorSingle';

function SmallDeletableImage({ setCurrentIndex, image, index, currentIndex, removeImage }) {

    const { id } = useParams()
    const dialog = useRef(null);

    const { mutate, isPending, isError, error } = useMutation(
        {
            mutationFn: deleteImage,
            onSuccess: () => {
                removeImage(image.imageId)
                queryClient.invalidateQueries({ queryKey: ['contents', id] });
                dialog.current.close()
            },
        },
    )


    const handleModalClose = () => {
        dialog.current.close()
    }
    const handleImageDelete = () => {

        mutate({ id: image.imageId, contentId: id, userId: localStorage.getItem('id') })
    }

    const handleOpenModal = () => {
        dialog.current.open()
    }
    return (
        <>

            <Modal ref={dialog} onClose={handleModalClose} deleting >

                <div className='flex mb-8 items-center gap-2'>
                    <DeleteForeverSharpIcon fontSize='large' sx={{ color: '#D9534F' }} />
                    <h2 className='text-red_highlight'>Delete</h2>
                </div>
                <p className=' max-w-[36rem] w-96 text-lg text-red_highlight'>
                    Are you sure you want to delete this image?
                </p>
                {isPending && <p className='text-right text-red_highlight'>Deleting...</p>}
                {!isPending && <div className='mt-8 flex gap-2 justify-end'>
                    <button onClick={handleModalClose} className='text-red_highlight hover:bg-red_highlight/10 rounded-md px-4 py-1 '>Cancel</button>
                    <button onClick={handleImageDelete} className='bg-red_highlight hover:bg-red-700 rounded-md px-4 py-1 text-white'>Delete</button>
                </div>}
                {isError && <ErrorSingle message={error.info?.error || 'An error occured'} />}
            </Modal>
            <div
                className=" relative">
                <img
                    src={`${import.meta.env.VITE_BASE_URL}/media-content/${image.imgUrl}`}
                    alt="thumbnail"
                    className={`w-16 h-16 object-cover cursor-pointer rounded-md ${index === currentIndex ? 'border-2 border-blue-500' : 'opacity-50'}`}
                    onClick={() => setCurrentIndex(index)}
                />
                <div className="absolute -top-2 right-0">
                    <IconButton style={{ fontSize: "10px", padding: "2px" }} onClick={() => { handleOpenModal(image.imageId) }}>
                        <CloseSharpIcon sx={{ fontSize: "12px" }} className="fill-white text-white" />
                    </IconButton>
                </div>
            </div>
        </>
    )
}

export default SmallDeletableImage