import { Menu } from "lucide-react";
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
 } from "@/components/ui/sheet"
 

export const MobileSidebar = () =>{
   return (
      <Sheet>
         <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
            <Menu />
         </SheetTrigger>
         <SheetContent side={"left"} className="p-0 bg-white">
            <SheetHeader>
               <SheetTitle>Are you absolutely sure?</SheetTitle>
               <SheetDescription>
               This action cannot be undone. This will permanently delete your account
               and remove your data from our servers.
               </SheetDescription>
            </SheetHeader>
         </SheetContent>
      </Sheet>
   )
}