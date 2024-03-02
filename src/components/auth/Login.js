import { Stack, FormControl, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const apiUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast.warn("Please fill all the fields !", {
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
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                `${apiUrl}/api/user/login`,
                { email, password },
                config
            );
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats");
        } catch (error) {
            toast.warn(error.response.data.message, {
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
        <Stack spacing={1}>
            {/* <FormControl> */}
            <TextField
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
                id="outlined-basic"
                label="Email"
                variant="outlined"
                required
            />
            <TextField
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
                id="outlined-basic"
                type="password"
                label="Password"
                variant="outlined"
                required
            />
            <LoadingButton loading={loading} onClick={submitHandler} variant="contained">
                Login
            </LoadingButton>
            {/* </FormControl> */}
            <ToastContainer />
        </Stack>
    );
}
