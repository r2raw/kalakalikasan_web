import React from 'react'
import CustomTable from '../../table/CustomTable'
import dummy_data from '../../../dummy_data/DUMMY_ACCOUNTS.json';
import { accountColumns } from '../../table/columns/columns';
import { NavLink } from 'react-router-dom';
import TableActivateAction from '../../table/tableActions/TableActivateAction';

const collapsible_col = ['mobile']
function ManageAccounts() {
  return (
    <>
      <div className=' flex justify-end items-center'>
        <NavLink to='add' className='bg-blue_btn text-white px-4 py-2 rounded-xl self-end shadow-lg hover:shadow-none'>Create officer account</NavLink>
      </div>
      <CustomTable tableData={dummy_data} column={accountColumns} collapsible_col={collapsible_col} actionType={<TableActivateAction />} />
    </>
  )
}

export default ManageAccounts