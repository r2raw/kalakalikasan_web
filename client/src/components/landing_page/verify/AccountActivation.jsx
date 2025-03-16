import React from 'react'
import LandingLightContainer from '../../models/LandingLightContainer'
import PageHeader from '../PageHeader'
import { useMutation, useQuery } from '@tanstack/react-query';
import { activateAccount, fetchActivationLink, queryClient } from '../../../util/http';
import { useParams } from 'react-router-dom';
import CustomLoader from '../../models/CustomLoader';
import ErrorSingle from '../../models/ErrorSingle';

function AccountActivation() {

    const { id } = useParams();


    const { data, isPending, isError, error } = useQuery({
        queryKey: ['verify'],
        queryFn: ({ signal }) => fetchActivationLink({ signal, id }),
        staleTime: 5000,
        gcTime: 30000,
        refetchInterval: 5000,
    })


    const { mutate, isPending: isMutating, isError: isMutateError, error: mutateError } = useMutation(
        {
            mutationFn: activateAccount,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['verify'] });
            },
        },
    )

    const handleActivation = ()=>{
        const verData = {
            userId: data.userId,
            verificationId: id,
        } 
        mutate({data: verData});
    }

    let content = <div className='flex flex-col items-center gap-8 justify-center'>
        <h1 className='text-center text-secondary_color'>Data not found</h1>
    </div>

    if (isPending) {
        content = <CustomLoader />
    }

    if (isError) {
        content = <ErrorSingle message={error.info.error || 'An error occured'} />
    }
    if (data) {
        if (data.isUsed) {
            content = <div className='flex flex-col items-center gap-8 justify-center'>
                <h1 className='text-center text-secondary_color'>Thank You!</h1>
                <h4 className='text-center text-secondary_color'>Thank you for using our app. Enjoy your experience! </h4>
            </div>
        }

        if (!data.isUsed) {
            content = <div className='flex flex-col items-center gap-8 justify-center'>
                <h1 className='text-center text-secondary_color'>Activate Your Account</h1>
                <h4 className='text-center text-secondary_color'>Welcome! To get started, please activate your account by clicking the button below. This ensures you have full access to all features and services.</h4>
                {isMutateError && <ErrorSingle message={mutateError.info.error || 'An error occured'} />}
                <button className='px-4 py-2 bg-accent_color hover:bg-secondary_color text-white rounded-md' disabled={isMutating} onClick={handleActivation}>{isMutating ? "Activating..." : "Activate Account"}</button>
            </div>

        }
    }
    return (
        <div className='pt-44'>
            <PageHeader textHeader={'Account Activation'} />
            <LandingLightContainer>
                {content}
            </LandingLightContainer>
        </div>
    )
}

export default AccountActivation