import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const client = new Mux({
    tokenId: process.env['MUX_TOKEN_ID'],
    tokenSecret: process.env['MUX_TOKEN_SECRET'],
});

export async function PATCH(
    req: Request,
    { params }: { params: { chapterId: string; courseId: string } }
) {
    try {
        const { userId } = auth();
        const { isPublished, ...values } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });
        if (!ownCourse) {
            return new NextResponse("Unauthorized user", { status: 401 });
        }

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                ...values,
            }
        });

        // TODO: Handle Video Upload
        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
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
                    chapterId: params.chapterId,
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