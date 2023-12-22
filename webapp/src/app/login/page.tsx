/* eslint-disable react/no-unescaped-entities */
// Disable eslint rule for unescaped entities in react (for special characters)

"use client";
// Import required modules and packages
// import React, { useState } from 'react';
import Link from 'next/link';
import {BeatLoader} from "react-spinners";
const formDataInitialState = {
  username: '',
  password: '',
}

import React, { useState } from 'react';
import { checkIsMobile } from "@/constants/Budgets.constant";
import {
  Container,
  CssBaseline,
  TextField,
  Typography,
  Button,
  Alert,
  Stack,
  Box,
} from '@mui/material';

const LoginScreen = () => {
  const [formData, setFormData] = useState(formDataInitialState);
  const [errMsg, setErrMsg] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const isMobile = checkIsMobile()
  console.log('ismobileee', isMobile)
  // const classes = useStyles();

  // Function to handle input changes in the form
  function changedInput(field: any, value: any) {
    setErrMsg('');
    setFormData({ ...formData, [field]: value });
  }

  // Function to handle form submission
  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true)
    console.log('input data formadata', formData)
    // Fetch login data from the API
    const response = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.username,
        password: formData.password,
      }),
    });

    // If login is successful, store user data in local storage and navigate to the home page
    if (response.ok) {
      const user = await response.json();
      console.log(user);
      if (typeof window !== 'undefined' && user) {
        localStorage.setItem("user", JSON.stringify(user));
        // Navigate to home page
        window.location.href = '/';
      } else {
        setErrMsg('Invalid Credentials or email address not verified');
        setShowError(true)
      }
    }else {
      setErrMsg('Invalid Credentials');
      setShowError(true)
    }
    setIsLoading(false)
  }

  // if(isLoading){
  //   return <BeatLoader color="#36d7b7" />
  // }
  if (isMobile) {
    return (
      <Stack sx={{
        backgroundColor: '#607D3B',
        height: '100vh',
      }}>
        <Stack
          sx={{
            backgroundImage: 'url("/images/login.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            height: '40vh', // Set the height to 30% of the viewport height
          }}
          width="100%"
        >
        </Stack>
        <Stack
          width="100%"
          sx={{
            backgroundColor: '#607D3B',
            // height: '60vh',
          }}
          alignItems='center'
        > 
          <TextField
            margin="normal"
            required
            id="email"
            size='small'
            sx={{
              backgroundColor: 'white',
              width: '85%',
              marginTop: 3,
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none', // Remove the border
                },
              },
            }}
            placeholder='email'
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.username}
            onChange={(e) => changedInput('username', e.target.value)}
          />
          <TextField
            margin="normal"
            required
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            size='small'
            placeholder='Password'
            sx={{
              backgroundColor: 'white',
              width: '85%',
              borderRadius: '8px',
              marginTop: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none', // Remove the border
                },
              },
            }}
            onChange={(e) => changedInput('password', e.target.value)}
          />
          <Stack direction='row' justifyContent='end'>
              <Typography fontSize='15px' color='white'>
              <Link href="/forgot-password">
             <span className="text-white">Forgot Password?</span>
           </Link>
         </Typography>
        </Stack>
        <Button  variant="contained"
          onClick={handleFormSubmit}
          sx={{
            backgroundColor: 'white !important',
            marginTop:2,
            marginBottom:2,
            color: 'black',
            marginLeft:4,
            marginRight: 4,
            width: '85%'
          }}
          >
            Login
          </Button>
        </Stack>
        <Stack direction='row' justifyContent='center'>
        <Typography color='white' fontSize='15px'>
          If you don't have an account
         <Link href="/register">
           <span className="text-blue-500"> {` Register Now`}</span>
         </Link>
         </Typography>
        </Stack>
        {showError && (
          <Alert severity="error" onClose={() => setShowError(false)}>
            Invalid username or password. Please try again.
          </Alert>
        )}
      </Stack>
    );
  }
  return (
    <Box
      component="main"
      sx={{
        backgroundImage: 'url("/images/login.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
      }}
      // className={classes.loaderOverlay}
    >
      {isLoading ? (
        <div style={{
          zIndex:1000,
          alignItems:'center'
        }} >
          <BeatLoader size={15} color={'#36D7B7'} loading={isLoading} />
        </div>
      ):(
      <>
      <Stack
      px={3}
      py={4}
      marginLeft='70px'
      sx={{
        backgroundColor:'white',
        borderRadius: '16px'
      }}
      spacing={2} alignItems="center" justifyContent="center">
        <Typography variant="h5" component="div" color="black">
          Login
        </Typography>
        <form style={{ width: '100%' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.username}
            onChange={(e) => changedInput('username', e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) => changedInput('password', e.target.value)}
          />
          <Stack direction='row' justifyContent='end'>
              <Typography fontSize='13px'>
              <Link href="/forgot-password">

             <span className="text-blue-500">Forgot Password?</span>
           </Link>
         </Typography>
        </Stack>
          <Button fullWidth variant="outlined"
          onClick={handleFormSubmit}
          sx={{
            backgroundColor: 'blue',
            marginTop:2,
            marginBottom:2
          }}
          >
            Login
          </Button>
          <Stack direction='row' justifyContent='end'>
        <Typography fontSize='15px'>
          If you don't have an account
         <Link href="/register">
           <span className="text-blue-500"> {` Register Now`}</span>
         </Link>
         </Typography>
        </Stack>
        </form>
        {showError && (
          <Alert severity="error" onClose={() => setShowError(false)}>
            Invalid username or password. Please try again.
          </Alert>
        )}
      </Stack>
      </>
      )
      }
    </Box>
  );
};

export default LoginScreen;

