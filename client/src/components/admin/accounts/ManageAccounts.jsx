import React, { useRef, useState } from 'react'
import CustomTable from '../../table/CustomTable'
import dummy_data from '../../../dummy_data/DUMMY_ACCOUNTS.json';
import { accountColumns } from '../../table/columns/columns';
import { NavLink, useNavigate } from 'react-router-dom';
import TableActivateAction from '../../table/tableActions/TableDefaultAction';
import { deactivateUser, fetchActiveUsers, queryClient } from '../../../util/http';
import { useMutation, useQuery } from '@tanstack/react-query';
import ErrorBlock from '../../models/ErrorBlock';
import Modal from '../../models/ui/Modal';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import { usersAction } from '../../../store/slices/usersSlice';
import { uiActions } from '../../../store/slices/uiSlice';
import { useDispatch, useSelector } from "react-redux";
const collapsible_col = ['mobile_num', 'email']
function ManageAccounts() {

  const dialog = useRef(null);
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.users)
  const modalErrorSelector = useSelector((state) => state.ui)
  const modalError = modalErrorSelector.errorMessage;

  const navigate = useNavigate();
  const isDeletingId = selector.isDeleting;


  const { data, isPending, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: ({ signal }) => fetchActiveUsers({ signal }),
    staleTime: 3000,
    gcTime: 30000,
    refetchInterval: 3000,
  })

  const { mutate, isPending: pendingDeletion, isError: isDeletionError, error: deletionError } = useMutation({
    mutationFn: deactivateUser,
        onError:(error)=>{
    
          dispatch(uiActions.handleErrorMessage(error.info?.errors))
          setTimeout(() => {
            dispatch(uiActions.handleErrorMessage(null))
          }, 3000)
        },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleCloseDeleteModal()
      
    },
  })


  const handleDelete = () => {
    mutate({ data: isDeletingId })
  }

  const handleOpenDeleteModal = (id) => {
    dispatch(usersAction.handleDelete(id))
    dialog.current.open()

  }
  const handleCloseDeleteModal = () => {
    dispatch(usersAction.handleDelete(null))
    dialog.current.close();
  }


  const handleEdit = (id)=>{
    navigate(`edit/${id}`)
  }
  let content = <></>

  if (isPending) {
    content = <p>Fetching data...</p>
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
        actionType='default'
        onEdit={handleEdit}
        onDelete={handleOpenDeleteModal} />
    }

  }



  let formAction = <>
    <button className='hover:bg-slate-200 px-4 py-1 rounded-lg text-light_font' onClick={handleCloseDeleteModal}>Cancel</button>
    <button onClick={handleDelete} className='bg-red-500 px-4 py-1 rounded-lg text-white hover:bg-red-400' >Delete</button>
  </>

  if (pendingDeletion) {
    formAction = <p>Deleting...</p>
  }

  return (
    <>
      <Modal ref={dialog} onClose={handleCloseDeleteModal}>

        <div className='flex mb-8 items-center gap-2'>
          <DeleteSharpIcon fontSize='large' sx={{ color: '#ef4444' }} />
          <h2 className='text-red-500'>Delete</h2>
        </div>
        <p className=' max-w-[36rem] text-lg'>
          Are you sure you want to delete this user?
        </p>
        <div className='mt-8 flex gap-2 justify-end'>
          {formAction}
        </div>
        {modalError && <ErrorBlock message={modalError} />}

      </Modal>
      <div className=' flex justify-end items-center'>
        <NavLink to='../add' className='bg-blue_btn text-white px-4 py-2 rounded-xl self-end shadow-lg hover:shadow-none'>Create officer account</NavLink>
      </div>
      {content}
    </>
  )
}

export default ManageAccounts