import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { isTeacher } from "@/actions/teacher";

export async function POST(
   req: Request,
) {
   try {
      const { userId } = auth();
      const { title } = await req.json();

      if (!userId || !isTeacher(userId)) {
         return new NextResponse("Unauthorized user", { status: 401 });
      }

      const course = await db.course.create({
         data: {
            userId,
            title,
         }
      });

      return NextResponse.json(course);
   } catch (error) {
      console.error("[COURSES]", error);
      return new NextResponse("Internal Error", { status: 500 });
   }
}