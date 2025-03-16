import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react'
import maya from '../../../assets/logo/maya.jpg'
import gcash from '../../../assets/logo/gcash.png'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchPaymentReq, queryClient, rejectPayment } from '../../../util/http';
import CustomLoader from '../../models/CustomLoader';
import ErrorSingle from '../../models/ErrorSingle';
import { titleCase } from 'title-case';
import brandLogo from '../../../assets/logo/logo_only_transparent.png'
import UploadScreenShot from './UploadScreenShot';
import { currencyFormatter } from '../../../util/formatter';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import Modal from '../../models/ui/Modal';
import CustomTextArea from '../../models/CustomTextArea';

import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import { IconButton } from '@mui/material';
import ErrorBlock from '../../models/ErrorBlock';
function ViewPaymentRequest() {

  const { id } = useParams();

  const dialog = useRef(null);
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('');
  const [reason, setReason] = useState('')
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['payment', id,],
    queryFn: ({ signal }) => fetchPaymentReq({ signal, id }),
    staleTime: 5000,
    gcTime: 30000,
    refetchInterval: 5000,
  })
  const handleDelete = () => {

    if (reason.trim() == '') {
      setErrorMessage('Please state your reason!')
      return
    }
    const { storeInfo, paymentInfo, userInfo, walletInfo } = data;
    const rejectData = {
      reason: reason.trim(),
      amount: paymentInfo.amount,
      userId: userInfo.id,
      paymentId: paymentInfo.id,
    }
    mutate({ data: rejectData })
  }

  const { mutate, isPending: pendingDeletion, isError: isDeletionError, error: deletionError } = useMutation({
    mutationFn: rejectPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment'] });
      handleCloseDeleteModal()
      handleBack()

    },
  })
  const handleBack = () => {
    navigate('..')
  }

  const handleTextChange = (e) => {
    const { value } = e.target

    setReason(value)

  }

  const handleOpenDeleteModal = () => {
    dialog.current.open()

  }
  const handleCloseDeleteModal = () => {
    dialog.current.close();
  }


  let content = <p>Payment request not found</p>

  if (isPending) {
    content = <CustomLoader />
  }

  if (isError) {
    content = <ErrorSingle message={error.info?.error || 'An error occured'} />
  }

  if (data) {


    const { storeInfo, paymentInfo, userInfo, walletInfo } = data;

    let logoSrc = brandLogo

    if (storeInfo.store_logo) {
      logoSrc = `${import.meta.env.VITE_BASE_URL}/store-cred/store_logo/${storeInfo.store_logo}`
    }

    let walletTypeImg = gcash
    if (walletInfo.type == 'maya') {
      walletTypeImg = maya
    }
    const fullname = `${userInfo.firstname} ${userInfo.middlename && `${userInfo.middlename} `} ${userInfo.lastname}`
    const address = `${storeInfo.street}, ${storeInfo.barangay}, ${storeInfo.city}`
    content = <>
      <div className='textured-bg px-4 py-8 rounded-md flex flex-col items-center justify-centers md:flex-row gap-4'>
        <img src={logoSrc} alt='store-logo' className='w-40 h-40' />
        <div className='flex flex-col gap-4'>
          <h1 className='text-center md:text-left  text-secondary_color'>{storeInfo.store_name.toUpperCase()}</h1>
          <h2 className='text-center md:text-left text-secondary_color text-xl md:text-2xl lg:text-3xl'>{titleCase(fullname)}</h2>
          <h3 className='text-center md:text-left text-secondary_color text-base md:text-lg lg:text-xl'>{titleCase(address)}</h3>
        </div>
      </div>
      <div className='grid lg:grid-cols-2 gap-4 mt-4'>
        <div className='flex flex-col gap-4'>
          <img src={walletTypeImg} className='w-full h-24 rounded-md shadow-cardShadow object-fit' alt='payment-typpe' />
          <div className='card flex flex-col gap-4'>
            <div className='flex w-full justify-between text-smm md:text-base'>
              <strong>Account name:</strong>
              <p className='text-right'>{walletInfo.accountName.toUpperCase()}</p>
            </div>
            <div className='flex w-full justify-between text-smm md:text-base'>
              <strong>Account number:</strong>
              <p className='text-right' >{walletInfo.mobileNum}</p>
            </div>
            <div className='flex w-full justify-between text-smm md:text-base'>
              <strong>Type:</strong>
              <p className='text-right'>{walletInfo.type.toUpperCase()}</p>
            </div>
            <div className='flex w-full justify-between text-smm md:text-base'>
              <strong>Amount:</strong>
              <p className='text-right'>{currencyFormatter(paymentInfo.amount)}</p>
            </div>
          </div>
          <button className=' text-red_highlight py-4 w-full hover:bg-red-500/50 hover:text-white rounded-md' onClick={handleOpenDeleteModal}>Reject request</button>
        </div>
        <UploadScreenShot paymentData={data} />
      </div>
    </>
  }
  return (
    <>
      <Modal ref={dialog} onClose={handleCloseDeleteModal}>
        <div className='flex mb-8 items-center gap-2'>
          <DeleteSharpIcon fontSize='large' sx={{ color: '#ef4444' }} />
          <h2 className='text-red-500'>Reject</h2>
        </div>
        <div className='w-96'>
          <h3 className=' text-dark_font my-4'>State your reason</h3>
          <CustomTextArea val={reason} onChange={handleTextChange} error={errorMessage} maxVal={150} />
        </div>
        <div className='mt-8 flex gap-2 justify-end'>
          <button className='hover:bg-slate-200 px-4 py-1 rounded-lg text-light_font' onClick={handleCloseDeleteModal} disabled={pendingDeletion}>Cancel</button>
          <button onClick={handleDelete} className='bg-red-500 px-4 py-1 rounded-lg text-white hover:bg-red-400' disabled={pendingDeletion} >{pendingDeletion ? 'Rejecting...' : 'Reject'}</button>
        </div>
        {isDeletionError && <ErrorSingle message={deletionError.info?.error || 'An error occured'}/>}

      </Modal>
      <div>

        <IconButton onClick={handleBack} className='text-accent_color fill-accent_color'>
          <ArrowBackSharpIcon className="text-accent_color fill-current" />
        </IconButton>
        {content}
      </div>
    </>
  )
}

export default ViewPaymentRequest