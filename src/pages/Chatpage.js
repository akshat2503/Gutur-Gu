import React from 'react'
import { ChatState } from '../context/ChatProvider'
import Box from '@mui/system/Box';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';


export default function Chatpage() {
    const { user } = ChatState();
    return (
        <div style={{ width: '100%'}}>
            {user && <SideDrawer />}
            <Box sx={{display: 'flex', justifyContent: 'space-between', width: '98.5%',  height: '91.5vh', m: '10px'}}>
                {user && <MyChats/>}
                {user && <ChatBox/>}
            </Box>
        </div>
    )
}
