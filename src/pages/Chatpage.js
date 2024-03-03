import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import Box from '@mui/system/Box';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';


export default function Chatpage() {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState();

    return (
        <div style={{ width: '100%' }}>
            {user && <SideDrawer />}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '98.5%', height: '89.5vh', mx: {xs: "auto" , md: "10px"}, my: '10px' }}>
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    )
}
