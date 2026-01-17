import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";


const TeacherCoursePage = async () => {
   const { userId } = await auth();
   if (!userId) {
      return redirect("/");
   }

   const courses = await db.course.findMany({
      where: {
         userId: userId,
      },
      orderBy: {
         createdAt: "desc"
      }
   });

   return (
      <div>
         <Link href="/teacher/create">
            <Button className="mt-4 ml-10 hover:bg-green-500 bg-green-700 text-justify font-mono text-xl">
               <Plus size={28} />
               {"Create a new Course"}
            </Button>
         </Link>
         <div className="container mx-auto py-1">
            <DataTable columns={columns} data={courses} />
         </div>
      </div>
   );
}

export default TeacherCoursePage;