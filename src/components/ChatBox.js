import React from 'react';
import { ChatState } from '../context/ChatProvider';
import { Box } from '@mui/material';
import SingleChat from './SingleChat';

export default function ChatBox({ fetchAgain, setFetchAgain }) {

    const { selectedChat } = ChatState();

    return (
        <Box
            display={{ xs: selectedChat ? 'flex' : 'none', md: 'flex' }}
            sx={{
                alignItems: 'center',
                flexDirection: 'column',
                backgroundColor: 'white',
                width: { xs: '100%', md: '60%' },
                borderRadius: '16px',
                borderWidth: '1px',
            }}
            p={3}
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    )
}
