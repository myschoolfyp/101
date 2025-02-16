import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const mongoUri = "mongodb://localhost:27017/myschool";

// Helper function to generate roll number
const generateRollNumber = async (db: any, classLevel: number, classType: string) => {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const classCode = classLevel.toString().padStart(2, '0');
  
  let typeCode = '00'; // Default for classes 1-7
  if (classLevel >= 8) {
    typeCode = classType === 'Science' ? '11' :
               classType === 'Arts' ? '22' : '33';
  }

  // Find the last student in this class/type
  const lastStudent = await db.collection("students")
    .find({ classLevel, classType: typeCode })
    .sort({ _id: -1 })
    .limit(1)
    .toArray();

  let sequenceNumber = 1;
  if (lastStudent.length > 0) {
    const lastRollNumber = lastStudent[0].id.split('-')[1];
    sequenceNumber = parseInt(lastRollNumber) + 1;
  }

  const sequenceCode = sequenceNumber.toString().padStart(3, '0');
  return `${currentYear}${classCode}${typeCode}-${sequenceCode}`;
};

export async function POST(request: Request) {
  let client: MongoClient | null = null;
  try {
    const student = await request.json();
    const { firstName, lastName, email, contactNumber, classLevel, classType } = student;

    if (!firstName || !lastName || !email || !contactNumber || !classLevel || !classType) {
      return NextResponse.json(
        { message: "All fields are required", error: true },
        { status: 400 }
      );
    }

    client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db();

    const existingStudent = await db.collection("students").findOne({ email });

    if (existingStudent) {
      return NextResponse.json(
        { message: "Student with this email already exists", error: true },
        { status: 409 }
      );
    }

    // Generate roll number
    const id = await generateRollNumber(db, classLevel, classType);

    const result = await db.collection("students").insertOne({
      id,
      firstName,
      lastName,
      email,
      contactNumber,
      classLevel: Number(classLevel),
      classType: classLevel <= 7 ? '00' : 
                 classType === 'Science' ? '11' :
                 classType === 'Arts' ? '22' : '33',
    });

    return NextResponse.json(
      { message: "Student added successfully", error: false },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error", error: true },
      { status: 500 }
    );
  } finally {
    client?.close();
  }
}

export async function GET() {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db();
    const students = await db.collection("students").find().toArray();
    return NextResponse.json(students, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error", error: true },
      { status: 500 }
    );
  } finally {
    client?.close();
  }
}

export async function DELETE(request: Request) {
  let client: MongoClient | null = null;
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Student ID is required", error: true },
        { status: 400 }
      );
    }

    client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db();

    const result = await db.collection("students").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Student not found", error: true },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Student deleted successfully", error: false },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error", error: true },
      { status: 500 }
    );
  } finally {
    client?.close();
  }
}

export async function PUT(request: Request) {
  let client: MongoClient | null = null;
  try {
    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Student ID is required", error: true },
        { status: 400 }
      );
    }

    client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db();

    const updateResult = await db.collection("students").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { message: "Student not found", error: true },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Student updated successfully", error: false },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error", error: true },
      { status: 500 }
    );
  } finally {
    client?.close();
  }
}