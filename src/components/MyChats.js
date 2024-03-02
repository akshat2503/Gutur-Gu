import React, { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';
import { Box, Button, CircularProgress, Modal, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatLoading from '../components/ChatLoading';
import { getSender } from '../config/ChatLogics';
import UserListItem from './UserAvatar/UserListItem';
import UserBadgeItem from './UserAvatar/UserBadgeItem';

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
};

export default function MyChats({ fetchAgain }) {
    const [loggedUser, setLoggedUser] = useState();
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);


    const fetchChat = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const { data } = await axios.get("http://localhost:5000/api/chat", config);
            setChats(data);
        } catch (error) {
            toast.warn("Failed to load chats", {
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
            const updatedSearchResult = data.filter(newResult => !selectedUsers.some(existingResult => existingResult._id === newResult._id));
            console.log(updatedSearchResult);
            setSearchResult(updatedSearchResult);
            setLoading(false);

        } catch (error) {
            toast.warn("Failed to search results", {
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast.warn("Please fill all the fields", {
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.post("http://localhost:5000/api/chat/group", {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
            }, config);

            setChats([data, ...chats]);
            toast.success("New Group Chat created", {
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            handleClose();
        } catch (error) {
            toast.warn("Failed to create the chat !", {
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast.warn("User already added", {
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
        const updatedSearchResult = searchResult.filter(newResult => newResult._id !== userToAdd._id);
        setSearchResult(updatedSearchResult);
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
        fetchChat();
    }, [fetchAgain]);

    return (
        <Box sx={{ display: { base: selectedChat ? "none" : "flex", md: 'flex' }, flexDirection: 'column', alignItems: 'center', bgcolor: 'white', width: { base: "100%", md: "31%" }, borderWidth: '1px', borderRadius: '16px' }} p={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', fontSize: { base: "28px", md: "30px" }, fontFamily: 'Work sans' }} pb={3} px={3}>
                My Chats
                <Button variant='outlined' size='small' sx={{ display: 'flex', fontSize: { base: '17px', md: '10px', lg: '17px' } }} onClick={handleOpen}>New Group Chat<AddIcon /></Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontSize: '35px', fontFamily: 'Work sans', textAlign: 'center' }}>
                            Create Group Chat
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <TextField id="outlined-basic" label="Chat Name" variant="outlined" sx={{ width: '100%', my: '6px' }} onChange={(e) => { setGroupChatName(e.target.value) }} />
                            <TextField id="outlined-basic" label="Add Users" variant="outlined" sx={{ width: '100%', my: '6px' }} onChange={(e) => { handleSearch(e.target.value) }} />
                            <Box sx={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
                                {selectedUsers?.map((u) => (
                                    <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                                ))}
                            </Box>
                            {loading ? <CircularProgress /> : (
                                searchResult?.slice(0, 4).map(user => (
                                    <UserListItem key={user._id} user={user} handleFunction={() => { handleGroup(user) }} />
                                ))
                            )}
                            <Button variant='contained' sx={{ alignSelf: 'flex-end', mt: '6px' }} onClick={handleSubmit} >Create Chat</Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: '#F8F8F8', width: '100%', height: '100%', borderRadius: '16px', overflowY: 'hidden' }} p={3}>
                {chats ? (
                    <Stack sx={{ overflowY: 'scroll' }}>
                        {chats.map((chat) => (
                            <Box key={chat._id} sx={{ cursor: 'pointer', borderRadius: '16px' }} bgcolor={selectedChat === chat ? "#38B2AC" : "#E8E8E8"} color={selectedChat === chat ? "white" : "black"} px={3} py={2} my={0.5} onClick={() => { setSelectedChat(chat) }} >
                                <Typography>
                                    {!chat.isGroupChat ? (getSender(loggedUser, chat.users)) : (chat.chatName)}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
            <ToastContainer />
        </Box>
    )
}
