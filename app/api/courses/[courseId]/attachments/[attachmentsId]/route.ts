import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string, attachmentsId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId, attachmentsId } = await params;
        if (!userId) {
            return new NextResponse('Unauthorized user', { status: 401 });
        };

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            }
        });
        if (!courseOwner) {
            return new NextResponse('Unauthorized', { status: 401 });
        };
        const attachments = await db.attachment.delete({
            where: {
                courseId: courseId,
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