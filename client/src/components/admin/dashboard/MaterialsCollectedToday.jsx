import React from 'react'
import CustomLoader from '../../models/CustomLoader'
import { fetchMaterialsToday } from '../../../util/http'
import { useQuery } from '@tanstack/react-query'

function MaterialsCollectedToday() {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['bin', 'materials'],
        queryFn: ({ signal }) => fetchMaterialsToday({ signal }),
        staleTime: 5000,
        gcTime: 30000,
        refetchInterval: 5000,
    })

    let content = <p>No new materials collected!</p>

    if (isPending) {
        content = <CustomLoader />
    }
    if (isError) {
        content = <div className="bg-red-200 w-full px-4 py-4">

            <p className="text-red-700">{error.info?.message || 'an error occured'}</p>
        </div>
    }
    if (data && Object.keys(data.materials).length > 0) {
        content = (
            <table>
                <thead>
                    <tr className="text-secondary_color">
                        <th>Material</th>
                        <th>Weight (grams)</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data.materials).map(([materialName, totalCollected], index) => (
                        <tr key={index}>
                            <td>{materialName}</td>
                            <td>{totalCollected}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
    
    return (
        <>
            <h4 className="bg-dark_font py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white">
                Recyclable materials collected
            </h4>
            <div className="card">
                {content}
            </div>
        </>
    )
}

export default MaterialsCollectedToday