import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELEE(
    req: Request,
    { params }: { params: { CourseId: string, attachmentsId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse('Unauthorized user', { status: 401 });
        };

        const courseOwner = db.course.findUnique({
            where: {
                id: params.CourseId,
                userId: userId,
            }
        });
        if (!courseOwner) {
            return new NextResponse('Unauthorized', { status: 401 });
        };
        const attachments = await db.attachment.delete({
            where: {
                courseId: params.CourseId,
                id: params.attachmentsId
            }
        })
        return NextResponse.json(attachments);
    }
    catch (error) {
        console.log("Error", error);
        return new NextResponse("Internal server error: ", { status: 500 });
    }
}