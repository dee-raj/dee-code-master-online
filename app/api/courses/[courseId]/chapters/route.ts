import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        });
        if (!courseOwner) {
            return new NextResponse("Unauthorized: You do not own this chapter", { status: 401 });
        }

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: courseId,
            },
            orderBy: {
                position: 'desc'
            },
        });
        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId: courseId,
                position: newPosition,
            }
        });

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[Chapters]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}