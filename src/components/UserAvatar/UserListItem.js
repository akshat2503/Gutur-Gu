import { Avatar, Box, Button, Typography } from '@mui/material'
import React from 'react'

export default function UserListItem({ user, handleFunction }) {
    return (
        <Box onClick={handleFunction} sx={{
            cursor: 'pointer',
            bgcolor: '#E8E8E8',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            color: 'black',
            borderRadius: '1rem',
            transition: 'all 0.3s',
            '&:hover': {
                bgcolor: '#38B2AC',
                color: 'white',
            }
        }} py={2} mt={1}>
            <Avatar src={user.pic} sx={{ mx: '0.75rem' }}>{user.name[0]}</Avatar>
            <Box>
                <Typography>{user.name}</Typography>
                <Typography variant='body2'><b>Email: </b>{user.email}</Typography>
            </Box>
        </Box>
    )
}
