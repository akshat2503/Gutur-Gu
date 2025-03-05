import { Avatar, Box, Button, CircularProgress, Modal, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { ChatState } from '../context/ChatProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getSender, getSenderFull } from '../config/ChatLogics';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from '../animations/typing.json';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {xs: 300, md: 400},
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
};

const ENDPOINT = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
var socket, selectedChatCompare;

export default function SingleChat({ fetchAgain, setFetchAgain }) {
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typing, setTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);

    const defaultOptions = {
        loop: true,
        animationData: animationData,
    }

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
    }, [])

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
                if (Notification.permission === "granted") {
                    new Notification(`New Message from ${newMessageRecieved.sender.name}`, {
                        body: newMessageRecieved.content,
                        icon: newMessageRecieved.sender.pic || "/default-avatar.png", // Change the default avatar if needed
                    });
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        })
    })

    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);
    

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.get(`${apiUrl}/api/message/${selectedChat._id}`, config);
            console.log(data);
            setMessages(data);
            setLoading(false);
            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            toast.error("Failed to load messages !", {
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

    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                }

                setNewMessage("");
                const { data } = await axios.post(`${apiUrl}/api/message`, {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);

                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                toast.error("Unable to send message !", {
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
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        console.log("Reached till timeout function, Wait ...");

        if (typingTimeout) clearTimeout(typingTimeout);

        setTypingTimeout(setTimeout(() => {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
        }, 2000));
    };

    const handleDeleteChat = async () => {
        handleClose();
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            console.log("Deleting chats for ")
            const { data } = await axios.put(`${apiUrl}/api/chat/deletechat`, {
                chatId: selectedChat._id,
            }, config);

            console.log("-------------------------------------");
            console.log(data);
            console.log("-------------------------------------");
            setFetchAgain(!fetchAgain);
            setLoading(false);
            setSelectedChat("");
        } catch (error) {
            toast.error("Unable to delete chat !", {
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
            {selectedChat ? (
                <>
                    <Typography sx={{
                        width: '100%',
                        fontFamily: 'Work sans',
                        display: 'flex',
                        alignItems: 'center'
                    }} fontSize={{ xs: '18px', md: '30px' }} pb={3} px={2} justifyContent={'space-between'} >
                        <ArrowBackIcon sx={{ display: { xs: 'flex', md: 'none' }, cursor: 'pointer' }} onClick={() => { setSelectedChat(""); setFetchAgain(!fetchAgain); }} />
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
                                        <Button variant="contained" color="error" sx={{ mt: 3 }} onClick={handleDeleteChat}>Delete Chat</Button>
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
                        background: 'linear-gradient(90deg, rgba(190,227,248,1) 0%, rgba(185,245,208,1) 100%)',
                        width: '100%',
                        height: '100%',
                        borderRadius: '16px',
                        overflowY: 'hidden',
                    }} >
                        {loading ? (
                            <CircularProgress size={50} sx={{ alignSelf: 'center', justifySelf: 'center', m: 'auto' }} />
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'scroll', scrollbarWidth: 'none' }}>
                                <ScrollableChat messages={messages} />
                            </Box>
                        )}
                        <Box sx={{ m: 2 }}>
                            {isTyping && !typing ? <div><Lottie options={defaultOptions} width={70} height={50} style={{ margin: 0 }} /></div> : <></>}
                            <TextField id="outlined-basic" value={newMessage} placeholder='Enter a message ...' variant="outlined" sx={{ width: '100%' }} onChange={typingHandler} onKeyDown={sendMessage} required />
                        </Box>
                    </Box>
                </>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography variant='h5' sx={{ fontFamily: 'Work sans' }}>
                        Click on a user to start chatting.
                    </Typography>
                </Box>
            )}
            <ToastContainer />
        </>
    )
}
