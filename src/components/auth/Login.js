import { Stack, FormControl, TextField, Button } from '@mui/material';
import React from 'react'
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const postDetails = (pics) => {

  }
  const submitHandler = () => {

  }

  return (
    <Stack spacing={1}>
      {/* <FormControl> */}
      <TextField onChange={(e) => { setEmail(e.target.value) }} id="outlined-basic" label="Email" variant="outlined" required />
      <TextField onChange={(e) => { setPassword(e.target.value) }} id="outlined-basic" type="password" label="Password" variant="outlined" required />
      <Button onClick={submitHandler} variant="contained">Login</Button>
      {/* </FormControl> */}
    </Stack>
  )
}
