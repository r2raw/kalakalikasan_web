

import React, { forwardRef } from 'react'
import { currencyFormatter, dbDateFormatter, fullDateFormatter } from '../../../util/formatter';

import batasan_logo from '../../../assets/logo/batasan_logo.png'
import app_logo from '../../../assets/logo/logo_transparent.png'
import eco_coin from '../../../assets/logo/ecocoin.png'
const RvmExpenseView = forwardRef(function RvmExpenseView({ filteredData, dateRange, totalExpense, description }, ref) {
    return (
        <div className=' w-[50dvw] print-area print-signature' ref={ref}>
            <div className=' flex gap-4 items-center justify-between'>
                <img src={batasan_logo} className='h-40 w-40 print:text-lg' />
                <div className='flex flex-col items-center justify-center'>
                    <h2 className='text-center'>Barangay Batasan Hills</h2>
                    <h4 className='text-center'>KalaKalikasan Expense Report</h4>
                    <p>Saret St., IBP Road corner San Mateo Road</p>
                    <p>brgybatasanhills@gmail.com</p>
                    <p>0917 502 5154</p>
                </div>
                <img src={app_logo} className='h-40 w-40' />
            </div>
            <div className='my-8'>
                <table>
                    <tbody>
                        <tr>
                            <td className=' font-bold'>From:
                            </td>
                            <td>{fullDateFormatter(dateRange.from)}</td>
                        </tr>
                        <tr>
                            <td className=' font-bold'>To:</td>
                            <td>{fullDateFormatter(dateRange.to)}</td>
                        </tr>
                        <tr>
                            <td className='font-bold'>Description:</td>
                            <td>{description}</td>
                        </tr>
                        <tr>
                            <td className='font-bold'>Total Expense:</td>
                            <td>{currencyFormatter(totalExpense)}</td>
                        </tr>
                        <tr>
                            <td className='font-bold'>Date:</td>
                            <td>{fullDateFormatter(Date.now())}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <table className='w-full'>
                <thead>
                    <tr className='bg-accent_color text-white'>
                        <th className='text-start'>Type</th>
                        <th>Method</th>
                        <th>Points</th>
                        <th>Amount</th>
                        <th>Date Claimed</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(item => {

                        return (
                            <tr key={item.id} className='even:bg-pastel_green'>
                                <td>{item.type}</td>
                                <td>{item.method}</td>
                                <td>{<div className='flex items-center gap-1'><img src={eco_coin} alt='eco coin' className='w-4 h-4'/>{item.points}</div>}</td>
                                <td>{currencyFormatter(item.amount)}</td>
                                <td>{dbDateFormatter(item.claiming_date)}</td>
                            </tr>
                        )
                    })
                    }
                </tbody>
            </table>
            <div className=' flex items-end justify-end mt-20 mr-8'>
                <div className='flex flex-col justify-center items-center'>
                    <h6 className=' underline underline-offset-4'>HON. JOJO M. ABAD</h6>
                    <p>Punong Barangay</p>
                </div>
            </div>
        </div>
    )
});

export default RvmExpenseView