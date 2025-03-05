import { useQuery } from "@tanstack/react-query";
import { fetchNewUsers } from "../../../util/http";
import CustomLoader from "../../models/CustomLoader";
import { dbDateFormatterShort, truncateText } from "../../../util/formatter";

function ScheduleToday() {

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['users', 'recent'],
    queryFn: ({ signal }) => fetchNewUsers({ signal }),
    staleTime: 5000,
    gcTime: 30000,
    refetchInterval: 5000,
  })

  let content = <p>No new users found!</p>

  if (isPending) {
    content = <CustomLoader />
  }
  if (isError) {
    content = <div className="bg-red-200 w-full px-4 py-4">

      <p className="text-red-700">{error.response?.data?.message || 'an error occured'}</p>
    </div>
  }

  if (data && data.length > 0) {
    content =
      <table>
        <thead>
          <tr className="text-secondary_color">
            <th>Name</th>
            <th className="text-right">Date created</th>
          </tr>
        </thead>
        <tbody>
          {data.map(user => {
            const fullname = `${user.firstname} ${user.lastname}`
            return (
              <tr key={user.id}>
                <td><strong>{truncateText(fullname, 25)}</strong></td>
                <td className="text-right">{dbDateFormatterShort(user.date_created)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
  }
  return (
    <>
      <h4 className="bg-dark_font py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white">
        New users
      </h4>
      <div className="card">
        {content}
      </div>
    </>
  );
}

export default ScheduleToday;
