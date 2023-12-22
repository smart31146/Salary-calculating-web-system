import { NextRequest, NextResponse } from "next/server";
import { createObjectCsvStringifier } from 'csv-writer';


function createCSV(data, headers) {
  const csvStringifier = createObjectCsvStringifier({
    header: headers.map(header => ({ id: header, title: header })),
    recordDelimiter: '\r\n', // Set the record delimiter to CRLF (Carriage Return + Line Feed)
  });

  return [csvStringifier.getHeaderString(), ...data.map(row => csvStringifier.stringifyRecords([row]))].join('\n');
}

export async function POST(request: NextRequest) {
  try {
    // Reference to the outer collection (assetliabilities)
    const userId = request.nextUrl.searchParams.get("userId");
    const chartId = request.nextUrl.searchParams.get("chartId");
    const json = await request.json();
    console.log('jsonn', json)
    const csvData = [
        // Table 1
        createCSV(json.incomeList, ['id', 'amount', 'incomeSource', 'userId']), // Add actual headers for table1
  
        '\n\n', // Add two lines of space
  
        // Table 2
        createCSV(json.assetList, ['id', 'asset', 'financialInstitution', 'amount']), // Add actual headers for table2
  
        '\n\n', // Add two lines of space
  
        // Table 3
        createCSV(json.liabilitiesList, ['id', 'liability', 'financialInstitution', 'limit', 'balance', 'monthlyAmount']), // Add actual headers for table3
      ].join('');

      const headers = {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=income_data.csv`,
      };
    return new NextResponse(csvData, { status: 200, headers });
  } catch (error) {
    console.error('Error fin CSV:', error);
    console.log('my error in CSV', error.message)
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

