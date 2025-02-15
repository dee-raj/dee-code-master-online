import { auth } from "@clerk/nextjs";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";

import { CoursesList } from "@/components/courses-list";
import { getDashboard } from "@/actions/get-dashboard-courses";
import { InfoCard } from "./_components/info-card";

export default async function DashBoard() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const { compledtedCourses, courseInProgress } = await getDashboard(userId);


  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In-Progress"
          numberOfItems={courseInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Compledted-Courses"
          numberOfItems={compledtedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList
        items={[...courseInProgress, ...compledtedCourses]}
        key={0}
      />
    </div>
  );
}
