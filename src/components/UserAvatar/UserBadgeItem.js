import { Box } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';

export default function UserBadgeItem({ user, handleFunction }) {
  // console.log(user);
  return (
    <Box sx={{
      borderRadius: '16px',
      cursor: 'pointer',
      fontSize: '12px',
      backgroundColor: 'purple',
      color: 'white', 
      display: 'flex',
      alignItems: 'center',
    }} px={1.5} py={1} m={0.5} my={0.5} onClick={()=>handleFunction()} >
      {user.name}
      <CloseIcon />
    </Box>
  )
}
