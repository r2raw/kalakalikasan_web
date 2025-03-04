import { useQuery } from "@tanstack/react-query"
import { fetchMostReactedContents } from "../../../util/http"
import CustomLoader from "../../models/CustomLoader"
import { titleCase } from "title-case"
import { truncateText } from "../../../util/formatter"

function TopReactedContents() {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['contents', 'most'],
        queryFn: ({ signal }) => fetchMostReactedContents({ signal }),
        staleTime: 5000,
        gcTime: 30000,
        refetchInterval: 5000,
    })

    let content = <p>No reacted contents found</p>

    if (isPending) {
        content = <CustomLoader />
    }

    if (isError) {
        content = <div className="bg-red-200 w-full px-4 py-4">

            <p className="text-red-700">{error.info?.error || 'an error occured'}</p>
        </div>
    }

    if (data && data.length > 0) {

        console.log(data)
        content =
            <table className="w-full">
                <thead>
                    <tr className="text-secondary_color">
                        <th>Title</th>
                        <th className=" text-right">React counts</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(content => {
                        
                        return (
                            <tr key={content.contentId}>
                                <td>{truncateText(titleCase(content.title), 25)}</td>
                                <td className=" text-right">{content.count}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
    }
    return (
        <>
            <h4 className="bg-dark_font py-2 px-4 rounded-md shadow-md hover:shadow-none text-center text-white">
                Most reacted contents
            </h4>
            <div className="card">
                {content}
            </div>
        </>
    )
}

export default TopReactedContents