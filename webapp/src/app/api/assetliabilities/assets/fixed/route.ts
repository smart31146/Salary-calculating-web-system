import { NextRequest, NextResponse } from "next/server";
import AssetCategories from "../../schemas/assetCategories";
import dbConnect from "../../../../../../mongoDb";


export async function GET(request: NextRequest) {
  await dbConnect()
  try {
    const chartId = request.nextUrl.searchParams.get("id");
    console.log('my chart id')
    // Query to get documents where parentId is not an empty string
    const parentAssetCategories = await AssetCategories.find({ parentId: '', type:'fixed' });
    const chartParents = await AssetCategories.find({chartId, type: 'dynamic'})
    console.log('llklkl', chartParents)
    console.log('pccc', parentAssetCategories)
    const allParents = [...parentAssetCategories, ...chartParents]
    // Array to store the results
    const results = {};
    const parents = []

    // Iterate over each document in the collection
    for (const parent of allParents) {
      // Extract data from each document
      const childAssetCategories = await AssetCategories.find({ parentId: parent._id });
      results[parent.categoryName] = childAssetCategories
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
    const newAssetCategory = new AssetCategories({
      categoryName,
      chartId: selectedChartId,
      type:'dynamic',
      parentId:'',
    });

    // Save the document to MongoDB
    const savedAssetCategory = await newAssetCategory.save();
   
   return new NextResponse(JSON.stringify({message: 'Assets Data Created', data: savedAssetCategory}), {
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
  const AssetCategoryId = request.nextUrl.searchParams.get("assetCategoryId");

  // Find the asset by ID
  // Remove the asset from MongoDB using the deleteOne method
  const result = await AssetCategories.deleteOne({ _id: AssetCategoryId, type: 'dynamic' });

  // Check if the asset was found and deleted
  if (result.deletedCount === 0) {
    return new NextResponse(
      JSON.stringify({ message: 'Asset Category not found' }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
    
  return new NextResponse(JSON.stringify({
        message: 'Asset Category Deleted Successfully'
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