import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const mongoUri = "mongodb://localhost:27017/myschool";

export async function GET(request: Request) {
  try {
    const email = request.headers.get("email");
    const userType = request.headers.get("userType");

    if (!email || !userType) {
      return NextResponse.json(
        { message: "Missing credentials" },
        { status: 400 }
      );
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db();

    let collectionName;
    switch(userType) {
      case "Admin": collectionName = "admins"; break;
      case "Teacher": collectionName = "teachers"; break;
      case "Student": collectionName = "students"; break;
      default: return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    const user = await db.collection(collectionName).findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const { firstName, lastName, email: userEmail, contactNumber, profilePicture } = user;
    return NextResponse.json({ 
      firstName, 
      lastName, 
      email: userEmail, 
      contactNumber, 
      profilePicture, 
      userType 
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Server error: " + error.message },
      { status: 500 }
    );
  }
}