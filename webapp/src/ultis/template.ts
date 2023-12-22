// Forgot password email template
export const forgotPasswordEmailTemplate = (url: string) => {
    return `<!DOCTYPE html>
     <html lang="en">
     <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <style>
         body {
           font-family: Arial, sans-serif;
           background-color: #f0f0f0;
           margin: 0;
           padding: 0;
         }
         .container {
           max-width: 600px;
           margin: 0 auto;
           padding: 20px;
           background-color: #ffffff;
           border-radius: 5px;
           box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
         }
         .header {
           background-color: #007BFF;
           padding: 20px;
           text-align: center;
           border-top-left-radius: 5px;
           border-top-right-radius: 5px;
         }
         .header h1 {
           color: #ffffff;
         }
         .content {
           padding: 20px;
         }
         .message {
           font-size: 18px;
           margin: 20px 0;
           color: #333;
         }
         .button {
           text-align: center;
           margin: 20px 0;
         }
         .button a {
           display: inline-block;
           padding: 10px 20px;
           background-color: #007BFF;
           color: #ffffff;
           text-decoration: none;
           border-radius: 5px;
         }
       </style>
     </head>
     <body>
       <div class="container">
         <div class="header">
           <h1>Password Reset</h1>
         </div>
         <div class="content">
           <p class="message">Hello there,</p>
           <p class="message">You've requested a password reset for your account. Click the button below to create a new password:</p>
           <div class="button">
             <a href="${url}">Reset Password</a>
           </div>
           <p class="message">If you didn't request this password reset, please ignore this email. Your account is secure.</p>
         </div>
       </div>
     </body>
     </html>
     `;
 }