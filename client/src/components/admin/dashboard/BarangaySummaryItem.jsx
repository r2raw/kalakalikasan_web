import React from 'react'

import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
function BarangaySummaryItem() {
    return (
        <div className="flex justify-between">
            <div className="flex gap-4 items-center">
                <LocationOnSharpIcon />
                <h5>Holy Spirit</h5>
            </div>
            <div className="flex ">
                <h5>1,200</h5>
            </div>
        </div>
    )
}

export default BarangaySummaryItem