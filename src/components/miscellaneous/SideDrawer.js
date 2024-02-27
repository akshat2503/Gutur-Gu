import React, { useState } from "react";
import {
  Box,
  Tooltip,
  Button,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  IconButton,
  Modal,
  Backdrop,
  Fade,
  Drawer,
  Divider,
  TextField,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ChatState } from "../../context/ChatProvider";
// import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ChatLoading from "../ChatLoading";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

export default function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const { user, setSelectedChat, chats, setChats } = ChatState();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };

  const handleSearch = async () => {
    if (!search) {
      toast.warn("Please enter something in search", {
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
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const data = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);

      setSearchResult(data);
      console.log(data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load the search results", {
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

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.post("http://localhost:5000/api/chat", {userId}, config);

      if (!chats.find((c)=>c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
    } catch (error) {
      toast.error("Error fetching the chat", {
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
  }

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

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

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
          width: "100%",
          // p: '5px 10px',
          borderWidth: "5px",
        }}
      >
        <Tooltip title="Search users to chat" arrow>
          <Button variant="contained" onClick={toggleDrawer(true)} endIcon={<SearchIcon />}>
            <Typography
              variant="button"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Search User
            </Typography>
            {/* Search User */}
          </Button>
        </Tooltip>

        <Typography variant="h4" fontFamily={"Work Sans"}>
          Gutur-Gu
        </Typography>

        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }} src={user.pic}>{user.name[0]}</Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => { handleModalOpen(); handleClose(); }}>Profile</MenuItem>
          {/* <ProfileModal open={modalOpen} setOpen={setModalOpen} /> */}

          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={modalOpen}
            onClose={handleModalClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
          >
            <Fade in={open}>
              <Box sx={style}>
                <Typography id="transition-modal-title" variant="h6" component="h2">
                  Text in a modal
                </Typography>
                <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                  Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                </Typography>
              </Box>
            </Fade>
          </Modal>

          <MenuItem onClick={logoutHandler}>Logout</MenuItem>
        </Menu>
      </Box>

      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 300 }} role="presentation" onClick={toggleDrawer(false)}>
          <Typography variant="h4" align="center" p={2}>
            Search User
          </Typography>
          <Divider />
          <Box display={"flex"} >
            <TextField id="outlined-basic" label="Search by name or email" variant="outlined" value={search} sx={{ width: '100%', m: '1rem 0' }} onChange={(e) => { setSearch(e.target.value) }} onClick={(e) => e.stopPropagation()} />
            <Button variant="text" size="small" sx={{ m: '1rem 0' }} onClick={(e) => { e.stopPropagation(); handleSearch(); }}><SearchIcon /></Button>
          </Box>
          <Divider />
          {loading ? <ChatLoading /> : (
            searchResult.data?.map((user) => (
              <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
            ))
          )}
          {/* This loading when opening chat doesn't works for now */}
          {/* {loadingChat && <CircularProgress />} */}
        </Box>
      </Drawer>
    </>
  );
}
