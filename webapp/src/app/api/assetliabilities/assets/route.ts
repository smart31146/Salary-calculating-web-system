import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import dbConnect from "../../../../../mongoDb";
import Asset from "../schemas/assetSchema";


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
    const selectedChartAssets = await Asset.find({ chartId: selectedChartId });
    console.log('selected chart assets', selectedChartAssets)
    // Respond with the results
    return new NextResponse(JSON.stringify({data: selectedChartAssets}), {
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
      amount,
      asset,
      categoryId,
      chartId} = json
      const newAsset = new Asset({
        financialInstitution:financialInstitution,
        amount: Number(amount),
        asset,
        categoryId,
        chartId
      });
  
      // Save the document to MongoDB
      const savedAsset = await newAsset.save();
     
     return new NextResponse(JSON.stringify({message: 'Assets Data Created', data: savedAsset}), {
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
    const assetId = request.nextUrl.searchParams.get("assetId");

    // Find the asset by ID
    // Remove the asset from MongoDB using the deleteOne method
    const result = await Asset.deleteOne({ _id: assetId });

    // Check if the asset was found and deleted
    if (result.deletedCount === 0) {
      return new NextResponse(
        JSON.stringify({ message: 'Asset not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
      
    return new NextResponse(JSON.stringify({
          message: 'Asset Deleted Successfully'
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
      const {asset, amount, financialInstitution, assetId, selectedChartId} = json
      // Find the asset by ID
      const existingAsset = await Asset.findById(assetId);
      // If the asset is not found, return an error response
      if (!existingAsset) {
        return new NextResponse(
          JSON.stringify({ message: 'Asset not found' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      existingAsset.financialInstitution = financialInstitution;
      existingAsset.amount = Number(amount);
      existingAsset.asset = asset;
      await existingAsset.save()
     return new NextResponse(JSON.stringify({message: 'Asset Data Updated'}), {
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