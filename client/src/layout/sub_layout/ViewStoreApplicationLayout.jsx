import React from 'react'
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';


import imgsample from '../../assets/images/brand_logo.png'
import { getURLString } from '../../myFunctions/myFunctions';


function ViewStoreApplicationLayout() {
    const navigate = useNavigate();

    const location = useLocation();

    const isViewingPDF = getURLString(location, 5)

    const handleClick = (e)=>{
        let goTo = '../';

        if(isViewingPDF){
            goTo = './';
        }
        navigate(goTo)
    }


    return (
        <>
            <button onClick={handleClick} className='text-dark_font mb-8'>
                <ArrowBackSharpIcon />
            </button>
            <div className='my-card bg-white px-4 py-4 text-light_font flex flex-col gap-4'>
                <div className='px-4 py-6 rounded-md my-card flex gap-4 textured-bg items-center'>
                    <img src={imgsample} alt='sample img' />
                    <div>
                        <h2>Store Name</h2>
                        <h5>Owner: Juan Dela Cruz</h5>
                        <p>Date of Application: January 1, 2025</p>
                        <p>Current points accumulated: 100</p>
                    </div>
                </div>
                <Outlet />
            </div>
        </>
    )
}

export default ViewStoreApplicationLayout