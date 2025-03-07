import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string, chapterId: string }> }
) {
    try {
        const { courseId, chapterId } = await params;
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            }
        });
        if (!ownCourse) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId,
            }
        });
        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: chapterId,
            }
        });
        if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("Missing required fields.", { status: 400 });
        }

        const publishChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId,
            },
            data: {
                isPublished: true,
            }
        });

        return NextResponse.json(publishChapter);
    } catch (error) {
        console.log("[Chapter-Publish]", error);
        return new NextResponse("Internal Error...", { status: 500 });
    }
}