import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { getURLString } from '../../myFunctions/myFunctions';
import { useQuery } from '@tanstack/react-query';
import { fetchUserData } from '../../util/http';
import _ from 'lodash';

function MyProfileLayout() {

    const location = useLocation();

    const userId = localStorage.getItem('id');
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['user', { id: userId }],
        queryFn: ({ signal }) => fetchUserData({ signal, id: userId }),

    })

    const currLoc = getURLString(location)

    let linkContent = <Link to='update-profile'>
        <p>{"Update profile >>"}</p>
    </Link>

    if (currLoc == 'update-profile') {
        linkContent = <Link to='./'>
            <p>{'<< Go back to profile'}</p>
        </Link>
    }
    let bannerText = 'Mr. Administrator Admin'

    if(isPending){
        bannerText = 'Loading...'
    }

    if(isError){
        bannerText =  error.info?.errors[0]  || 'Error fetching user name'
    }

    if(data){
        const {firstname, lastname} = data;
        bannerText = `Mr. ${_.startCase(firstname)} ${_.startCase(lastname)}`
    }
    return (
        <div className=' -z-50'>

            <div className={`-full rounded-md px-4 py-8 relative textured-bg  text-dark_font `}>

                <h1 className=''> Welcome,</h1>
                <h3>{bannerText}</h3>
                {linkContent}
                <div className='bg-neutral-400 w-40 h-40 rounded-full absolute right-4 top-4'></div>
            </div>
            <Outlet />
        </div>
    )
}

export default MyProfileLayout