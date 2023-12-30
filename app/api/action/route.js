import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  // Replace the uri string with your connection string.
  let { action, slug, initialQuantity } = await request.json(); //all the items passes as body are saved into the body variable.
  //   console.log(action);
  const uri = process.env.NEXT_PUBLIC_MONGO_URI;

  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");
    // Create a filter for movies with the title "Random Harvest"
    const filter = { slug: slug };
    /* Set the upsert option to insert a document if no documents match
    the filter */
    // Specify the update to set a value for the plot field
    let newQuantity =
      action == "add"
        ? parseInt(initialQuantity) + 1
        : parseInt(initialQuantity) - 1;
    const updateDoc = {
      $set: {
        quantity: newQuantity,
      },
    };
    // Update the first document that matches the filter
    const result = await inventory.updateOne(filter, updateDoc);

    // Print the number of matching and modified documents
    return NextResponse.json({
      success: true,
      message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    });
  } finally {
    // Close the connection after the operation completes
    await client.close();
  }
}
