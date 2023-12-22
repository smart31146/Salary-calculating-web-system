// Import required modules and packages
"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

// React functional component for the Verify Email Page
const VerifyEmailPage = () => {
    const params = useParams();
    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Function to handle verify email
    const handleVerifyEmail = async () => {
        const response = await fetch(`/api/auth/register?id=${params?.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        // If the password reset is successful, display success message and navigate to the login page
        if (response.ok) {
            setSuccessMsg('Congratulations! You have successfully verified your email address.');

            // Redirect to the login page after a delay
            setTimeout(() => {
                window.location.href = '/login';
            }, 5000);
        } else {
            setErrMsg('User not found or email already verified');
        }
    }

    useEffect(() => {
        if (params?.id) {
            handleVerifyEmail()
        }
    }, [])


    // JSX for the Reset Password Page component
    return (
        <div className='text-center mt-28 font-bold' style={{fontSize: '30px !important'}}>
            {/* Main content for the Reset Password Page */}
            {/* Error message for password reset */}
            <label className="block mb-2 text-pink-500" htmlFor="error">
                {errMsg}
            </label>

            {/* Success message after successful password reset */}
            <label className="block mb-2 text-green-600" htmlFor="success">
                {successMsg}
            </label>
        </div>
    );
};

// Export the VerifyEmailPage component
export default VerifyEmailPage;
