import { NextRequest, NextResponse } from "next/server";
import { getFirestore, collection, getDocs, query, where, doc, setDoc, deleteDoc } from 'firebase/firestore';
import firebase_app from "../../../../../firebaseConfig";
import { v4 as uuidv4 } from 'uuid';

const db = getFirestore(firebase_app);


export async function POST(request: NextRequest) {
  try {
    // Reference to the outer collection (assetliabilities)
    const userId = request.nextUrl.searchParams.get("userId");
    const chartId = request.nextUrl.searchParams.get("chartId");
    const assetLiabilitiesCollection = collection(db, 'assetliabilities');

    // Query to get all documents in the outer collection
    const assetLiabilitiesQuery = query(assetLiabilitiesCollection, where('userId', '==', userId), where('__name__', '==', chartId));

    // Execute the query and get the documents in the outer collection
    const assetLiabilitiesSnapshots = await getDocs(assetLiabilitiesQuery);

    // Array to store the results
    const assetList = [];
    const liabilitiesList = [];
    const incomeList = [];

    // Iterate over each document in the outer collection
    for (const assetDoc of assetLiabilitiesSnapshots.docs) {
      // Reference to the subcollection (assets) inside each document
      const assetCollection = collection(assetDoc.ref, 'assets');
      const incomeCollection = collection(assetDoc.ref, 'income');
      const liabilityCollection = collection(assetDoc.ref, 'liabilities');

      // Query to get all documents in the subcollection (assets)
      const assetQuery = query(assetCollection);
      const incomeQuery = query(incomeCollection);
      const liabilityQuery = query(liabilityCollection);

      // Execute the query and get the documents in the subcollection (income)
      const assetSnapshot = await getDocs(assetQuery);
      const incomeSnapshot = await getDocs(incomeQuery);
      const liabilitySnapshot = await getDocs(liabilityQuery);

      // Extract data from each document in the subcollection
      assetSnapshot.forEach((assetDocument) => {
        assetList.push(assetDocument.data(),);
      });
      incomeSnapshot.forEach((incomeDocument) => {
        incomeList.push(incomeDocument.data(),);
      });
      liabilitySnapshot.forEach((liabilityDocument) => {
        liabilitiesList.push(liabilityDocument.data(),);
      });
    }
    console.log('asset list', assetList)
    console.log('inc list', incomeList)
    console.log('liability list', liabilitiesList)
    Respond with the results
    return new NextResponse(JSON.stringify({data: json}), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
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

