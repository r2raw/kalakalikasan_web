import { useEffect, useRef } from 'react'

import CustomTable from '../../table/CustomTable'
import { accountColumns } from '../../table/columns/columns';
import { activateUser, fetchInactiveUsers, queryClient } from '../../../util/http';
import { useMutation, useQuery } from '@tanstack/react-query';
import ErrorBlock from '../../models/ErrorBlock'
import Modal from '../../models/ui/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { usersAction } from '../../../store/slices/usersSlice';
import { uiActions } from '../../../store/slices/uiSlice';
import RestoreFromTrashSharpIcon from '@mui/icons-material/RestoreFromTrashSharp';
import CustomLoader from '../../models/CustomLoader';

const collapsible_col = ['mobile_num', 'email', 'role']
function ArchivedAccounts() {


  const dialog = useRef(null)

  const dispatch = useDispatch()
  const selector = useSelector((state) => state.users)
  const restoringId = selector.isRestoring;
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['users', 'inactive'],
    queryFn: ({ signal }) => fetchInactiveUsers({ signal }),
    staleTime: 3000,
    gcTime: 30000,
    refetchInterval: 3000,
  })


  const { mutate, isPending: pendingRestore, isError: isRestoreError, error: restoreError } = useMutation({
    mutationFn: activateUser,
    onError:(error)=>{

      dispatch(uiActions.handleErrorMessage(error.info?.errors))
      setTimeout(() => {
        dispatch(uiActions.handleErrorMessage(null))
      }, 3000)
    },
    onSuccess: () => {
      handleCloseRestoreModal()
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  })

  const handleRestore = () => {
    mutate({ data: restoringId })
  }


  const handleOpenRestoreModal = (id) => {
    dispatch(usersAction.handleRestore(id))
    dialog.current.open()

  }
  const handleCloseRestoreModal = () => {
    dispatch(usersAction.handleRestore(null))
    dialog.current.close()
  }

  let content = <></>

  if (isPending) {
    content = <CustomLoader />
  }

  if (isError) {
    content = <ErrorBlock message={error.info?.errors || ['Failed to load data.']} />
  }

  if (data) {
    if (data.length == 0) {
      content = <div className=' my-auto w-full flex justify-center items-center text-light_font'><h1>No user found!</h1></div>
    }
    if (data.length > 0) {
      content = <CustomTable
        tableData={data}
        column={accountColumns}
        collapsible_col={collapsible_col}
        actionType='restore'
        moduleType='accounts'
        onRestore={handleOpenRestoreModal} />
    }
  }

  let formAction = <>
    <button className='hover:bg-slate-200 px-4 py-1 rounded-lg text-light_font' onClick={handleCloseRestoreModal}>Cancel</button>
    <button onClick={handleRestore} className='bg-dark_font px-4 py-1 rounded-lg text-white hover:bg-light_font' >Restore</button>
  </>

  if (pendingRestore) {
    formAction = <p>Restoring...</p>
  }


  return (
    <>

      <Modal ref={dialog} onClose={handleCloseRestoreModal}>
        <div className='flex mb-8 items-center gap-2'>
          <RestoreFromTrashSharpIcon fontSize='large' sx={{ color: '#204d2c' }} />
          <h2 className='text-dark_font'>Restore</h2>
        </div>
        <p className=' max-w-[36rem] text-lg'>
          Are you sure you want to restore this user?
        </p>
        <div className='mt-8 flex gap-2 justify-end'>
          {formAction}
        </div>
        
        {isRestoreError && <ErrorBlock message={restoreError.info?.errors || ['Failed to load data.']} />}
      </Modal>
      {content}
    </>
  )
}

export default ArchivedAccounts