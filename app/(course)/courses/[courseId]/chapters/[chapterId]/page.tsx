import { GetChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/seperator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { CourseProgressButton } from "./_components/course-progress-button";

interface chapterIdPageProps {
    params: {
        courseId: string;
        chapterId: string;
    };
};
const ChapterIdPage = async ({ params }: chapterIdPageProps) => {
    const { chapterId, courseId } = await params;

    const { userId } = await auth();
    if (!userId) { return redirect("/"); }

    const {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase
    } = await GetChapter({
        userId,
        chapterId: chapterId,
        courseId: courseId
    });

    if (!course || !chapter) { return redirect("/"); }

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    return (
        <div className="pl-1">
            {userProgress?.isCompleted && (
                <Banner
                    label="You already completed this chapter"
                    variant={"success"}
                />
            )}
            {isLocked && (
                <Banner
                    variant={"warning"}
                    label="You need to purchase this course to watch this chapter. Dee: not everthing is free bro :)"
                />
            )}
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPlayer
                        chapterId={chapterId}
                        title={chapter.title}
                        courseId={courseId}
                        nextChapterId={nextChapter?.id}
                        playbackId={muxData?.playbackId!}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd}
                    />
                </div>
                <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                    <h2 className="text-2xl font-semibold mb-2">
                        {chapter.title}
                    </h2>
                    {purchase ? (
                        <CourseProgressButton
                            courseId={courseId}
                            chapterId={chapterId}
                            nextChapterId={nextChapter?.id}
                            isCompleted={!!userProgress?.isCompleted}
                        />
                    ) : (
                        <CourseEnrollButton
                            courseId={courseId}
                            price={course.price!}
                        />
                    )}
                </div>
                <Separator />
                <div>
                    <Preview value={chapter.description!} />
                </div>
                {!!attachments.length && (
                    <>
                        <Separator />
                        <div className="p-4">
                            {attachments.map((attachment) => (
                                <a href={attachment.url}
                                    key={attachment.id}
                                    target="_blank"
                                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                                >
                                    <File size={24} className="w-4 h-4 mr-1 md:mr-4 " />
                                    <p className="line-clamp-1">
                                        {attachment.name}
                                    </p>
                                </a>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ChapterIdPage;