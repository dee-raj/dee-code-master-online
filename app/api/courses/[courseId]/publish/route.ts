import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params;
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }

        const courseWithMux = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                }
            }
        });
        if (!courseWithMux) {
            return new NextResponse("Course Not Found", { status: 404 });
        }

        const hasPublishedChapter = courseWithMux.chapters.some((chaper) => chaper.isPublished);
        if (!courseWithMux.title || !courseWithMux.description ||
            !courseWithMux.imageUrl || !courseWithMux.categoryId || !hasPublishedChapter
        ) {
            return new NextResponse("Missing required fields", { status: 402 });
        }

        const publishedCourse = await db.course.update({
            where: {
                id: courseId,
                userId,
            },
            data: {
                isPublished: true,
            }
        });
        return NextResponse.json(publishedCourse);

    } catch (error) {
        console.log("Course_Id-pulish", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}