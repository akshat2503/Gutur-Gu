import { Box, Container, Typography, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import React from 'react'

import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';

export default function Homepage() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="xs" sx={{ p: 0 }}>
      <Box component="section" sx={{ p: "24px 0", backgroundColor: 'white', mt: 2, display: 'flex', justifyContent: 'center', width: "100%", borderRadius: '7px' }}>
        <Typography variant="h5" fontFamily={'work sans'}>
          Gutar-Gu 😏
        </Typography>
      </Box>
      <Box sx={{ mt: 2, backgroundColor: 'white', width: '100%', borderRadius: '7px' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
              <Tab label="Login" value="1" sx={{ width: '45%' }} />
              <Tab label="Sign-Up" value="2" sx={{ width: '45%' }} />
            </TabList>
          </Box>
          <TabPanel value="1"><Login /></TabPanel>
          <TabPanel value="2"><Signup /></TabPanel>
        </TabContext>
      </Box>
    </Container>
  )
}