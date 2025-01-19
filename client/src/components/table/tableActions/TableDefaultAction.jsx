import React from 'react'
import EditSharpIcon from '@mui/icons-material/EditSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import { IconButton } from '@mui/material';

function TableDefaultAction({id, onEdit, onDelete}) {
    return (


        <>
            <IconButton onClick={()=>{onEdit(id)}}>
                <EditSharpIcon sx={{ color: '#737373' }} />
            </IconButton>
            <IconButton onClick={()=>{onDelete(id)}} >
                <DeleteSharpIcon  sx={{ color: '#ef4444' }} />
            </IconButton>
        </>
    )
}

export default TableDefaultAction