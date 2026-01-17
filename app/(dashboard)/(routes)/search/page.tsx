import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getCourses } from "@/actions/get-courses";
import { Categories } from "./_components/categories";
import { SearchInput } from "@/components/search-input";
import { CoursesList } from "@/components/courses-list";

interface SearchParams {
   title?: string;
   categoryId?: string;
}

interface SearchParamsProps {
   searchParams: Promise<SearchParams>;
}

const SearchPage = async (props: SearchParamsProps) => {
   const searchParams = await props.searchParams;
   const { categoryId, title } = searchParams;

   const user = await currentUser();
   if (!user) {
      return redirect("/");
   }

   const categories = await db.category.findMany({
      orderBy: { name: "asc" },
   });

   const courses = await getCourses({
      title,
      userId: user.id,
      categoryId,
   });

   return (
      <>
         <div className="px-6 pt-6 md:hidden md:mb-0 block">
            <Suspense fallback={<div>Loading...</div>}>
               <SearchInput />
            </Suspense>
         </div>
         <div className="p-6 space-y-4">
            <Suspense fallback={<div>Loading...</div>}>
               <Categories items={categories} />
               <CoursesList items={courses} />
            </Suspense>
         </div>
      </>
   );
};

export default SearchPage;
