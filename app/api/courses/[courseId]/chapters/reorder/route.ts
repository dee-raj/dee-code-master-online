import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }

        const { list } = await req.json();
        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            }
        })
        if (!ownCourse) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }

        for (let item of list) {
            await db.chapter.update({
                where: { id: item.id },
                data: { position: item.position }
            });
        }
        return new NextResponse("Success!", { status: 200 });
    } catch (errror) {
        console.log("Error: Reorder", errror);
        return new NextResponse("Internal Error", { status: 500 });
    }
}