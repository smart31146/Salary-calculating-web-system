import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../mongoDb";
import Users from "./userschema";


// export async function GET(request: NextRequest) {
//     try {
      
//     //   firebase logic start
//     const usersCollection = collection(db, 'users'); // Replace 'your_collection' with the actual collection name

//     // Create a query to retrieve documents where 'isVerified' is true
//     const q = query(usersCollection, where('verified', '==', true));

//     // Execute the query and get the snapshot
//     const querySnapshot = await getDocs(q);

//     // Extract the data from the snapshot
//     const data = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     })); 
//       return new NextResponse(JSON.stringify({data}), {
//         status: 201, // Status code 201 indicates a successful resource creation
//         headers: { "Content-Type": "application/json" },
//       });
//     } catch (error: any) {
//       // Handle errors and return an error response
//       console.log('my error', error.message)
//       let error_response = {
//         status: "error",
//         message: error.message,
//       };
//       return new NextResponse(JSON.stringify(error_response), {
//         status: 500, // Status code 500 indicates an internal server error
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//   }

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    // Fetch all users from MongoDB
    const allUsers = await Users.find();

    // Remove sensitive information (password) before sending the response
    const usersData = allUsers.map((user) => {
      const userData = user.toJSON();
      delete userData.password;
      return userData;
    });

    return new NextResponse(JSON.stringify({ data: usersData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error fetching all users:', error);
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
// export async function POST(request: Request) {
//     try {
//       const json = await request.json();
      
//       // in the end we will return this result once we migrate everything to firebase
//       const userDocRef = doc(db, 'users', json.userId);
//       await setDoc(userDocRef, {...json}, {
//         merge: true,
//     });
    
//       return new NextResponse(JSON.stringify({
//           message: 'Data updated successfully'
//       }), {
//         status: 201,
//         headers: { "Content-Type": "application/json" },
//       });
//     } catch (error: any) {
//       console.log('error he bhai', error)
//       let error_response = {
//         status: "error",
//         message: error.message,
//       };
//       return new NextResponse(JSON.stringify(error_response), {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//   }

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const json = await request.json();

    // Find the user by userId and update the data
    const updatedUser = await Users.findOneAndUpdate(
      { _id: json._id },
      { $set: json },
      { new: true } // Return the updated document
    );

    if (updatedUser) {
      // Remove sensitive information (password) before sending the response
      const userData = updatedUser.toJSON();
      delete userData.password;

      return new NextResponse(JSON.stringify(userData), {
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
    console.error('Error updating user:', error);
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

  export async function DELETE(request: NextRequest) {
    try {
      // Extract 'id' from the query parameters
      const id = request.nextUrl.searchParams.get("id");
      // const fbid = request.nextUrl.searchParams.get("fbid");
      console.log('id param', id)  
      // Check if 'id' is provided
      if (!id) {
        return new NextResponse(JSON.stringify("Id is not null"), {
          status: 500, // Status code 500 indicates an internal server error
          headers: { "Content-Type": "application/json" },
        });
      }

      // Find the user by userId and delete
      const deletedUser = await Users.findByIdAndDelete(id);

      if (deletedUser) {
        // Remove sensitive information (password) before sending the response
        const userData = deletedUser.toJSON();
        delete userData.password;

        return new NextResponse(JSON.stringify({
          message: 'User Deleted Successfully'
      }), {
        status: 201, // Status code 201 indicates a successful resource creation
        headers: { "Content-Type": "application/json" },
      });
      } 
        return new NextResponse(JSON.stringify({message: 'User Not found'}), {
          status: 500, // Status code 500 indicates an internal server error
          headers: { "Content-Type": "application/json" },})
    } 
    catch (error: any) {
      // Handle errors and return an error response
      console.log('my error', error.message)
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