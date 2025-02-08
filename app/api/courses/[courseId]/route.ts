import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

const { video } = new Mux({
   tokenId: process.env['MUX_TOKEN_ID'],
   tokenSecret: process.env['MUX_TOKEN_SECRET'],
});

export async function DELETE(
   req: Request,
   { params }: { params: { courseId: string } }
) {
   try {
      const { userId } = auth();
      if (!userId) {
         return new NextResponse("Unauthorized user", { status: 401 });
      }

      const courseWithMux = await db.course.findUnique({
         where: {
            id: params.courseId,
            userId: userId,
         },
         include: {
            chapters: {
               include: {
                  muxData: true,
               },
            },
         },
      });
      if (!courseWithMux) {
         return new NextResponse("Course Not Found", { status: 404 });
      }

      for (const chapter of courseWithMux.chapters) {
         if (chapter.muxData?.assetId) {
            try {
               await video.assets.delete(chapter.muxData.assetId);
            } catch (muxError) {
               console.error(
                  `Failed to delete Mux asset ${chapter.muxData.assetId}`,
                  muxError
               );
            }
         }
      }

      const deletedCourse = await db.course.delete({
         where: {
            id: params.courseId,
         },
      });
      return NextResponse.json(deletedCourse);

   } catch (error) {
      console.error("[Course-Id-Delete]", error);
      return new NextResponse("Internal Error..!", { status: 500 });
   }
}

export async function PATCH(
   req: Request,
   { params }: { params: { courseId: string } }
) {
   try {
      const { userId } = auth();
      const { courseId } = params;
      const values = await req.json();

      if (!userId) {
         return new NextResponse("Unauthorized user", { status: 401 });
      }

      const course = await db.course.update({
         where: {
            id: courseId,
            userId
         },
         data: {
            ...values,
         }
      });

      return NextResponse.json(course);
   } catch (error) {
      console.log("[COURSE_ID]", error);
      return new NextResponse("Internal Error", { status: 500 });
   }
}