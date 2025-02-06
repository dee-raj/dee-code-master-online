"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { Chapter } from "@prisma/client";

import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface ChapterAccessFormProps {
   initialData: Chapter;
   courseId: string;
   chapterId: string;
}

const formSchema = z.object({
   isFree: z.boolean().default(false),
});

export const ChapterAccessForm = ({
   initialData,
   courseId,
   chapterId
}: ChapterAccessFormProps) => {
   const [isEditing, setIsEditing] = useState(false);
   const toggleEdit = () => setIsEditing((current) => !current);

   const router = useRouter();

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         // isFree: Boolean(initialData.isFree) 
         isFree: !!initialData.isFree,
      }
   });

   const { isSubmitting, isValid } = form.formState;

   const onSumbit = async (values: z.infer<typeof formSchema>) => {
      try {
         await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
         toast.success("chapter updated successfully...");
         toggleEdit();
         router.refresh();
      } catch (err) {
         // console.log("[Chapter-Access]", err)
         toast.error("Something went wrong..!");
      }
   }
   return (
      <div className="mt-6 border bg-slate-100 rounded-md p-4">
         <div className="fornt-medium flex items-center justify-between">
            Chapter Access Settings
            <Button onClick={toggleEdit} variant="ghost">
               {isEditing ? (
                  <>
                     Cancel
                     <X size={"sm"} />
                  </>
               ) : (
                  <>
                     <Pencil className="h-4 w-4 mr-2" />
                     Edit Access
                  </>
               )}
            </Button>
         </div>
         {!isEditing && (
            <div className={cn(
               "text-sm my-2",
               !initialData.isFree && "text-slate-500 italic"
            )}>
               {initialData.isFree ? (
                  <>This chapter is free for review.</>
               ) : (
                  <>This chapter is not free.</>
               )}
            </div>
         )}
         {isEditing && (
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSumbit)}
                  className="space-y-4 mt-4"
               >
                  <FormField
                     control={form.control}
                     name="isFree"
                     render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                           <FormControl>
                              <Checkbox
                                 checked={field.value}
                                 onCheckedChange={field.onChange}
                              />
                           </FormControl>
                           <div className="space-y-1 leading-none">
                              <FormDescription>
                                 Check this box if you want to make this chapter freew for preview.
                              </FormDescription>
                           </div>
                        </FormItem>
                     )}
                  />
                  <div className="flex items-center gap-x-2">
                     <Button
                        disabled={!isValid || isSubmitting}
                        type="submit"
                     >
                        {isSubmitting ? "Saving" : "Save"}
                     </Button>
                  </div>
               </form>
            </Form>
         )}
      </div>
   );
};