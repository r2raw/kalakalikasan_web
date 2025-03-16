import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { fetchStoreData } from '../../../util/http'
import { useNavigate, useParams } from 'react-router-dom'
import logo from '../../../assets/logo/logo_only_transparent.png'
import ecocoin from '../../../assets/logo/ecocoin.png'
import CustomLoader from '../../models/CustomLoader'
import { titleCase } from 'title-case'
import ErrorSingle from '../../models/ErrorSingle'
import TopPurchases from './TopPurchases'
import AccumulatedPoints from './AccumulatedPoints'
import SalesTrendChart from './SalesTrendChart'
import { IconButton } from '@mui/material'
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
function ViewStore() {
  const { id } = useParams()

  const navigate = useNavigate()

  const handleBack = () => {
    navigate('..')
  }
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['stores', id],
    queryFn: ({ signal }) => fetchStoreData({ signal, id }),
    staleTime: 5000,
    gcTime: 30000,
    refetchInterval: 5000,
  })

  let storeName = 'Unknown'
  let ownerName = 'Unkown'
  let address = 'Unknown'
  let currentPoints = 'Unknown'
  let logoSrc = logo
  if (isPending) {
    storeName = 'Loading...'
    ownerName = 'Loading...'
    address = 'Loading...'
    currentPoints = 'Loading...'
  }

  if (data) {

    const { owner, store } = data;
    if (owner) {
      const { firstname, middlename, lastname, points } = owner;

      const fullname = `${firstname} ${middlename && `${middlename} `} ${lastname}`
      storeName = titleCase(store.store_name)
      ownerName = titleCase(fullname);
      currentPoints = points
    }

    if (store) {
      const { street, barangay, city, province, zip } = store

      const fullAddress = `${street}, ${barangay}, ${city}, ${zip}, ${province}`

      address = titleCase(fullAddress)
      if (store.store_logo) {
        logoSrc = `${import.meta.env.VITE_BASE_URL}/store-cred/store_logo/${store.store_logo}`
      }
    }
  }
  return (
    <>

      <IconButton onClick={handleBack} className='text-accent_color fill-accent_color mb-8'>
        <ArrowBackSharpIcon className="text-accent_color fill-current" />
      </IconButton>
      <div className='flex flex-col gap-4'>
        {isError && <ErrorSingle message={error.info?.error || 'An error occured'} />}
        <div className='textured-bg w-full flex flex-col md:flex-row gap-4 items-center px-4 py-6 rounded-md shadow-cardShadow'>
          <img src={logoSrc} alt='storelogo' className='w-40 h-40 object-cover rounded-md' />
          <div className='text-secondary_color'>
            <h2 className='text-center md:text-left'>{storeName}</h2>
            <h3 className='text-center md:text-left'>{ownerName}</h3>
            <p className='text-center md:text-left'>{address}</p>
            <div className='flex gap-1 items-center justify-center md:justify-start'>
              <img src={ecocoin} alt='token' className='w-8 h-8' />
              <strong><p className='text-2xl'>{currentPoints}</p></strong>
            </div>
          </div>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <TopPurchases />
          <AccumulatedPoints />
          <SalesTrendChart />
        </div>
      </div>
    </>
  )
}

export default ViewStore