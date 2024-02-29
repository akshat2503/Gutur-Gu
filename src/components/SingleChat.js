import { Avatar, Box, Modal, Typography } from '@mui/material';
import React from 'react';
import { ChatState } from '../context/ChatProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getSender, getSenderFull } from '../config/ChatLogics';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
};

export default function SingleChat({ fetchAgain, setFetchAgain }) {

    const { user, selectedChat, setSelectedChat } = ChatState();

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            {selectedChat ? (
                <>
                    <Typography sx={{
                        width: '100%',
                        fontFamily: 'Work sans',
                        display: 'flex',
                        alignItems: 'center'
                    }} fontSize={{ base: '28px', md: '30px' }} pb={3} px={2} justifyContent={'space-between'} >
                        <ArrowBackIcon sx={{ display: { base: 'flex', md: 'none' }, cursor: 'pointer' }} onClick={() => { setSelectedChat("") }} />
                        {/* </Typography> */}
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <VisibilityIcon onClick={handleOpen} />
                                <Modal
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={style}>
                                        <Avatar
                                            src={getSenderFull(user, selectedChat.users).pic}
                                            sx={{ width: 70, height: 70, mb: '16px' }}
                                        >{getSenderFull(user, selectedChat.users).name[0]}</Avatar>
                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                            {getSenderFull(user, selectedChat.users).name}
                                        </Typography>
                                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                            Email: {getSenderFull(user, selectedChat.users).email}
                                        </Typography>
                                    </Box>
                                </Modal>
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                            </>
                        )}
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        backgroundColor: '#E8E8E8',
                        width: '100%',
                        height: '100%',
                        borderRadius: '16px',
                        overflowY: 'hidden'
                    }} >

                    </Box>
                </>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography variant='h5' sx={{ fontFamily: 'Work sans' }}>
                        Click on a user to start chatting.
                    </Typography>
                </Box>
            )}
        </>
    )
}
