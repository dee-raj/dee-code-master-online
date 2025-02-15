import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { courseId } = await params;
        const { userId } =await auth();
        if (!userId) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            }
        });
        if (!course) {
            return new NextResponse("Course Not Found", { status: 404 });
        }

        const unPublishedCourse = await db.course.update({
            where: {
                id: courseId,
                userId,
            },
            data: {
                isPublished: false,
            }
        });
        return NextResponse.json(unPublishedCourse);

    } catch (error) {
        console.log("Course-Id-UnPulish", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}