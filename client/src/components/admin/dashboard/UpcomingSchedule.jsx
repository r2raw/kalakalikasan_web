import { useQuery } from "@tanstack/react-query";
import { fetchNewStores } from "../../../util/http";
import CustomLoader from "../../models/CustomLoader";
import { titleCase } from "title-case";
import { dbDateFormatterShort, truncateText } from "../../../util/formatter";

function UpcomingSchedule() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['stores', 'recent'],
    queryFn: ({ signal }) => fetchNewStores({ signal }),
    staleTime: 5000,
    gcTime: 30000,
    refetchInterval: 5000,
  })

  let content = <p>No new stores found!</p>

  if (isPending) {
    content = <CustomLoader />
  }
  if (isError) {
    content = <div className="bg-red-200 w-full px-4 py-4">

      <p className="text-red-700">{error.info?.message || 'an error occured'}</p>
    </div>
  }
  if (data && data.length > 0) {
    content =
      <table>
        <thead>
          <tr className=" text-secondary_color">
            <th>Store name</th>
            <th className="text-right">Date Approved</th>
          </tr>
        </thead>
        <tbody>
          {data.map(store => {
            return (
              <tr key={store.id}>
                <td><strong>{truncateText(titleCase(store.store_name), 20)}</strong></td>
                <td className="text-right">{dbDateFormatterShort(store.approval_date)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
  }
  return (
    <>
      <h4 className="bg-dark_font py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white">
        Newly approved stores
      </h4>
      <div className="card">
        {content}
      </div>
    </>
  );
}

export default UpcomingSchedule;
