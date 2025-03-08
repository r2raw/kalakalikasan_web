import { useQuery } from '@tanstack/react-query';
import React from 'react'
import maya from '../../../assets/logo/maya.jpg'
import gcash from '../../../assets/logo/gcash.png'
import { useParams } from 'react-router-dom'
import { fetchPaymentReq } from '../../../util/http';
import CustomLoader from '../../models/CustomLoader';
import ErrorSingle from '../../models/ErrorSingle';
import { titleCase } from 'title-case';
import brandLogo from '../../../assets/logo/logo_only_transparent.png'
import UploadScreenShot from './UploadScreenShot';
import { currencyFormatter } from '../../../util/formatter';
function ViewPaymentRequest() {

  const { id } = useParams();


  const { data, isPending, isError, error } = useQuery({
    queryKey: ['payment', id,],
    queryFn: ({ signal }) => fetchPaymentReq({ signal, id }),
    staleTime: 5000,
    gcTime: 30000,
    refetchInterval: 5000,
  })

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
        </div>
        <UploadScreenShot />
      </div>
    </>
  }

  return (
    <div>{content}</div>
  )
}

export default ViewPaymentRequest