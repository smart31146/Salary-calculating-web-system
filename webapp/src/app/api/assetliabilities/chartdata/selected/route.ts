// Import necessary modules and packages
import { NextRequest, NextResponse } from "next/server";
import Chart from "../../schemas/chart";

// Define a function to handle GET requests
export async function GET(request: NextRequest) {
    try {
      // Extract 'id' from the query parameters
      const chartId = request.nextUrl.searchParams.get("docId");
      // Check if 'id' is provided
      if (!chartId) {
        return new NextResponse(JSON.stringify("invalid Chart data"), {
          status: 500, // Status code 500 indicates an internal server error
          headers: { "Content-Type": "application/json" },
        });
      }

     const existingChart = await Chart.findById(chartId);
      // If the asset is not found, return an error response
      if (!existingChart) {
        return new NextResponse( 
          JSON.stringify({ message: 'Chart not found' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    console.log('existing chart', existingChart)
      // firebase logic end
      // Return a NextResponse with the updated user data
      return new NextResponse(JSON.stringify({data: existingChart}), {
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
  
