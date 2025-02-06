"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as z from "zod";

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
   title: z.string().min(1),
});


interface ChapterTitleFormProps {
   initialData: {
      title: string;
   };
   chapterId: string;
   courseId: string;
}

export const ChapterTitleForm = ({
   initialData,
   chapterId,
   courseId
}: ChapterTitleFormProps) => {
   const [isEditing, setIsEditing] = useState(false);
   const toggleEdit = () => setIsEditing((current) => !current);

   const router = useRouter();

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData,
   });

   const { isSubmitting, isValid } = form.formState;

   const onSumbit = async (values: z.infer<typeof formSchema>) => {
      try {
         await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
         toast.success("Chapter updated successfully...");
         toggleEdit();
         router.refresh();
      } catch {
         toast.error("Something went wrong..!");
      }
   }
   return (
      <div className="mt-6 border bg-slate-100 rounded-md p-4">
         <div className="fornt-medium flex items-center justify-between">
            Chapter titile
            <Button onClick={toggleEdit} variant="ghost">
               {isEditing ? (
                  <>
                     Cancel
                     <X size={"sm"} />
                  </>
               ) : (
                  <>
                     <Pencil className="h-4 w-4 mr-2" />
                     Edit title
                  </>
               )}
            </Button>
         </div>
         {!isEditing && (
            <p className="text-sm mt-2">
               {initialData.title}
            </p>
         )}
         {isEditing && (
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSumbit)}
                  className="space-y-4 mt-4"
               >
                  <FormField
                     control={form.control}
                     name="title"
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <Input
                                 disabled={isSubmitting}
                                 placeholder="e.g. 'Introduction to the course'"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
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