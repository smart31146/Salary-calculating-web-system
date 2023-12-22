import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "../../../../../mongoDb"

// import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
// import firebase_app from "../../../../../firebaseConfig";
// import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// import connectDatabase from '../../../../../mongoDb';
// import User from '../../users/userschema';
import Users from "../../users/userschema";

// const auth = getAuth(firebase_app)
// const db = getFirestore(firebase_app)

// // Define the POST function to handle incoming requests
// export async function POST(request: Request) {
//   try {
//     // Parse the JSON data from the incoming request
//     // const db = await connectDatabase();
//     // const users = await User.find();
//     // console.log('useeeeeee', users)
//     const json = await request.json();
//     const userRef = doc(db, 'users', json.id);
//     const snapshot = await getDoc(userRef);
//     let data = null;
//     if(snapshot.exists()){
//       data = snapshot.data()
//       delete data?.password;
//       return new NextResponse(data, {
//         status: 201,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//     // Fetch user data from the Prisma database based on the provided email and id
//     // const data: any = await prisma.user.findUnique({
//     //   where: {
//     //     email: json.email,
//     //     id: json.id
//     //   }
//     // });

//     // Remove sensitive information (password) before sending the response
//     // delete data?.password;

//     // Return a NextResponse with the user data
//     // return new NextResponse(JSON.stringify(data), {
//     //   status: 201, // Status code 201 indicates a successful resource creation
//     //   headers: { "Content-Type": "application/json" },
//     // });
//   } catch (error: any) {
//     // Handle errors and return an error response
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

// pages/api/get-user.js;

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // Parse the JSON data from the incoming request
    const json = await request.json();
    const user = await Users.findById(json.id);

    if (user) {
      // Remove sensitive information (password) before sending the response
      const userData = user.toJSON();
      delete userData.password;

      return new NextResponse(userData, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new NextResponse(
        JSON.stringify({ message: 'User not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error: any) {
    console.error('Error fetching user data:', error);
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
