// Disable eslint rule for unescaped entities in react (for special characters)
/* eslint-disable react/no-unescaped-entities */

// Import required modules and packages
"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';

// Initial state for form data
const formDataInitialState = {
  password: '',
};

// React functional component for the Reset Password Page
const ResetPasswordPage = () => {
  // State variables for form data, URL parameters, error message, and success message
  const [formData, setFormData] = useState(formDataInitialState);
  const params = useParams();
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

    // Fetch password reset data from the API using the provided token
    const response = await fetch(`/api/auth/reset-password?token=${params?.token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: formData.password,
      }),
    });

    // If the password reset is successful, display success message and navigate to the login page
    if (response.ok) {
      const user = await response.json();
      setErrMsg('');
      setSuccessMsg('Your password has been changed. Please log in now.');

      // Redirect to the login page after a delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else {
      // Display error message for invalid or expired password reset token
      setErrMsg('Invalid or expired password reset token');
    }
  }

  // JSX for the Reset Password Page component
  return (
    <div className='pt-20 mb-20 px-10 md:px-20 h-[85vh]'>
      {/* Main content for the Reset Password Page */}
      <div className="w-[100%] h-[80vh] bg-gray-100  p-3" style={{ backgroundImage: 'url("/images/login.jpg")', backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', }}>
        <form className="mt-16 h-[50vh] md:ml-8 max-w-screen-md md:w-[60%] lg:w-[45%] bg-white p-8 rounded-lg" onSubmit={handleFormSubmit}>
          <h2 className="text-center font-bold mb-8 text-2xl">Reset your Password</h2>

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
              <label className="block mb-2 text-sm text-gray-600" htmlFor="password">
                Password <span className='text-red-600'>*</span>
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md transition-all duration-300 focus:outline-none focus:border-blue-500"
                type="password"
                id="password"
                placeholder='password'
                name="password"
                onChange={(e) => changedInput('password', e.target.value)}
                required
                value={formData.password}
              />
            </div>
          </div>

          {/* Update button */}
          <div className='text-center'>
            <button
              className="w-[40%] bg-blue-500 text-white py-2 rounded-md transition-all duration-300 hover:bg-blue-600"
              type="submit"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Export the ResetPasswordPage component
export default ResetPasswordPage;
