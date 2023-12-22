import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../mongoDb";
import BudgetIncome from "../schemas/income";

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    // Reference to the outer collection (assetliabilities)
    const selectedChartId = request.nextUrl.searchParams.get("budgetId");
    if(!selectedChartId){
      return new NextResponse(JSON.stringify({message: 'Budget chart id is required'}), {
        status: 500, // Status code 500 indicates an internal server error
        headers: { "Content-Type": "application/json" },
      });
    }
    const selectedChartIncome = await BudgetIncome.find({ chartId: selectedChartId });
    console.log('selected chart income', selectedChartIncome, selectedChartId)
    // Respond with the results
    return new NextResponse(JSON.stringify({data: selectedChartIncome}), {
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
      const {
      name,
      monthlyAmount,
      note,
      chartId} = json
      const newIncome = new BudgetIncome({
        name,
        note,
        monthlyAmount: Number(monthlyAmount),
        chartId,
        active: true
      });
  
      // Save the document to MongoDB
      const savedIncome = await newIncome.save();
     
     return new NextResponse(JSON.stringify({message: 'Budget Income Data Created', data: savedIncome}), {
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
    const incomeId = request.nextUrl.searchParams.get("incomeId");
    const type = request.nextUrl.searchParams.get("type");
    if(type === 'soft'){
        const existingIncome = await BudgetIncome.findById(incomeId);
        if (!existingIncome) {
            return new NextResponse(
              JSON.stringify({ message: 'Income not found' }),
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
        const result = await BudgetIncome.deleteOne({ _id: incomeId });

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
          message: 'Income Deleted Successfully'
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
      const {monthlyAmount, note, incomeId, name} = json
      // Find the asset by ID
      const existingIncome = await BudgetIncome.findById(incomeId);
      // If the asset is not found, return an error response
      if (!existingIncome) {
        return new NextResponse(
          JSON.stringify({ message: 'Income not found' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      existingIncome.monthlyAmount = Number(monthlyAmount);
      existingIncome.note = note;
      existingIncome.name = name;
      await existingIncome.save()
     return new NextResponse(JSON.stringify({message: 'Income Data Updated'}), {
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