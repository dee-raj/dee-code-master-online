"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { isTeacher } from "@/actions/teacher";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";

export const NavbarRoutes = () => {
   const pathname = usePathname();
   const { userId } = useAuth();

   const isTeacherPage = pathname?.startsWith("/teacher");
   const isCoursePage = pathname?.includes("/courses");
   const isSearchPage = pathname === '/search';

   return (
      <>
         {isSearchPage && (
            <div className="hidden md:block">
               <Suspense fallback={<div>Loading...</div>}>
                  <SearchInput />
               </Suspense>
            </div>
         )}
         <div className="flex gap-x-2 ml-auto">
            {isTeacherPage || isCoursePage ? (
               <Link href="/">
                  <Button size="sm" variant="ghost">
                     <LogOut className="h-4 w-4 mr-2" />
                     Exit
                  </Button>
               </Link>
            ) : isTeacher(userId) ? (
               <Link href="/teacher/courses">
                  <Button size="sm" variant="ghost">
                     Teacher Mode
                  </Button>
               </Link>
            ) : null}
            <UserButton
               afterSignOutUrl="/"
            />
         </div>
      </>
   );
};
