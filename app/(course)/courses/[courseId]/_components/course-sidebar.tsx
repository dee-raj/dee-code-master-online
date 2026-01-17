import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { BookText } from "lucide-react";
import { redirect } from "next/navigation";
import { CourseSideBarItem } from "./course-sidebar-item";
import { CourseProgress } from "@/components/course-progress";
import { Chapter, Course, UserProgress } from "@prisma/client";

interface CourseSideBarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null
        })[]
    };
    progressCount: number;
}
export const CourseSideBar = async ({ course, progressCount }: CourseSideBarProps) => {
    const { userId } = await auth();
    if (!userId) { return redirect('/') }

    const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: course.id,
            }
        }
    });

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="px-1 py-3 flex flex-col border-b items-center">
                <BookText size={22} className="text-orange-500" />
                <h1 className="font-semibold">
                    {course.title}
                </h1>
                {purchase && (
                    <div className="mt-10">
                        <CourseProgress
                            variant="success"
                            value={progressCount}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter) => (
                    <CourseSideBarItem
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title}
                        isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                        courseId={course.id}
                        isLocked={!chapter.isFree && !purchase}
                    />
                ))}
            </div>
        </div>
    );
}
