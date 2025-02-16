import { auth } from "@clerk/nextjs";
import { isTeacher } from "@/actions/teacher";
import { UploadThingError } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = () => {
   const { userId } = auth();
   const isAuthorized = isTeacher(userId);
   if (!userId || !isAuthorized) { throw new UploadThingError("Unauthorized user"); }
   return { userId: userId };
}

export const ourFileRouter = {
   courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
      .middleware(() => handleAuth())
      .onUploadComplete(() => { }),

   courseAttachment: f(["text", "image", "video", "audio", "pdf"])
      .middleware(() => handleAuth())
      .onUploadComplete(() => { }),

   chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "64MB" } })
      .middleware(() => handleAuth())
      .onUploadComplete(() => { }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;