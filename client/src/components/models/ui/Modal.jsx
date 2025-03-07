import React, { useImperativeHandle, forwardRef, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import CloseSharpIcon from '@mui/icons-material/CloseSharp';


const Modal = forwardRef(function Modal({ children, onClose, deleting, ...props }, ref) {

    const dialogRef = useRef(null);
    useImperativeHandle(ref, () => {
        return {
            open() {
                dialogRef.current.showModal();
            },close(){
                dialogRef.current.close();
            }
        }
    });

    // const closeDialog = () => {
    //     if(onClose){
    //         onClose()
    //     }
    //     if (dialogRef.current) {
    //         dialogRef.current.close();
    //     }

    // };

    // useEffect(() => {
    //     // Using useEffect to sync the Modal component with the DOM Dialog API
    //     // This code will open the native <dialog> via it's built-in API whenever the <Modal> component is rendered
    //     const modal = dialogRef.current;
    //     modal.showModal();
    
    //     return () => {
    //       modal.close(); // needed to avoid error being thrown
    //     };
    //   }, []);

    return (

        createPortal(
            <dialog className=' px-4 py-8 rounded-md shadow-xl' ref={dialogRef} onClose={onClose}>
                <button className={`absolute ${deleting ? 'text-red_highlight' : 'text-dark_font'} top-2 right-2 rounded-full p-1 hover:bg-slate-200`} onClick={onClose}><CloseSharpIcon fontSize='large' /></button>
                {children}
            </dialog>, document.getElementById('modal')
        )
    )
})

export default Modal;