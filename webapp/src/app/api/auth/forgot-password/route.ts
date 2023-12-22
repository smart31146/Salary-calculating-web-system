// Import necessary modules and packages
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import * as sendgrid from '@sendgrid/mail';
import { forgotPasswordEmailTemplate } from "@/ultis/template";

// Set SendGrid API key from environment variable
sendgrid.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY!);

// Define a function to handle POST requests
export async function POST(request: Request) {
  try {
    // Parse JSON data from the incoming request
    const json = await request.json();

    // Fetch user data from Prisma database based on the provided email
    const data: any = await prisma.user.findUnique({
      where: {
        email: json.email,
      }
    });

    // Remove sensitive information (password) before sending the response
    delete data?.password;

    // Return a NextResponse with the user data
    return new NextResponse(JSON.stringify(data), {
      status: 201, // Status code 201 indicates a successful resource creation
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    // Handle errors and return an error response
    let error_response = {
      status: "error",
      message: error.message,
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 500, // Status code 500 indicates an internal server error
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Define a function to handle PATCH requests
export async function PATCH(request: NextRequest) {
  try {
    // Extract 'id' from the query parameters
    const id = request.nextUrl.searchParams.get("id");

    // Check if 'id' is provided
    if (!id) {
      return new NextResponse(JSON.stringify("Id is not null"), {
        status: 500, // Status code 500 indicates an internal server error
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse JSON data from the incoming request
    let json = await request.json();

    // Update user data in the Prisma database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: json,
    });

    // Construct the reset URL for the email template
    const resetUrl = process.env.NEXT_PUBLIC_ENVIRONMENT + 'reset-password/' + json.resetPasswordToken;

    // Generate the email template for the forgot password email
    const template = forgotPasswordEmailTemplate(resetUrl);

    // Send the forgot password email using SendGrid
    sendgrid.send({
      to: updatedUser.email,
      from: process.env.NEXT_PUBLIC_SENDER_EMAIL!,
      subject: 'Reset Password',
      text: 'Reset Password',
      html: template,
    });

    // Return a NextResponse with the updated user data
    return new NextResponse(JSON.stringify(updatedUser), {
      status: 201, // Status code 201 indicates a successful resource creation
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    // Handle errors and return an error response
    let error_response = {
      status: "error",
      message: error.message,
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 500, // Status code 500 indicates an internal server error
      headers: { "Content-Type": "application/json" },
    });
  }
}
