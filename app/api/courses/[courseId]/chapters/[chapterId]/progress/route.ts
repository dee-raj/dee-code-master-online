import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{
        courseId: string;
        chapterId: string;
    }>
}

export async function PUT(
    req: Request,
    { params }: RouteParams,
) {
    try {
        const { chapterId, courseId } = await params;
        const { userId } = await auth();
        const { isCompleted } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }

        const userProgresses = await db.userProgress.upsert({
            create: {
                userId,
                chapterId,
                isCompleted
            },
            update: {
                isCompleted
            },
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                }
            }
        });

        return NextResponse.json(userProgresses);
    } catch (error) {
        console.log("Error: [Chapter-Progress]", error);
        return new NextResponse("Internal Error...", { status: 500 });
    }
}