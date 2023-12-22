// Import necessary modules and packages
import { NextRequest, NextResponse } from "next/server";
import Chart from "../schemas/chart";
import dbConnect from "../../../../../mongoDb";

// Define the POST function to handle incoming requests
export async function POST(request: Request) {
  await dbConnect();
  try {
    // Parse the JSON data from the incoming request
    const json = await request.json();
    // Create a new document using the Mongoose model
    const newChart = new Chart({
      chartName: json.chartName ,
      pieChartName: json.pieChartName,
      userId: json.userId,
    });

    // Save the document to MongoDB
    const savedChart = await newChart.save();
     
   return new NextResponse(JSON.stringify({
    status: 'success',
    message: 'Chart added successfully',
    data: savedChart, // Include the created chart's data in the response
  }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }
   catch (error: any) {
    // Handle errors and return an error response
    let error_response = {
      status: "error",
      message: error.message,
    };
    console.log('err response', error_response)
    return new NextResponse(JSON.stringify(error_response), {
      status: 500, // Status code 500 indicates an internal server error
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Define a function to handle GET requests
export async function GET(request: NextRequest) {
  await dbConnect();
    try {
      // Extract 'id' from the query parameters
      const id = request.nextUrl.searchParams.get("id");
      // const fbid = request.nextUrl.searchParams.get("fbid");
      console.log('user id param in chart', id)
      // Check if 'id' is provided
      if (!id) {
        return new NextResponse(JSON.stringify("invalid user"), {
          status: 500, // Status code 500 indicates an internal server error
          headers: { "Content-Type": "application/json" },
        });
      }

      const allCharts = await Chart.find();
      const chartsData = allCharts.map((chart) => {
        const chartData = chart.toJSON();
        return chartData;
      });
      
      // // firebase logic start
      // const assetLiabilitiesCollection = collection(db, 'assetliabilities');
      // const q = query(assetLiabilitiesCollection, where('userId', '==', id), orderBy('updated', 'desc'));
      // // Execute the query and get the documents
      // const querySnapshot = await getDocs(q);
      // let allAssetLiabilitiesChartOfUser = querySnapshot.docs.map((doc) => {
      //   const { id, chartName } = doc.data();
      //   return { id, chartName };
      // });

      // firebase logic end
      // Return a NextResponse with the updated user data
      return new NextResponse(JSON.stringify({data: chartsData}), {
        status: 201, // Status code 201 indicates a successful resource creation
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
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
  
