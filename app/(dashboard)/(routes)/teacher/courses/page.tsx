import { Button } from "@/components/ui/button";
import Link from "next/link";

const TeacherCoursePage = () => {
   return (
      <div>
         <Link href="/teacher/create">
            <Button className="m-4">
               New Course
            </Button>
         </Link>
      </div>
   );
}

export default TeacherCoursePage;