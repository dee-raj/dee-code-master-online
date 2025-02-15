import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const client = new Mux({
    tokenId: process.env['MUX_TOKEN_ID'],
    tokenSecret: process.env['MUX_TOKEN_SECRET'],
});

export async function DELETE(
    req: Request,
    { params }: { params: { chapterId: string; courseId: string } }
) {
    try {
        const { userId } = await auth();
        const { courseId, chapterId } = await params;
        if (!userId) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            }
        });
        if (!ownCourse) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId
            }
        });
        if (!chapter) {
            return new NextResponse("Not Found", { status: 404 });
        }

        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId,
                }
            });
            if (existingMuxData) {
                await client.video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                });
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: chapterId,
            }
        });

        const publishedChapterInCourse = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            }
        });

        if (!publishedChapterInCourse.length) {
            await db.course.update({
                where: {
                    id: courseId,
                },
                data: {
                    isPublished: false,
                }
            });
        }

        return NextResponse.json(deletedChapter);

    } catch (error) {
        console.log("[Chapter-ID-DELETE]", error);
        return new NextResponse("Internal Errror...", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { chapterId: string; courseId: string } }
) {
    try {
        const { userId } = await auth();
        const { courseId, chapterId } = await params;
        const { isPublished, ...values } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        });
        if (!ownCourse) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                ...values,
            }
        });

        // TODO: Handle Video Upload
        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId
                }
            });

            if (existingMuxData) {
                await client.video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                });
            }

            const assets = await client.video.assets.create({
                input: values.videoUrl,
                playback_policy: ["public"],
                test: false,
            });

            await db.muxData.create({
                data: {
                    chapterId: chapterId,
                    assetId: assets.id,
                    playbackId: assets.playback_ids?.[0]?.id,
                }
            })
        }
        return NextResponse.json(chapter);
    } catch (error) {
        console.log('[Charper_course_Id]');
        return new NextResponse('Internal Error...', { status: 500 });
    }
}