import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../mongoDb";
import Liability from "../schemas/liabilitiesScehma";

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    // Reference to the outer collection (assetliabilities)
    const userId = request.nextUrl.searchParams.get("userId");
    const selectedChartId = request.nextUrl.searchParams.get("docId");
    if(!selectedChartId){
      return new NextResponse(JSON.stringify({message: 'chart id is required'}), {
        status: 500, // Status code 500 indicates an internal server error
        headers: { "Content-Type": "application/json" },
      });
    }
    const selectedChartLiability = await Liability.find({ chartId: selectedChartId });
    console.log('selectedChartLiability', selectedChartLiability)
    // Respond with the results
    return new NextResponse(JSON.stringify({data: selectedChartLiability}), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
  } catch (error) {
    console.error('Error fetching data:', error);
    console.log('my error in income', error.message)
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

// Define the POST function to handle incoming requests
export async function POST(request: NextRequest) {
    try {
      await dbConnect()
      const json = await request.json();
      const {financialInstitution,
        monthlyAmount,
        liability,
        limit,
        balance,
        categoryId,
        chartId
      } = json
      const newLiability = new Liability({
        financialInstitution,
        limit: Number(limit),
        balance: Number(balance),
        monthlyAmount: Number(monthlyAmount),
        liability,
        chartId,
        categoryId
      });
  
      // Save the document to MongoDB
      const savedLiability = await newLiability.save();
     
     return new NextResponse(JSON.stringify({message: 'Liability Data Created', data: savedLiability}), {
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

  export async function DELETE(request: NextRequest) {
    try {
      // Extract 'id' from the query parameters
    const liabilityId = request.nextUrl.searchParams.get("liabilityId");

    // Find the asset by ID
    // Remove the asset from MongoDB using the deleteOne method
    const result = await Liability.deleteOne({ _id: liabilityId });

    // Check if the asset was found and deleted
    if (result.deletedCount === 0) {
      return new NextResponse(
        JSON.stringify({ message: 'Liability not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
      
    return new NextResponse(JSON.stringify({
          message: 'Liability Deleted Successfully'
      }), {
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


// Define the POST function to handle incoming requests
export async function PATCH(request: NextRequest) {
    try {
      const json = await request.json();
      const {liability, monthlyAmount, financialInstitution, balance, limit, liabilityId} = json
      // Find the asset by ID
      const existingLiability = await Liability.findById(liabilityId);
      // If the asset is not found, return an error response
      if (!existingLiability) {
        return new NextResponse(
          JSON.stringify({ message: 'Liability not found' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      existingLiability.financialInstitution = financialInstitution;
      existingLiability.liability = liability;
      existingLiability.balance = Number(balance);
      existingLiability.monthlyAmount = Number(monthlyAmount);
      existingLiability.limit = Number(limit);
      await existingLiability.save()
     return new NextResponse(JSON.stringify({message: 'Liability Data Updated'}), {
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