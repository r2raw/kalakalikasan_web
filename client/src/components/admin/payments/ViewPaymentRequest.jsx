import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { useParams } from 'react-router-dom'
import { fetchPaymentReq } from '../../../util/http';
import CustomLoader from '../../models/CustomLoader';
import ErrorSingle from '../../models/ErrorSingle';
import { titleCase } from 'title-case';
import brandLogo from '../../../assets/logo/logo_only_transparent.png'
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


    const { storeInfo, paymentInfo, userInfo } = data;

    let logoSrc = brandLogo

    if (storeInfo.store_logo) {
      logoSrc = `${import.meta.env.VITE_BASE_URL}/store-cred/store_logo/${storeInfo.store_logo}`
    }

    const fullname = `${userInfo.firstname} ${userInfo.middlename && `${userInfo.middlename} `} ${userInfo.lastname}`
    const address = `${storeInfo.street}, ${storeInfo.barangay}, ${storeInfo.city}`
    content = <>
      <div className='textured-bg px-4 py-8 rounded-md flex gap-4'>
        <img src={logoSrc} alt='store-logo' className='w-40 h-40' />
        <div className='flex flex-col gap-4'>
          <h1 className=''>{titleCase(storeInfo.store_name)}</h1>
          <h3>{titleCase(fullname)}</h3>
          <h3>{titleCase(address)}</h3>
        </div>
      </div>
      <div className='grid grid-cols-2'>
        <div>
        </div>
        <div></div>
      </div>
    </>
  }

  return (
    <div>{content}</div>
  )
}

export default ViewPaymentRequest