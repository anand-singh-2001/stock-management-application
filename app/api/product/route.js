import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  // console.log(request);
  // Replace the uri string with your connection string.
  const uri = "mongodb+srv://Anand:Babyrocks@mycluster.vw46xc3.mongodb.net/";

  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");

    const query = {};
    const products = await inventory.find(query).toArray();

    return NextResponse.json({ success: true, products });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
export async function POST(request) {
  // Replace the uri string with your connection string.
  let body = await request.json(); //all the items passes as body are saved into the body variable.
  // console.log(body);
  const uri =
    "mongodb+srv://Anand:Babyrocks@mycluster.vw46xc3.mongodb.net/?retryWrites=true&w=majority";

  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");

    const product = await inventory.insertOne(body);
    console.log("Product", product);
    return NextResponse.json({ product, ok: true });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
