import React from 'react'
import PageHeader from '../PageHeader'
import LandingLightContainer from '../../models/LandingLightContainer'
import phoneImage from '../../../assets/images/phone_notalike.png'
function Features() {
  return (
    <div className='pt-44'>
      <PageHeader textHeader={'App Features'} />
      <LandingLightContainer>
        <div className='flex flex-col gap-16'>
          <div className='flex justify-around gap-4 items-center flex-col lg:flex-row lg:px-80'>
            <div>
              <h1 className='pb-12 text-secondary_color'>As Eco-Actor</h1>
              <ul>
                <li><h2 className='text-secondary_color text-xl lg:text-3xl'>• Engage to Content</h2></li>
                <li><h2 className='text-secondary_color text-xl lg:text-3xl'>• QR Code Generation</h2></li>
                <li><h2 className='text-secondary_color text-xl lg:text-3xl'>• Barcode Scanning</h2></li>
                <li><h2 className='text-secondary_color text-xl lg:text-3xl'>• Transact with Store</h2></li>
                <li><h2 className='text-secondary_color text-xl lg:text-3xl'>• View Transactions</h2></li>
                <li><h2 className='text-secondary_color text-xl lg:text-3xl'>• Register a Store</h2></li>
              </ul>
            </div>
            <img src={phoneImage} className='w-40 h-40 lg:w-96 lg:h-[70dvh]' />
          </div>
          <div className='flex justify-around items-center gap-4 flex-col lg:flex-row lg:px-80'>
            <div className='lg:order-2'>
              <h1 className='pb-12 text-secondary_color'>As Eco-Partner</h1>
              <ul >
                <li><h2 className='text-secondary_color text-xl lg:text-3xl'>• Manage Products</h2></li>
                <li><h2 className='text-secondary_color text-xl lg:text-3xl'>• QR Code Scanning</h2></li>
                <li><h2 className='text-secondary_color text-xl lg:text-3xl'>• Barcode Scanning</h2></li>
                <li><h2 className='text-secondary_color text-xl lg:text-3xl'>• Redeem Eco-Coins </h2></li>
                <li><h2 className='text-secondary_color text-xl lg:text-3xl'>• View Sales Report</h2></li>
                <li><h2 className='text-secondary_color text-xl lg:text-3xl'>• View Transactions</h2></li>
              </ul>
            </div>
            <img src={phoneImage} className='w-40 h-40 lg:w-96 lg:h-[70dvh]' />
          </div>
        </div>
      </LandingLightContainer>
    </div>
  )
}

export default Features