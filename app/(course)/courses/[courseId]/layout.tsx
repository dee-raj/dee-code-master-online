import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import React, { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { getProgress } from '@/actions/get-progress';
import { CourseSideBar } from './_components/course-sidebar';
import { CourseNavbar } from './_components/course-navbar';

const CourseLayout = async ({
    children,
    params
}: {
    children: ReactNode;
    params: { courseId: string; }
}) => {
    const { userId } = auth();
    if (!userId) { return redirect('/') }

    const publishedCourses = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId: userId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                include: {
                    userProgress: {
                        where: {
                            userId,
                        }
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            }
        },
    });

    if (!publishedCourses) { return redirect("/") }

    const progressCount = await getProgress(userId, publishedCourses.id);

    return (
        <div className="h-full">
            <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
                <CourseNavbar
                    course={publishedCourses}
                    progressCount={progressCount}
                />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSideBar
                    course={publishedCourses}
                    progressCount={progressCount}
                />
            </div>
            <main className="md:pl-80 h-full pt-[80px]">
                {children}
            </main>
        </div>
    )
}

export default CourseLayout;