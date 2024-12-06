import React from 'react'
import BarangaySummaryItem from './BarangaySummaryItem'

function BarangayCollectionSummary() {
    return (

        <div className="flex flex-col gap-4 card text-light_font">
            <h5 className='text-center'>Number of collected wastes in every barangay</h5>
            <div className="w-full flex flex-col gap-4">
                <BarangaySummaryItem />
                <BarangaySummaryItem />
                <BarangaySummaryItem />
                <BarangaySummaryItem />
                <BarangaySummaryItem />
                <BarangaySummaryItem />
                <BarangaySummaryItem />
            </div>
        </div>
    )
}

export default BarangayCollectionSummary