import React, { useRef, useState } from 'react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Modal from '../../models/ui/Modal';
import CustomTextArea from '../../models/CustomTextArea';
import { useMutation, useQuery } from '@tanstack/react-query';
import { approveStore, fetchStoreInfo, queryClient } from '../../../util/http';
import ErrorBlock from '../../models/ErrorBlock';
import DoneSharpIcon from '@mui/icons-material/DoneSharp';
import { titleCase } from 'title-case';
function ViewStoreApplication() {

    const navigate = useNavigate();
    const dialog = useRef(null);
    const successDialog = useRef(null);
    const data = useOutletContext();
    const { id } = useParams();

    const [isRejecting, setIsRejecting] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);


    const { mutate, isPending: approvalPending, isError: isApprovalError, error: approvalError } = useMutation(
        {
            mutationFn: approveStore,
            onSuccess: () => {
                dialog.current.close()

                queryClient.invalidateQueries({ queryKey: ['stores'] });
                successDialog.current.open();

            },
        },
    )
    const handleReject = () => {
        setIsRejecting(true)
        dialog.current.open();

    }
    const handleApprove = () => {
        const store_data = {
            owner_id: data.owner_id,
            approved_by: localStorage.getItem('id'),
            store_id: id,
        }
        mutate({ data: store_data })
    }

    const handleApproveModal = () => {
        setIsRejecting(false)
        dialog.current.open()

    }

    const handleCloseRejectModal = () => {

        dialog.current.close()
    }
    const handleCloseApproveModal = () => {

        dialog.current.close()
    }

    const handleSuccessModal = () => {
        navigate('../../list')
    }

    const address = `${titleCase(data.street)}, ${titleCase(data.barangay)}, ${data.city}`
    let formAction = <>
        <button className='hover:bg-slate-200 px-4 py-1 rounded-lg text-light_font' onClick={handleCloseRejectModal}>Cancel</button>
        <button onClick={() => { }} className='bg-red-400 px-4 py-1 rounded-lg text-white hover:bg-red-500 ' >Reject</button>
    </>


    let modal =
        <Modal ref={dialog} onClose={handleCloseApproveModal}>
            <div className='w-96'>
                <h4 className=' text-dark_font my-4'>Store Approval</h4>
                <p>Are you sure want to approve &apos;{titleCase(data.store_name)}&apos; store?</p>
            </div>
            <div className='mt-8 flex gap-2 justify-end'>

                {approvalPending ? <p>Submitting...</p> :
                    <>
                        <button className='hover:bg-slate-200 px-4 py-1 rounded-lg text-light_font' onClick={handleCloseApproveModal}>Cancel</button>
                        <button onClick={handleApprove} className='px-4 py-1 rounded-lg text-white bg-green-400 hover:bg-light_font ' >Confirm</button>
                    </>}
            </div>
        </Modal>

    if (isRejecting) {

        modal = <Modal ref={dialog} onClose={handleCloseRejectModal}>
            <div className='w-96'>
                <h3 className=' text-dark_font my-4'>State your reason</h3>
                <CustomTextArea />
            </div>
            <div className='mt-8 flex gap-2 justify-end'>
                {formAction}
            </div>
        </Modal>
    }


    return (
        <>
            {modal}
            <Modal ref={successDialog} onClose={handleSuccessModal}>
                <div className='flex mb-8 items-center gap-2'>
                    <DoneSharpIcon fontSize='large' sx={{ color: '#204d2c' }} />
                    <h2 className='text-dark_font'>Approval Success</h2>
                </div>
                <p className=' max-w-[36rem] w-96 text-lg'>
                    Store &apos;{titleCase(data.store_name)}&apos; approved successfully!
                </p>
                <div className='mt-8 flex gap-2 justify-end'>
                    <button onClick={handleSuccessModal} className='bg-dark_font hover:bg-light_font rounded-md px-4 py-1 text-white' >Ok</button>
                </div>
            </Modal>
            <div >
                <div className='px-4 grid lg:grid-cols-2 gap-4'>
                    <div className='my-card p-4 flex flex-col gap-4'>
                        <h4>Store Information</h4>
                        <div className='flex gap-2'>
                            <p className='font-bold'>Store Address:</p>
                            <p>{address}</p>
                        </div>
                        <p><span className='font-bold'>Contact No.:</span> 09123123123</p>
                        <h4>Store Image</h4>
                        <img src={`${import.meta.env.VITE_BASE_URL}/store-cred/store_front/${data.store_image}`} alt={data.store_name + '-logo'} className='h-40 w-40' />
                    </div>
                    <div className='flex flex-col my-card p-4 gap-4'>
                        <h4 >Store credentials</h4>
                        <Link to={'dti'}>{'DTI Permit >>'}</Link>
                        <Link to={'barangay-permit'}>{'Barangay Permit >>'}</Link>

                    </div>
                </div>
                <div className='flex justify-center items-center gap-4 mt-8'>
                    <button onClick={handleReject} className='text-red-600 text-large hover:bg-red-400 hover:text-white px-4 py-2 rounded-md'>Reject</button>
                    <button onClick={handleApproveModal} className='text-white text-large bg-green-400 hover:bg-light_font px-4 py-2 rounded-md'>Approve</button>
                </div>
            </div>
        </>
    )
}

export default ViewStoreApplication