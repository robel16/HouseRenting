import { useEffect, useState } from 'react';
import {Avatar, Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useValue } from '../../../context/ContextProvider';
import {getUsers} from '../../../actions/user'
import UsersActions from './UsersActions';
import { grey } from "@mui/material/colors";


const Users = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);

  const {
    state: { openLogin, currentUser,users },
    dispatch,
  } = useValue();
  const [rowId, setRowId] = useState(null)
//console.log(currentUser)
   useEffect(()=>{
    if (users.length===0) getUsers(dispatch)
   },[users])
  
  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 0.75,
      hide: true,
    },
    {
      field: "photoURL",
      headerName: "Avator",
      flex: 0.3,
      renderCell: (params) =><Avatar src={params.row.photoURL}/>,
      sortable: false,
      filterable: false,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.3,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.4,
    },
    {
      field: "active",
      headerName: "Active",
      flex: 0.4,
      type:'boolean',       
      editable: true
    },
   {
      field: "role",
      headerName: "Role",
      flex: 0.4,
      type:'singleSelect', 
      valueOptions:['user', 'admin'],
      editable: true
    },
    {
      field: "interview",
      headerName: "Interview",
      flex: 0.4,
      editable: true
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      renderCell: (params) => <UsersActions {...{params, rowId , setRowId}}/>
    },
    
  ];
  return(
    <Box
    sx={{
      height:400,
      width:'100%'
    }}>
      <Typography
      variant='h3'
      componet='h3'
      sx={{textAlign:'center', mt:3, mb:3}}>
        Manage users
      </Typography>
      <DataGrid 
         // loading={openLogin || !users}
          getRowId={(row) => row._id}
          rows={users}
          columns={columns}
         /* components={{
            ColumnMenu: CustomColumnMenu,
          }}*/
          getRowSpacing={params=>({
            top: params.isFirstVisible ? 0: 5,
            bottom: params.isLastVisible ? 0:5
          })}
          sx={{
            bgcolor:theme=>theme.palette.mode==='light'? grey[200]: grey[900]
          }}
          onCellEditCommit={params=>setRowId(params.id)}
        />
    </Box>
  ) 
};

export default Users;