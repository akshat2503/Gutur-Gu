import { Stack, FormControl, TextField, Button } from '@mui/material';
import React from 'react'
import { useState } from 'react';

export default function Signup() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [cpassword, setCpassword] = useState();
    const [pic, setPic] = useState();

    const postDetails = (pics) => {

    }
    const submitHandler = () => {

    }
    return (
        <Stack spacing={1}>
            {/* <FormControl> */}
            <TextField onChange={(e) => { setName(e.target.value) }} id="outlined-basic" label="Name" variant="outlined" required />
            <TextField onChange={(e) => { setEmail(e.target.value) }} id="outlined-basic" label="Email" variant="outlined" required />
            <TextField onChange={(e) => { setPassword(e.target.value) }} id="outlined-basic" type="password" label="Password" variant="outlined" required />
            <TextField onChange={(e) => { setCpassword(e.target.value) }} id="outlined-basic" type="password" label="Current Password" variant="outlined" required />
            <TextField onChange={(e) => { postDetails(e.target.files[0]) }} id="outlined-basic" type="file" label="" variant="outlined" inputProps={{ accept: 'image/*' }} />
            <Button onClick={submitHandler} variant="contained">Sign-Up</Button>
            {/* </FormControl> */}
        </Stack>
    )
}
