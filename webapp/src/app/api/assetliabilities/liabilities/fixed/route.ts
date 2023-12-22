import { NextRequest, NextResponse } from "next/server";
import LiabilitiesCategories from "../../schemas/liabilitiesCategories";
import dbConnect from "../../../../../../mongoDb";


export async function GET(request: NextRequest) {
  await dbConnect()
  try {
    const chartId = request.nextUrl.searchParams.get("id");
    console.log('my chart id')
    // Query to get documents where parentId is not an empty string
    const parentAssetCategories = await LiabilitiesCategories.find({ parentId: '', type:'fixed' });
    const chartParents = await LiabilitiesCategories.find({chartId, type: 'dynamic'})
    const allParents = [...parentAssetCategories, ...chartParents]
    // Array to store the results
    const results = {};
    const parents = []

    // Iterate over each document in the collection
    for (const parent of allParents) {
      // Extract data from each document
      const childLiabilityCategories = await LiabilitiesCategories.find({ parentId: parent._id });
      results[parent.categoryName] = childLiabilityCategories
    }
    const data = {
      parentsData: results,
      parents: allParents
    }
    // Respond with the results
    return new NextResponse(JSON.stringify({ data: data }), {
      status: 200, // You can adjust the status code accordingly
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    console.log('My error in income', error.message);
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
    const {categoryName,
    selectedChartId} = json
    const newLiabiltyCategory = new LiabilitiesCategories({
      categoryName,
      chartId: selectedChartId,
      type:'dynamic',
      parentId:'',
    });

    // Save the document to MongoDB
    const savedLiabilityCategory = await newLiabiltyCategory.save();
   
   return new NextResponse(JSON.stringify({message: 'Liability Category Data Created', data: savedLiabilityCategory}), {
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
  const liabilityCategoryId = request.nextUrl.searchParams.get("liabilityCategoryId");

  // Find the asset by ID
  // Remove the asset from MongoDB using the deleteOne method
  const result = await LiabilitiesCategories.deleteOne({ _id: liabilityCategoryId, type: 'dynamic' });

  // Check if the asset was found and deleted
  if (result.deletedCount === 0) {
    return new NextResponse(
      JSON.stringify({ message: 'Liability Category not found' }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
    
  return new NextResponse(JSON.stringify({
        message: 'Liability Category Deleted Successfully'
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