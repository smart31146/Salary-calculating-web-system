"use client";
import Image from 'next/image';
import Link from 'next/link';
// Import required modules and packages
import React, { useState } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography, Container, Grid } from '@mui/material';
import { FaSignInAlt } from 'react-icons/fa';
import { checkIsMobile } from "@/constants/Budgets.constant";
import {
  Alert,
  Stack,
} from '@mui/material';

// Initial state for form data
const formDataInitialState = {
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  gender: 'Male',
  email: '',
  city: '',
  country: '',
};

const sxStlye = {
  backgroundColor: 'white',
  width: '85%',
  borderRadius: '8px',
  marginTop: 3,
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none', // Remove the border
    },
  },
}

// Gender options for the select input
const genders = ['Male', 'Female', 'Others'];

// React functional component for the Login Page
const LoginPage = () => {
  // State variables for form data and error message
  const [formData, setFormData] = useState(formDataInitialState);
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const isMobile = checkIsMobile()

  // Function to handle input changes in the form
  const changedInput = (field: any, value: any) => {
    setErrMsg('');
    setFormData({ ...formData, [field]: value });
  };

  // Function to handle form submission
  const handleFormSubmit = async (e : any) => {
    e.preventDefault();

    try {
      // Fetch registration data from the API
      const response = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.firstName + ' ' + formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          city: formData.city,
          country: formData.country,
        }),
      });

      // If registration is successful, navigate to the login page
      if (response.ok) {
        const user = await response.json();
        console.log('userrrrrrrrrrrrrr', user);
        if (user) {
          // send email verification email
          await fetch(`/api/auth/register`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: user._id,
              email: user.email,
            }),
          });
          setErrMsg('');
          setSuccessMsg('An email was sent to your address to verify the email address. Please check your email');
          // Redirect to the login page after a delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 5000);
        }
      } else {
        // Display error message for duplicate username or email
        setErrMsg('Username or email is already registered.');
        setShowError(true)
      }
    } catch (error) {
      console.log('error');
    }
  };

  if (isMobile) {
    return (
      <Stack sx={{
        backgroundColor: '#607D3B',
        
      }}>
        <Stack
          sx={{
            backgroundImage: 'url("/images/budget.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh', // Set the height to 30% of the viewport height
          }}
          width="100%"
        >
        </Stack>
        <Typography variant="body2" color="error"
             sx={{
               color: 'red'
             }}
             align="center" paragraph>
              {errMsg}
            </Typography>

            {/* Success message after successful registration */}
            <Typography variant="body2"
            color="success"
            align="center"
            paragraph
            sx={{
              color: 'white'
            }}
            >
              {successMsg}
            </Typography>
        <Stack
          width="100%"
          sx={{
            backgroundColor: '#607D3B',
            // height: '60vh',
          }}
          alignItems='center'
        >  
        <Typography color='white' fontSize='16px' fontWeight={700}>
          Register Here
        </Typography>
          <TextField
                  size='small'
                  variant="outlined"
                  onChange={(e) => changedInput('username', e.target.value)}
                  value={formData.username}
                  required
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
                  placeholder='UserName'
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

                <TextField
                  onChange={(e) => changedInput('firstName', e.target.value)}
                  value={formData.firstName}
                  required
                  size='small'
            placeholder='First Name'
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
                />
                <TextField
                  onChange={(e) => changedInput('lastName', e.target.value)}
                  value={formData.lastName}
                  required
                  size='small'
            placeholder='last name'
            sx={sxStlye}
                />
              <TextField
                  placeholder='Email'
                  onChange={(e) => changedInput('email', e.target.value)}
                  value={formData.email}
                  required
                  sx={sxStlye}
                />
            <TextField
              margin="normal"
              required
              id="city"
              size='small'
              sx={sxStlye}
              placeholder='City'
              name="city"
              autoComplete="city"
              autoFocus
              value={formData.city}
              onChange={(e) => changedInput('city', e.target.value)}
            />
            <TextField
            margin="normal"
            required
            id="gender"
            size='small'
            sx={sxStlye}
            placeholder='Gender'
            name="gender"
            autoComplete="gender"
            autoFocus
            value={formData.gender}
            onChange={(e) => changedInput('gender', e.target.value)}
          />                
          <TextField
            required
            id="country"
            size='small'
            sx={sxStlye}
            placeholder='Country'
            name="country"
            autoComplete="country"
            autoFocus
            value={formData.country}
            onChange={(e) => changedInput('country', e.target.value)}
          />
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
            Register
          </Button>
        </Stack>
        <Stack mb={10} direction='row' justifyContent='center'>
        <Typography color='white' fontSize='15px'>
          Already Have a account?
         <Link href="/login">
           <span className="text-blue-500"> {` Login here`}</span>
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

  // JSX for the Login Page component
  return (
    <Container
    sx={{
      backgroundImage: 'url("/images/login.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      //  / Add a border for visualization
    }} 
    component="main" maxWidth="lg">
      <Grid container justifyContent="start" alignItems="center">
        <Grid item xs={12} md={6} lg={5}>
          <Stack
          mt={3} 
          mb={3}
          px={3}
          py={4}
          ml={'70px'}
          sx={{
            backgroundColor:'white',
            borderRadius: 8
          }}>
          <form>
            <Typography fontWeight={600} variant="h6" align="center" gutterBottom>
              <u>Register User</u>
            </Typography>
            {/* Display error message */}
            <Typography variant="body2" color="error"
             sx={{
               color: 'red'
             }}
             align="center" paragraph>
              {errMsg}
            </Typography>

            {/* Success message after successful registration */}
            <Typography variant="body2"
            color="success"
            align="center"
            paragraph
            sx={{
              color: 'green'
            }}
            >
              {successMsg}
            </Typography>

            {/* Form input fields */}
            <Grid container spacing={2}>
              {/* Username input */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Username *"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => changedInput('username', e.target.value)}
                  value={formData.username}
                  required
                />
              </Grid>

              {/* Password input */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Password *"
                  type="password"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => changedInput('password', e.target.value)}
                  value={formData.password}
                  required
                />
              </Grid>

              {/* Repeat for other form inputs */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name *"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => changedInput('firstName', e.target.value)}
                  value={formData.firstName}
                  required
                />
              </Grid>

              {/* Last Name input */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name *"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => changedInput('lastName', e.target.value)}
                  value={formData.lastName}
                  required
                />
              </Grid>

              {/* Email input */}
              <Grid item xs={12}>
                <TextField
                  label="Email *"
                  type="email"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => changedInput('email', e.target.value)}
                  value={formData.email}
                  required
                />
              </Grid>

              {/* Gender select input */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="gender-label">Gender *</InputLabel>
                  <Select
                    labelId="gender-label"
                    label="Gender *"
                    value={formData.gender}
                    onChange={(e) => changedInput('gender', e.target.value)}
                    required
                  >
                    {genders.map((gender, index) => (
                      <MenuItem key={index} value={gender}>
                        {gender}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* City input */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City *"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => changedInput('city', e.target.value)}
                  value={formData.city}
                  required
                />
              </Grid>

              {/* Country input */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Country *"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => changedInput('country', e.target.value)}
                  value={formData.country}
                  required
                />
              </Grid>
            </Grid>

            {/* Register button */}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Button
                variant="outlined"
                color="primary"
                // type="submit"
                style={{ width: '40%' }}
                sx={{
                  backgroundColor: 'blue'
                }}
                startIcon={<FaSignInAlt />}
                onClick={handleFormSubmit}
              >
                Register
              </Button>
            </div>

            {/* Link to the login page */}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              Already have an account?{' '}
              <a href="/login" style={{ color: 'blue' }}>
                Login here
              </a>
            </div>
          </form>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

// Export the LoginPage component
export default LoginPage;

