"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { Course } from "@prisma/client";

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DescriptionFormProps {
   initialData: Course;
   courseId: string;
}

const formSchema = z.object({
   description: z.string().min(1, {
      message: "Description is required!",
   }),
});

export const DescriptionForm = ({
   initialData,
   courseId
}: DescriptionFormProps) => {
   const [isEditing, setIsEditing] = useState(false);
   const toggleEdit = () => setIsEditing((current) => !current);

   const router = useRouter();

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         description: initialData?.description || ""
      }
   });

   const { isSubmitting, isValid } = form.formState;

   const onSumbit = async (values: z.infer<typeof formSchema>) => {
      try {
         await axios.patch(`/api/courses/${courseId}`, values);
         toast.success("Course updated successfully...");
         toggleEdit();
         router.refresh();
      } catch {
         toast.error("Something went wrong..!");
      }
   }
   return (
      <div className="mt-6 border bg-slate-100 rounded-md p-4">
         <div className="fornt-medium flex items-center justify-between">
            Course Description
            <Button onClick={toggleEdit} variant="ghost">
               {isEditing ? (
                  <>
                     Cancel
                     <X size={"sm"} />
                  </>
               ) : (
                  <>
                     <Pencil className="h-4 w-4 mr-2" />
                     Edit description
                  </>
               )}
            </Button>
         </div>
         {!isEditing && (
            <p className={cn(
               "text-sm my-2",
               !initialData.description && "text-slate-500 italic"
            )}>
               {initialData.description || "No Description"}
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
                     name="description"
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <Textarea
                                 disabled={isSubmitting}
                                 placeholder="e.g. 'This course is about...'"
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
   )
}