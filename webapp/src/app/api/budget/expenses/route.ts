import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../mongoDb";
import Expense from "../schemas/expense";

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    // Reference to the outer collection (assetliabilities)
    const selectedChartId = request.nextUrl.searchParams.get("budgetId");
    if(!selectedChartId){
      return new NextResponse(JSON.stringify({message: 'chart id is required'}), {
        status: 500, // Status code 500 indicates an internal server error
        headers: { "Content-Type": "application/json" },
      });
    }
    const selectedChartExpense = await Expense.find({ chartId: selectedChartId });
    // console.log('selectedChartExpense', selectedChartExpense)
    // Respond with the results
    return new NextResponse(JSON.stringify({data: selectedChartExpense}), {
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
      const {expense, monthlyAmount, categoryId, chartId} = json
      const newExpense = new Expense({
        expense,
        monthlyAmount: Number(monthlyAmount),
        categoryId,
        chartId,
        active: true,
      });
  
      // Save the document to MongoDB
      const savedExpense = await newExpense.save();
     
     return new NextResponse(JSON.stringify({message: 'Expense Data Created', data: savedExpense}), {
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
    const expenseId = request.nextUrl.searchParams.get("expenseId");
    const type = request.nextUrl.searchParams.get("type");
    if(type === 'soft'){
        const existingIncome = await Expense.findById(expenseId);
        if (!existingIncome) {
            return new NextResponse(
              JSON.stringify({ message: 'Expense not found' }),
              {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
              }
            );
          }
        existingIncome.active = false;
        await existingIncome.save()
    }
    else {
        const result = await Expense.deleteOne({ _id: expenseId });

        // Check if the asset was found and deleted
        if (result.deletedCount === 0) {
          return new NextResponse(
            JSON.stringify({ message: 'Income not found' }),
            {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
    }      
    return new NextResponse(JSON.stringify({
          message: 'Expense Deleted Successfully'
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
      const {expense, monthlyAmount, expenseId, active} = json
      // Find the asset by ID
      const existingExpense = await Expense.findById(expenseId);
      // If the asset is not found, return an error response
      if (!existingExpense) {
        return new NextResponse(
          JSON.stringify({ message: 'Expense not found' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      existingExpense.expense = expense;
      existingExpense.monthlyAmount = Number(monthlyAmount);
      existingExpense.active = active
      await existingExpense.save()
     return new NextResponse(JSON.stringify({message: 'Expense Data Updated'}), {
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