import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { fetchDeactivatedContent } from '../../../util/http'
import CustomTable from '../../table/CustomTable'
import { contentColumn } from '../../table/columns/columns'

function ArchivedContents() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['posts', 'archived'],
    queryFn: ({ signal }) => fetchDeactivatedContent({ signal }),
    staleTime: 30000,
  })
  let content = null;

  if (data && data.length > 0) {
    content = <CustomTable
      tableData={data}
      column={contentColumn}
      collapsible_col={[]}
      actionType='restore' />
  }
  return (
    <div>
      {content}
    </div>
  )
}

export default ArchivedContents