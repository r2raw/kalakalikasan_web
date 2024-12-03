import React from 'react'
import CustomTable from '../../table/CustomTable'
import { schedColumns } from '../../table/columns/columns'
import dummy_data from '../../../dummy_data/MOCK_DATA.json';
function CollectionSchedules() {
  return (
    <div>
    <CustomTable tableData={dummy_data} column={schedColumns} /></div>
  )
}

export default CollectionSchedules