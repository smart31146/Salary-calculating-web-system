import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import * as sendgrid from '@sendgrid/mail';
import Users from '../../users/userschema'
import dbConnect from "../../../../../mongoDb";


// Set SendGrid API key from environment variable
sendgrid.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY!);

export async function POST(request: Request) {
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ['omamaintikhab97@gmail.com', 'ointikhab97@gmail.com',
        'syedarabbia9@gmail.com',
        'maarijmallick22@gmail.com',
        'sunaim@gmail.com',
        'sunaimm@gmail.com'
      ],
      },
    },
  });
  const allUserEmails = await prisma.user.findMany({
    select: {
      email: true,
    },
  });
  // console.log('All user emails:', allUserEmails.map((user) => user.email));
  try {
    await dbConnect();
    const json = await request.json();
    console.log('register body', json)
    
    const dbData = {
      ...json,
      verified: false,
      isStaff: false,
      isSuperAdmin: false,
      active: false,
    }

    const mongoUser = await Users.create({
      username: json.username,
      email: json.email,
      password: json.password,
      city: json.city,
      gender: json.gender,
      verified: false,
      isStaff: false,
      isSuperAdmin: false,
      active: false,
     // Assuming user.uid is the unique identifier from Firebase
    });
   console.log('mongoooo user', mongoUser, mongoUser._id)
    return new NextResponse(JSON.stringify(mongoUser), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.log('error he bhai', error)
    let error_response = {
      status: "error",
      message: error.message,
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Parse JSON data from the incoming request
    let json = await request.json();
    console.log('json data in patch', json)
    // Construct the reset URL for the email template
    const resetUrl = process.env.NEXT_PUBLIC_ENVIRONMENT + 'verify-email/' + json.id.toString();

    // Send the forgot password email using SendGrid
    sendgrid.send({
      to: json.email,
      from: process.env.NEXT_PUBLIC_SENDER_EMAIL!,
      subject: 'Verify Email Address',
      text: 'Verify Email Address',
      html: `<div> Verity your email </br> ${resetUrl} </div>`,
    });
    // Return a NextResponse with the success flag
    return new NextResponse(JSON.stringify({
      success: true
    }), {
      status: 201, // Status code 201 indicates a successful resource creation
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.log(error)
    let error_response = {
      status: "error",
      message: error.message,
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Define a function to handle GET requests
// export async function GET(request: NextRequest) {
//   try {
//     // Extract 'id' from the query parameters
//     const id = request.nextUrl.searchParams.get("id");
//     // const fbid = request.nextUrl.searchParams.get("fbid");
//     console.log('id param', id)

//     // Check if 'id' is provided
//     if (!id) {
//       return new NextResponse(JSON.stringify("Id is not null"), {
//         status: 500, // Status code 500 indicates an internal server error
//         headers: { "Content-Type": "application/json" },
//       });
//     }
    
//     // firebase logic start
//     const userDocRef = doc(db, 'users', id);
//     let errorMessage = '';
//     const snapshot = await getDoc(userDocRef);
//     let updatedSnapshot = null;
//     let result = null;
//     if (snapshot.exists()) {
//       result = snapshot.data();
//       if(result.verified === true){
//         errorMessage = "User already verified"
//       }
//       else{
//         await setDoc(userDocRef, {verified: true, active: true}, {
//           merge: true,
//       });
//        const updatedSnapshotData = await getDoc(userDocRef)
//        if(updatedSnapshotData.exists()){
//           updatedSnapshot = updatedSnapshotData.data()
//        }
//       }

//     } else {
//       errorMessage = "Unable to findUser not found"
//     }

//     if (errorMessage) {
//       return new NextResponse(JSON.stringify(errorMessage), {
//         status: 500, // Status code 500 indicates an internal server error
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//     // firebase logic end
    
//     // Get user data in the Prisma database
//     // const user = await prisma.user.findUnique({
//     //   where: { id },
//     // });
//     // let errorMsg = null;
//     // if (!user) {
//     //   errorMsg = "User not found";
//     // } else if (user.verified) {
//     //   errorMsg = "User already verified";
//     // }

//     // if (errorMsg) {
//     //   return new NextResponse(JSON.stringify(errorMsg), {
//     //     status: 500, // Status code 500 indicates an internal server error
//     //     headers: { "Content-Type": "application/json" },
//     //   });
//     // }

//     // // Update user data in the Prisma database
//     // const updatedUser = await prisma.user.update({
//     //   where: { id },
//     //   data: {
//     //     verified: true,
//     //   },
//     // });

//     // Return a NextResponse with the updated user data
//     console.log('updated snapshot', updatedSnapshot)
//     return new NextResponse(JSON.stringify(updatedSnapshot), {
//       status: 201, // Status code 201 indicates a successful resource creation
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error: any) {
//     // Handle errors and return an error response
//     console.log('my error', error.message)
//     let error_response = {
//       status: "error",
//       message: error.message,
//     };
//     return new NextResponse(JSON.stringify(error_response), {
//       status: 500, // Status code 500 indicates an internal server error
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

export  async function GET(request: NextRequest) {
  await dbConnect();

  try {
    // Extract 'id' from the query parameters
    const id = request.nextUrl.searchParams.get('id');
    console.log('id param', id);

    // Check if 'id' is provided
    if (!id) {
      return new NextResponse(JSON.stringify({ error: 'Id is not provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Find the user by id
    const user = await Users.findById(id);
    console.log('registered user', user)
    // Check if the user exists
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if the user is already verified
    if (user.verified === true) {
      console.log('user is already there')
      return new NextResponse(JSON.stringify({ error: 'User already verified' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update the user's verified status
    user.verified = true;
    user.active = true;
    await user.save();

    // Return the updated user data
    return new NextResponse(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error during user verification:', error);
    const errorResponse = {
      status: 'error',
      message: error.message,
    };
    return new NextResponse(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}