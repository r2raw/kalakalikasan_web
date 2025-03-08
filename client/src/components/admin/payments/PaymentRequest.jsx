import React from 'react'
import CustomTable from '../../table/CustomTable'
import { paymentColumns, schedColumns } from '../../table/columns/columns'
import dummy_data from '../../../dummy_data/MOCK_DATA.json';
import TableDefaultAction from '../../table/tableActions/TableDefaultAction';
import { fetchPendingPayments } from '../../../util/http';
import CustomLoader from '../../models/CustomLoader';
import ErrorBlock from '../../models/ErrorBlock';
import ErrorSingle from '../../models/ErrorSingle';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
function PaymentRequest() {

  const navigate = useNavigate()
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['payments'],
    queryFn: ({ signal }) => fetchPendingPayments({ signal }),
    staleTime: 3000,
    gcTime: 30000,
    refetchInterval: 3000,
  })


  const handleViewClick = (id) => {
    navigate('./' + id)
  }

  let content = <p>No payments found</p>

  if (isPending) {
    content = <CustomLoader />
  }


  if (isError) {
    content = <ErrorSingle message={error.info?.error || 'Failed to load data.'} />
  }
  if (data && data.length > 0) {
    content = <CustomTable
      tableData={data}
      column={paymentColumns}
      collapsible_col={['date_requested']}
      canView={false}
        actionType='view'
      onView={handleViewClick} />
  }
  return (
    <div>
      {content}
    </div>
  )
}

export default PaymentRequest