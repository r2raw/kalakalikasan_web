import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { createPortal } from 'react-dom';

const PrintModal = forwardRef(function PrintModal({ children, onClose, ...props }, ref) {

    const dialogRef = useRef(null);
    useImperativeHandle(ref, () => {
        return {
            open() {
                dialogRef.current.showModal();
            }, close() {
                dialogRef.current.close();
            }
        }
    });

    return (
        createPortal(
            <dialog className='your-modal-class px-4 py-8 rounded-md shadow-xl' ref={dialogRef} onClose={onClose}>
                {children}
            </dialog>, document.getElementById('modal')
        )
    )
})

export default PrintModal