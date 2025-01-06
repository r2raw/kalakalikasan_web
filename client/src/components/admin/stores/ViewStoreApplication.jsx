import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../../models/ui/Modal';
function ViewStoreApplication() {

    const navigate = useNavigate();
    const dialog = useRef(null);
    const [isRejecting, setIsRejecting] = useState(false);
    let formAction = <button>Cancel</button>;
    if(isRejecting){
        formAction = <button>Confirm</button>;
    }
    const handleReject = () => {
        setIsRejecting(true)
        dialog.current.open();

    }
    return (
        <>
            <Modal ref={dialog}  formAction={formAction}/>
            <div >
                <div className='px-4 grid lg:grid-cols-2 gap-4'>
                    <div className='my-card p-4 flex flex-col gap-4'>
                        <h4>Store Information</h4>
                        <div className='flex gap-2'>
                            <p className='font-bold'>Store Address:</p>
                            <p> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia, laboriosam? Soluta unde voluptates amet quos. Atque, earum? Laborum, distinctio facere. </p>
                        </div>
                        <p><span className='font-bold'>Contact No.:</span> 09123123123</p>
                    </div>
                    <div className='flex flex-col my-card p-4 gap-4'>
                        <h4 >Store credentials</h4>
                        <Link to={'dti'}>{'DTI Permit >>'}</Link>
                        <Link to={''}>{'Barangay Permit >>'}</Link>
                    </div>
                </div>
                <div className='flex justify-center items-center gap-4 mt-8'>
                    <button onClick={handleReject} className='text-red-600 text-large hover:bg-red-400 hover:text-white px-4 py-2 rounded-md'>Reject</button>
                    <button className='text-white text-large bg-green-400 hover:bg-light_font px-4 py-2 rounded-md'>Accept</button>
                </div>
            </div>
        </>
    )
}

export default ViewStoreApplication