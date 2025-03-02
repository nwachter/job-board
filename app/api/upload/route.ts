import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/app/middleware";

const prisma = new PrismaClient();

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get("file") as File;

//     if (!file || file.type !== "application/pdf") {
//       return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
//     }

//     const buffer = await file.arrayBuffer();
//     const fileName = `${uuidv4()}.pdf`;
//     const filePath = path.join(process.cwd(), "data/uploads", fileName);

//     await fs.writeFile(filePath, Buffer.from(buffer));

//     const fileUrl = `${request.nextUrl.origin}/data/uploads/${fileName}`;
//     return NextResponse.json({ url: fileUrl }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: "File upload failed" }, { status: 500 });
//   }
// }

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Invalid file type. Only PDFs are allowed." }, { status: 400 });
    }

    // Convert file to Buffer
    const buffer = await file.arrayBuffer();
    const fileName = `${uuidv4()}.pdf`;

    // Store in "public/uploads" to allow direct access
    const uploadDir = path.join(process.cwd(), "public/uploads");

    // Ensure the directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Define file path
    const filePath = path.join(uploadDir, fileName);

    // Write file
    await fs.writeFile(filePath, Buffer.from(buffer));

    // Return public URL of the file
    const fileUrl = `/uploads/${fileName}`;
    return NextResponse.json({ url: fileUrl }, { status: 200 });

  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}

