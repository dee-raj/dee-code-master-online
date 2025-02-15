import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;
        const { url } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized user...", { status: 401 });
        }
        if (!courseId) {
            return NextResponse.json(
                { error: "Missing courseId" },
                { status: 400 }
            );
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            }
        });
        if (!courseOwner) {
            return NextResponse.json(
                { error: "Unauthorized: You do not own this course" },
                { status: 401 }
            );
        }

        const attachment = await db.attachment.create({
            data: {
                url: url,
                name: url.split("/").pop() || "file",
                courseId: courseId,
            },
        });
        return NextResponse.json(attachment);
    } catch (error) {
        console.error("Course_ID_Attachments error:", error);
        return NextResponse.json(
            { error: "Internal Error" },
            { status: 500 }
        );
    }
}