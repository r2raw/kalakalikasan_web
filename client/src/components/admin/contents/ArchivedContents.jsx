import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useRef } from 'react'
import { fetchDeactivatedContent, queryClient, restoreContent } from '../../../util/http'
import CustomTable from '../../table/CustomTable'
import { contentColumn } from '../../table/columns/columns'
import { useParams } from 'react-router-dom'
import ErrorSingle from '../../models/ErrorSingle'
import RestoreFromTrashSharpIcon from '@mui/icons-material/RestoreFromTrashSharp';
import { useDispatch, useSelector } from 'react-redux'
import { usersAction } from '../../../store/slices/usersSlice'
import { uiActions } from '../../../store/slices/uiSlice'
import Modal from '../../models/ui/Modal'
import CustomLoader from '../../models/CustomLoader'


function ArchivedContents() {

  const dialog = useRef(null)
  const dispatch = useDispatch()
  const selector = useSelector((state) => state.users)
  const restoringId = selector.isRestoring;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['contents', 'archived'],
    queryFn: ({ signal }) => fetchDeactivatedContent({ signal }),
    staleTime: 30000,
  })
  let content = <div className='flex items-center justify-center h-[75dvh]'><h1 className='text-center text-secondary_color'>No archived contents found!</h1></div>;


  const { mutate, isPending: pendingRestore, isError: isRestoreError, error: restoreError } = useMutation({
    mutationFn: restoreContent,
    onError: (error) => {

      dispatch(uiActions.handleErrorMessage(error.info?.errors))
      setTimeout(() => {
        dispatch(uiActions.handleErrorMessage(null))
      }, 3000)
    },
    onSuccess: () => {
      handleCloseRestoreModal()
      queryClient.invalidateQueries({ queryKey: ['contents'] });
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

  if(isPending){
    content = <div className='h-[75dvh]'><CustomLoader/></div>
  }
  let formAction = <>
    <button className='hover:bg-slate-200 px-4 py-1 rounded-lg text-light_font' onClick={handleCloseRestoreModal}>Cancel</button>
    <button onClick={handleRestore} className='bg-dark_font px-4 py-1 rounded-lg text-white hover:bg-light_font' >Restore</button>
  </>

  if (pendingRestore) {
    formAction = <p>Restoring...</p>
  }

  if (data && data.length > 0) {
    content = <CustomTable
      tableData={data}
      column={contentColumn}
      collapsible_col={[]}
      actionType='restore'
      onRestore={handleOpenRestoreModal} />
  }

  return (
    <>

      <Modal ref={dialog} onClose={handleCloseRestoreModal}>
        <div className='flex mb-8 items-center gap-2'>
          <RestoreFromTrashSharpIcon fontSize='large' sx={{ color: '#204d2c' }} />
          <h2 className='text-dark_font'>Restore</h2>
        </div>
        <p className=' max-w-[36rem] text-lg'>
          Are you sure you want to restore this content?
        </p>
        <div className='mt-8 flex gap-2 justify-end'>
          {formAction}
        </div>

        {isRestoreError && <ErrorSingle message={restoreError.info?.error || 'Failed to load data.'} />}
      </Modal>
      {content}
    </>
  )
}

export default ArchivedContents