import React from 'react'

function CustomTableActionItem({ row, canView }) {

    let content =
        <>
            <button
                className="solid submit fade"
            // onClick={() => {
            //     props.handleOpenEditDepartment(row.original.id);
            // }}
            >
                Edit
            </button>
            {row.original.availability === "Available" ? (
                <button
                    className="bg-red-400"
                // onClick={() => {
                //     props.handleOpenDeleteDepartment(row.original.id);
                // }}
                >
                    Deactivate
                </button>
            ) : (
                <button
                    className="solid primary fade"
                // onClick={() => {
                //     props.handleOpenActivateDepartment(
                //         row.original.id
                //     );
                // }}
                >
                    Activate
                </button>
            )}
        </>

    if (canView) {
        content = <button>View</button>
    }
    return (
        <td className="text-smm  lg:text-lg ">
            <div className='flex flex-col items-end'>
                {content}
            </div>
        </td>
    )
}

export default CustomTableActionItem