
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';


import imgsample from '../../assets/logo/logo_only_transparent.png'
import { getURLString } from '../../myFunctions/myFunctions';
import { fetchStoreInfo } from '../../util/http';
import ErrorBlock from '../../components/models/ErrorBlock';
import { useQuery } from '@tanstack/react-query';
import { titleCase } from 'title-case';
import { dbDateFormatter } from '../../util/formatter';


function ViewStoreApplicationLayout() {
    const navigate = useNavigate();

    const { id } = useParams();
    const location = useLocation();

    const isViewingPDF = getURLString(location, 5)

    let fullname;
    let storeName;
    let applicationDate;
    let content = <></>;
    let points = 0;
    let logo = <img src={imgsample} alt='sample img' className=' w-48 h-48' />;

    const { data, isPending, isError, error } = useQuery({
        queryKey: ['stores', id],
        queryFn: ({ signal }) => fetchStoreInfo({ signal, id: id }),
        staleTime: 3000,
        gcTime: 30000,
        refetchInterval: 3000,
    })

    if (isPending) {
        fullname = 'Loading...'
        applicationDate = 'Loading...'
        storeName = 'Loading...';
        content = <p>Fetching data...</p>
    }

    if (isError) {
        fullname = 'Something went wrong'
        storeName = 'Something went wrong'
        applicationDate = 'Something went wrong'
        content = <ErrorBlock message={error.info?.errors || ['Failed to load data.']} />
    }
    const handleClick = () => {
        let goTo = '../';

        if (isViewingPDF) {
            goTo = './';
        }
        navigate(goTo)
    }



    if (data) {
        fullname = `${titleCase(data.firstname)}${data.middlename && ` ${titleCase(data.middlename)}`} ${titleCase(data.lastname)}`
        storeName = titleCase(data.store_name)
        applicationDate = dbDateFormatter(data.application_date)
        points = data.points
        console.log(dbDateFormatter(data.application_date))
        if (data.store_logo) {
            logo = <img src={`${import.meta.env.VITE_BASE_URL}/store-cred/store_logo/${data.store_logo}`} alt={data.store_name + '-logo'} className='h-48 w-48' />
        }
        content = <Outlet context={data} />
    }

    return (
        <>
            <button onClick={handleClick} className='text-dark_font mb-8'>
                <ArrowBackSharpIcon />
            </button>
            <div className='my-card bg-white px-4 py-4 text-light_font flex flex-col gap-4'>
                <div className='px-4 py-6 rounded-md my-card flex gap-4 textured-bg items-center'>
                    {logo}
                    <div>
                        <h2>{storeName}</h2>
                        <h5>Owner: {fullname}</h5>
                        <p>Date of Application: {applicationDate}</p>
                        <p>Current points accumulated: {points}</p>
                    </div>
                </div>
                {content}
            </div>
        </>
    )
}

export default ViewStoreApplicationLayout