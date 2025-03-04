
import loader from '../../assets/gifs/bigSpinner.svg'
function CustomLoader() {
    return (
        <div className='text-dark_font flex flex-col justify-center items-center w-full h-full'>
            <img src={loader} className='h-full' alt='loading-svg' />
        </div>
    )
}

export default CustomLoader