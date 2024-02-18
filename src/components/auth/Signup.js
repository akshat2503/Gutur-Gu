import { Stack, FormControl, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import React from 'react'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';




export default function Signup() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [cpassword, setCpassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined){
            toast.warn('Please select an image !', {
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
        if (pics.type === "image/jpeg" || pics.type === "image/png"){
            const data = new  FormData();
            data.append("file", pics);
            data.append("upload_preset", "chatapp");
            data.append("cloud_name", "deklx0xq7");
            fetch("https://api.cloudinary.com/v1_1/deklx0xq7/image/upload/", { method : "POST", body : data })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.url);
                setPic(data.url);
                console.log(pic);
                setLoading(false);
            }).catch((err)=>{
                console.log(err);
                setLoading(false);
            });
        }else{
            toast.warn('Please upload a valid jpg or png file !', {
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
    const submitHandler = async () => {
        setLoading(true);
        if (!name  || !email ||  !password || !cpassword){
            toast.warn('Please fill all the fields !', {
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
        if (password !== cpassword){
            toast.warn('Passwords do not match !', {
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
            }
            const { data } = await axios.post("http://localhost:5000/api/user", {name, email, password, pic}, config);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
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
    }
    return (
        <Stack spacing={1}>
            {/* <FormControl> */}
            <TextField onChange={(e) => { setName(e.target.value) }} id="outlined-basic" label="Name" variant="outlined" required />
            <TextField onChange={(e) => { setEmail(e.target.value) }} id="outlined-basic" label="Email" variant="outlined" required />
            <TextField onChange={(e) => { setPassword(e.target.value) }} id="outlined-basic" type="password" label="Password" variant="outlined" required />
            <TextField onChange={(e) => { setCpassword(e.target.value) }} id="outlined-basic" type="password" label="Current Password" variant="outlined" required />
            <TextField onChange={(e) => { postDetails(e.target.files[0]) }} id="outlined-basic" type="file" label="" variant="outlined" inputProps={{ accept: 'image/*' }} />
            <LoadingButton loading={loading} onClick={submitHandler} variant="contained">Sign-Up</LoadingButton>
            {/* </FormControl> */}
            <ToastContainer />
        </Stack>
    )
}
