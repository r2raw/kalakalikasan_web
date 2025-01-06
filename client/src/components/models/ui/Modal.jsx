import React, { useImperativeHandle, forwardRef, useRef } from 'react'
import { createPortal } from 'react-dom'
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import CheckCircleOutlineSharpIcon from '@mui/icons-material/CheckCircleOutlineSharp';


const Modal = forwardRef(function Modal({ formAction, ...props }, ref) {

    const dialogRef = useRef(null);
    useImperativeHandle(ref, () => {
        return {
            open() {
                dialogRef.current.showModal();
            },
        }
    });

    const closeDialog = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
            console.log('DIALOG CLOSED');
        }
    };

    let dialogActions = <button className=' bg-dark_font text-white rounded-md px-8 py-2 text-2xl'>OK</button>

    if(formAction){
        dialogActions = formAction
    }


    return (

        createPortal(
            <dialog className=' px-4 py-8 rounded-md shadow-xl' ref={dialogRef} onClose={closeDialog}>
                <button className='absolute text-dark_font top-2 right-2' onClick={closeDialog}><CloseSharpIcon fontSize='large' /></button>
                <div className='flex mb-8 items-center gap-2'>
                    <CheckCircleOutlineSharpIcon  fontSize='large' />
                    <h2>Success</h2>
                </div>
                <p className=' max-w-[36rem] text-lg'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, eaque.
                </p>
                <form method='dialog' className='mt-8 flex justify-end'>
                    {dialogActions}
                </form>
            </dialog>, document.getElementById('modal')
        )
    )
})

export default Modal;