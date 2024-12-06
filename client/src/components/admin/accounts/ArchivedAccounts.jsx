import React from 'react'

import CustomTable from '../../table/CustomTable'
import TableRestoreActions from '../../table/tableActions/TableRestoreActions'
import dummy_data from '../../../dummy_data/DUMMY_ACCOUNTS.json';
import { accountColumns } from '../../table/columns/columns';

const collapsible_col = ['mobile']
function ArchivedAccounts() {
  return (
    <div>
      <CustomTable tableData={dummy_data} column={accountColumns} collapsible_col={collapsible_col} actionType={<TableRestoreActions />} /></div>
  )
}

export default ArchivedAccounts