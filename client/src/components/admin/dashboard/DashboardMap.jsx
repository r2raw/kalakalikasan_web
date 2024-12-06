import React, { useState } from 'react'
import {
    AdvancedMarker,
    APIProvider,
    InfoWindow,
    Map

} from '@vis.gl/react-google-maps';



const coords = { lat: 14.648282, lng: 121.049850 };
function DashboardMap() {

    console.log(import.meta.env.VITE_MAPS_API)

    const [open, setOpen]=useState(false);
    return (
        <APIProvider apiKey={import.meta.env.VITE_MAPS_API}>
            <div className='h-80 shadow-lg hover:shadow-none'>
                <Map minZoom={10} maxZoom={0} center={coords} mapId={'94fc902b94e60099'}/>
                <AdvancedMarker position={coords} onClick={()=> setOpen(true)}></AdvancedMarker>
                {open && <InfoWindow position={coords} onCloseClick={()=> setOpen(false)}>
                    <p>123123</p>
                </InfoWindow>}
            </div>
        </APIProvider>
    )
}

export default DashboardMap