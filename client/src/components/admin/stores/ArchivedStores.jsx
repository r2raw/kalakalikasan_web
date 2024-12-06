import React from 'react'
import CustomTable from '../../table/CustomTable'
import DUMMY_STORES from '../../../dummy_data/DUMMY_STORES.json'
import { storeColumns } from '../../table/columns/columns'
import TableRestoreActions from '../../table/tableActions/TableRestoreActions'
function ArchivedStores() {
  return (
      <>
        <CustomTable tableData={DUMMY_STORES} column={storeColumns} collapsible_col={[]} actionType={<TableRestoreActions />} />
      </>
  )
}

export default ArchivedStores