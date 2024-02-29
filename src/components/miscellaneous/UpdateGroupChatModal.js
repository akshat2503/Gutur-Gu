import React, { useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, CircularProgress, Modal, TextField, Typography } from '@mui/material';
import { ChatState } from '../../context/ChatProvider';
import { ToastContainer, toast } from "react-toastify";
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';

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
    flexDirection: 'column',
};

export default function UpdateGroupChatModal({ fetchAgain, setFetchAgain }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { user, selectedChat, setSelectedChat } = ChatState();

    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    useEffect(() => {
        setGroupChatName(selectedChat.chatName);
    }, [])

    const handleRemove = async (userToRemove) => {
        if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id){
            console.log("Only admins can remove someone from group");
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.put("http://localhost:5000/api/chat/groupremove", {
                chatId: selectedChat._id,
                userId: userToRemove._id
            }, config);

            userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data)
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast.error("Error Occured", {
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setLoading(false);
        }
    };
    
    const handleRename = async () => {
        if (!groupChatName || groupChatName === selectedChat.chatName) return
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.put("http://localhost:5000/api/chat/rename", {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast.error("Error Occured", {
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setRenameLoading(false);
            setGroupChatName(selectedChat.chatName);
        }

    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config)
            setSearchResult(data);
            setLoading(false);
        } catch (error) {
            toast.error("Unable to search", {
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setLoading(false);
        }
    };

    const handleAddUser = async (userToAdd) => {
        // if (!selectedChat.users.find((u)=> u._id === userToAdd._id )){}

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.put("http://localhost:5000/api/chat/groupadd", {
                chatId: selectedChat._id,
                userId: userToAdd._id,
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setSearchResult([]);
            setLoading(false);
        } catch (error) {
            toast.error("Error Occured", {
                position: "bottom-left",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setLoading(false);
        }
    };

    return (
        <>
            <VisibilityIcon onClick={handleOpen} />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography textAlign={'center'} id="modal-modal-title" variant="h5" component="h2">
                        {selectedChat.chatName}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2, display: 'flex', flexWrap: 'wrap' }}>
                        {selectedChat.users.map((u) => (
                            <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                        ))}
                    </Typography>
                    <Box sx={{ display: 'flex' }} >
                        <TextField id="outlined-basic" label="Chat Name" value={groupChatName} onChange={(e) => { setGroupChatName(e.target.value) }} variant="outlined" sx={{ width: '100%', marginTop: 2, marginRight: 2 }} />
                        <LoadingButton loading={renameLoading} onClick={handleRename} variant="contained" sx={{ marginTop: 2 }}>Rename</LoadingButton>
                    </Box>

                    {selectedChat.groupAdmin._id === user._id && (
                        <TextField id="outlined-basic" label="Add users to group" onChange={(e) => { handleSearch(e.target.value) }} variant="outlined" sx={{ width: '100%', marginTop: 2 }} />
                    )}

                    {loading ? (
                        <CircularProgress sx={{ alignSelf: 'center' }} />
                    ) : (
                        searchResult.map((u) => (
                            <UserListItem key={u._id} user={u} handleFunction={() => handleAddUser(u)} />
                        ))
                    )}
                    <Button variant='contained' color='error' onClick={() => handleRemove(user)} sx={{ marginTop: 2 }} >Leave Group</Button>
                </Box>
            </Modal>
            <ToastContainer />
        </>
    )
}
