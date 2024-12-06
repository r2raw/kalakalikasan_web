import React from 'react'
import CustomTable from '../../table/CustomTable'
import DUMMY_STORES from '../../../dummy_data/DUMMY_STORES.json'
import { storeColumns } from '../../table/columns/columns'
import TableViewActions from '../../table/tableActions/TableViewActions'
function StoreApplication() {
  return (
    <>
      <CustomTable tableData={DUMMY_STORES} column={storeColumns} collapsible_col={[]} actionType={<TableViewActions />} />
    </>
  )
}

export default StoreApplication