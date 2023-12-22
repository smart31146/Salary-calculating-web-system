import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma";

import dbConnect from "../../../../../mongoDb";
import Users from "../../users/userschema";



// export async function POST(request: Request) {
//   try {
    
//     const json = await request.json();
//     console.log('request.json',json)
//     const userCredential = await signInWithEmailAndPassword(auth, json.email, json.password)
//     const user = userCredential.user
//     const userRef = doc(db, 'users', user.uid);
//     const snapshot = await getDoc(userRef);
//     if(snapshot.exists() && snapshot.data()?.verified === true){
//       return new NextResponse(JSON.stringify(snapshot.data()), {
//         status: 201,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     else{
//         return new NextResponse({
//           message: 'User Not found or not verifed'
//         }, {
//           status: 404, // Status code 500 indicates an internal server error
//           headers: { "Content-Type": "application/json" },
//         });
//       }

//     // const data: any = await prisma.user.findUnique({
//     //   where: {
//     //     username: json.username,
//     //     password: json.password,
//     //     verified: true,
//     //   }
//     // });

//     // delete data?.password;
//     // return new NextResponse(JSON.stringify(data), {
//     //   status: 201,
//     //   headers: { "Content-Type": "application/json" },
//     // });
//   } catch (error: any) {
//     let error_response = {
//       status: "error",
//       message: error.message,
//     };
//     return new NextResponse(JSON.stringify(error_response), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

// pages/api/login.js

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const json = await request.json();
    console.log('request.json', json);

    // Find the user by email and password
    const user = await Users.findOne({
      email: json.email,
      password: json.password,
      verified: true, // Ensure the user is verified
    });
    if (user) {
      return new NextResponse(JSON.stringify(user), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new NextResponse(JSON.stringify({ message: 'User not found or not verified' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error: any) {
    console.error('Error during login:', error);
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
