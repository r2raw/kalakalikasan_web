import React, { useRef, useState } from 'react'
import { Worker, Viewer } from "@react-pdf-viewer/core";
import '@react-pdf-viewer/core/lib/styles/index.css';
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { useOutletContext } from 'react-router-dom';


function ViewBarangayPermit() {
    const viewerRef = useRef(null);
    const [zoomPluginInstance] = useState(zoomPlugin());
    const [defaultLayoutPluginInstance] = useState(defaultLayoutPlugin());
    const {barangay_permit} = useOutletContext();
    const url = `${import.meta.env.VITE_BASE_URL}/store-cred/barangay-permit/${barangay_permit}`
    const handleLoadSuccess = () => {
        console.log(viewerRef.current)
        if (viewerRef.current) {
            const { width } = viewerRef.current.getPageSize(0); // Get the width of the first page
            const containerWidth = viewerRef.current.container.clientWidth; // Get the width of the container
            const zoomLevel = (containerWidth / width) * 100; // Calculate zoom level to fit width

            zoomPluginInstance.setZoom(zoomLevel);
        }
    };
    return (
        <>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                    fileUrl={url}
                    ref={viewerRef}
                    plugins={[defaultLayoutPluginInstance, zoomPluginInstance]}
                    onLoadSuccess={handleLoadSuccess} // Call the custom zoom function when the PDF is loaded
                />
            </Worker>
        </>
    )
}

export default ViewBarangayPermit