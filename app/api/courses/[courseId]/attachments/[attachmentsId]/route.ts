import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { CourseId: string, attachmentsId: string } }
) {
    try {
        const { userId } = await auth();
        const { CourseId, attachmentsId } = await params;
        if (!userId) {
            return new NextResponse('Unauthorized user', { status: 401 });
        };

        const courseOwner = db.course.findUnique({
            where: {
                id: CourseId,
                userId: userId,
            }
        });
        if (!courseOwner) {
            return new NextResponse('Unauthorized', { status: 401 });
        };
        const attachments = await db.attachment.delete({
            where: {
                courseId: CourseId,
                id: attachmentsId
            }
        })
        return NextResponse.json(attachments);
    }
    catch (error) {
        console.log("Error", error);
        return new NextResponse("Internal server error: ", { status: 500 });
    }
}