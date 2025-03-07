import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { fetchTopPurchase } from '../../../util/http'
import CustomLoader from '../../models/CustomLoader'
import { titleCase } from 'title-case'
import ErrorSingle from '../../models/ErrorSingle'

function TopPurchases() {
    const { id } = useParams()
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['stores', id, 'most'],
        queryFn: ({ signal }) => fetchTopPurchase({ signal, id }),
        staleTime: 5000,
        gcTime: 30000,
        refetchInterval: 5000,
    })

    let content = <p>No purchases found!</p>


    if (isPending) {
        content = <CustomLoader />
    }

    if(isError){
        content = <ErrorSingle message={error.info?.error || 'An error occured'} />
    }

    if (data && data.length > 0) {
        content = <table>
            <thead>
                <tr className="text-secondary_color">
                    <th>Product</th>
                    <th className='text-right'>Quantity</th>
                </tr>
            </thead>
            <tbody>
                {data.map(product => <tr key={product.product_id}>
                    <td><strong>{titleCase(product.product_name)}</strong></td>
                    <td className='text-right'>{product.total_quantity}</td>
                </tr>)}
            </tbody>
        </table>
    }
    return (
        <div className=' flex flex-col gap-4'>
            <h4 className="bg-dark_font w-full py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white">
                Top products
            </h4>
            <div className='card'>
                {content}
            </div>
        </div>
    )
}

export default TopPurchases