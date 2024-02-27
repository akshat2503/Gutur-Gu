import React from 'react';
import { ChatState } from '../context/ChatProvider';
import { Box } from '@mui/material';

export default function ChatBox() {

  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      sx={{
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: 'white',
        width: {base: '100%', md: '60%'},
        borderRadius: '16px',
        borderWidth: '1px'
      }}
      p={3}
    >
      Single Chat
    </Box>
  )
}
