import React, { useRef, useState } from 'react'
import FormInput from '../../models/FormInput'
import CustomTextArea from '../../models/CustomTextArea'
import { QueryClient, useMutation } from '@tanstack/react-query';
import { feedbackFormValidation } from '../../../util/validations';
import DoneSharpIcon from '@mui/icons-material/DoneSharp';
import Modal from '../../models/ui/Modal';
import { addFeedback } from '../../../util/http'

function FeedbackForm() {

    const [formData, setFormData] = useState({
        name: '',
        message: '',
        email: '',
    })
    const dialog = useRef(null);
    const [errorForm, setErrorForm] = useState({});
    const { mutate, isPending, isError, error } = useMutation(
        {
            mutationFn: addFeedback,
            onSuccess: () => {
                setFormData({
                    name: '',
                    message: '',
                    email: '',
                });
    
                dialog.current.open()
                QueryClient.invalidateQueries({ queryKey: ['feedbacks'] });
            },
        },
    )
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))

    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e.target)
        // Validate form data
        const errorFormObj = feedbackFormValidation(formData);
        setErrorForm(errorFormObj);

        if (Object.keys(errorFormObj).length > 0) {
            setFormData({})
            return; // Stop submission if there are validation errors
        }

        // Create FormData object and extract values correctly
        const fData = new FormData(e.target);
        const data = Object.fromEntries(fData);
        mutate(data);
    };

    const handleModalClose = () => {
        setFormData(prev => ({
            name: '',
            message: '',
            email: '',
        }))
        dialog.current.close();

    }
    return (
        <>
            <Modal ref={dialog} onClose={handleModalClose} >

                <div className='flex mb-8 items-center gap-2'>
                    <DoneSharpIcon fontSize='large' sx={{ color: '#204d2c' }} />
                    <h2 className='text-dark_font'>Success</h2>
                </div>
                <p className=' max-w-[36rem] w-96 text-lg'>
                    Feedback submitted successfully!
                </p>
                <div className='mt-8 flex gap-2 justify-end'>
                    <button onClick={handleModalClose} className='bg-dark_font hover:bg-light_font rounded-md px-4 py-1 text-white'>Ok</button>
                </div>
            </Modal>
            <form onSubmit={handleSubmit} className='mx-4 lg:ml-20 relative z-40 bottom-8 lg:w-1/3 bg-slate-100/10 rounded-md my-card px-4 py-8 backdrop-blur-md flex flex-col gap-6'>
                <FormInput placeholderName={'Name'} value={formData.name} name='name' onChange={handleChange} error={errorForm.name} />
                <FormInput placeholderName={'Email'} value={formData.email} type='email' name='email' onChange={handleChange} error={errorForm.email} />
                <CustomTextArea placeholderName='Share your thoughts' value={formData.message} name='message' val={formData.message} error={errorForm.message} onChange={handleChange} />
                <button type='submit' className='bg-accent_color hover:bg-dark_font text-white rounded-md text-lg md:text-2xl lg:text-4xl py-2' disabled={isPending}>{isPending ? 'Submitting...' : 'Submit'}</button>
            </form></>
    )
}

export default FeedbackForm