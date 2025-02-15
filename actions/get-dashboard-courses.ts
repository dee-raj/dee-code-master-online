import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";

type CourseWithProgressWithCategory = Course & {
    category: Category;
    chapters: Chapter[];
    progress: number | null;
}

type DashboardCourses = {
    compledtedCourses: CourseWithProgressWithCategory[];
    courseInProgress: CourseWithProgressWithCategory[];
}

export const getDashboard = async (userId: string): Promise<DashboardCourses> => {
    try {
        const purchaseCourses = await db.purchase.findMany({
            where: {
                userId,
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true,
                            },
                        },
                    },
                },
            },
        });

        const courses = purchaseCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[];

        for (let course of courses) {
            const progress = await getProgress(userId, course.id);
            course["progress"] = progress;
        }
        const compledtedCourses = courses.filter((course) => course.progress === 100);
        const courseInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

        return { compledtedCourses, courseInProgress }
    } catch (error) {
        console.log("[Get-Dashboard-Courses]", error);
        return {
            compledtedCourses: [],
            courseInProgress: []
        }
    }
}
