import { NextRequest, NextResponse } from "next/server";
import ExpenseCategory from "../schemas/expensecategory";
import dbConnect from "../../../../../mongoDb";


export async function GET(request: NextRequest) {
  await dbConnect()
  try {
    const chartId = request.nextUrl.searchParams.get("budgetId");
    // console.log('expense category budget chart iD', chartId)
    // Query to get documents where parentId is not an empty string
    const parentAssetCategories = await ExpenseCategory.find({ type:'fixed' });
    const chartParents = await ExpenseCategory.find({chartId, type: 'dynamic'})
    const allParents = [...parentAssetCategories, ...chartParents]
    // console.log('allParents amd budget id',allParents, chartId)
    // Respond with the results
    return new NextResponse(JSON.stringify({ data: allParents }), {
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
    const {categoryName, type, selectedChartId} = json
    const newExpenseCategory = new ExpenseCategory({
      categoryName,
      chartId: selectedChartId,
      type,
      parentId:'',
    });

    // Save the document to MongoDB
    const savedExpenseCategory = await newExpenseCategory.save();
   
   return new NextResponse(JSON.stringify({message: 'Expense Data Created', data: savedExpenseCategory}), {
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
  const result = await ExpenseCategory.deleteOne({ _id: AssetCategoryId, type: 'dynamic' });

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