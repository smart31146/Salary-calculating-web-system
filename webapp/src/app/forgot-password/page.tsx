// Disable eslint rule for unescaped entities in react (for special characters)
/* eslint-disable react/no-unescaped-entities */

// Import required modules and packages
"use client";
import React, { useState } from 'react';
import * as crypto from 'crypto';

// Initial state for form data
const formDataInitialState = {
  email: '',
};

// Constant representing 1 hour in milliseconds
const ONE_HOUR = 3600000; // 1 hour = 3600000 milliseconds

// React functional component for the Forgot Password Page
const ForgotPasswordPage = () => {
  // State variables for form data, error message, and success message
  const [formData, setFormData] = useState(formDataInitialState);
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Function to handle input changes in the form
  function changedInput(field: any, value: any) {
    setErrMsg('');
    setFormData({ ...formData, [field]: value });
  }

  // Function to handle form submission
  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    // Fetch user data based on the provided email
    const response = await fetch(`/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
      }),
    });

    // If the email is valid, proceed with generating a reset token
    if (response.ok) {
      const user = await response.json();

      // Check if the user exists
      if (user) {
        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Prepare data for updating user with reset token and expiration time
        const updateData = {
          resetPasswordToken: resetToken,
          resetPasswordExpireTime: new Date(Date.now() + ONE_HOUR),
        };

        // Update user data with the reset token and expiration time
        const responseForgotPassword = await fetch(`/api/auth/forgot-password?id=${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });

        // If the update is successful, display success message and navigate to the login page
        if (responseForgotPassword.ok) {
          const updatedUser = await responseForgotPassword.json();
          if (updatedUser) {
            setErrMsg('');
            setSuccessMsg('An email was sent to your address. Please check your email');

            // Redirect to the login page after a delay
            setTimeout(() => {
              window.location.href = '/login';
            }, 5000);
          }
        } else {
          // Display error message if updating user fails
          setErrMsg('Forgot Password failed!');
        }
      } else {
        // Display error message if the email does not exist
        setErrMsg('Email does not exist');
      }
    }
  }

  // JSX for the Forgot Password Page component
  return (
    <div className='pt-20 mb-20 px-10 md:px-20 h-[85vh]'>
      {/* Main content for the Forgot Password Page */}
      <div className="w-[100%] h-[80vh] bg-gray-100  p-3" style={{ backgroundImage: 'url("/images/login.jpg")', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', }}>
        <form className="mt-16 h-[50vh] md:ml-8 max-w-screen-md md:w-[60%] lg:w-[45%] bg-white p-8 rounded-lg" onSubmit={handleFormSubmit}>
          <h2 className="text-center font-bold mb-8 text-2xl">Forgot Password</h2>

          {/* Error message for password reset */}
          <label className="block mb-2 text-sm text-pink-500" htmlFor="error">
            {errMsg}
          </label>

          {/* Success message after successful password reset */}
          <label className="block mb-2 text-sm text-green-600" htmlFor="success">
            {successMsg}
          </label>

          {/* Form input fields */}
          <div className="flex flex-wrap -mx-2 mb-4">
            <div className="w-full px-2 mb-4">
              <label className="block mb-2 text-sm text-gray-600" htmlFor="email">
                Email <span className='text-red-600'>*</span>
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md transition-all duration-300 focus:outline-none focus:border-blue-500"
                type="text"
                id="email"
                name="email"
                placeholder='Enter your correct email'
                onChange={(e) => changedInput('email', e.target.value)}
                required
                value={formData.email}
              />
            </div>
          </div>

          {/* Send button */}
          <div className='text-center'>
            <button
              className="w-[40%] bg-blue-500 text-white py-2 rounded-md transition-all duration-300 hover:bg-blue-600"
              type="submit"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Export the ForgotPasswordPage component
export default ForgotPasswordPage;
