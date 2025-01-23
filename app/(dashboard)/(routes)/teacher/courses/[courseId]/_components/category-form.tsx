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
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps {
   initialData: Course;
   courseId: string;
   options: { label: string; value: string }[];
}

const formSchema = z.object({
   categoryId: z.string().min(1),
});

export const CategoryForm = ({
   initialData,
   courseId,
   options,
}: CategoryFormProps) => {
   const [isEditing, setIsEditing] = useState(false);
   const toggleEdit = () => setIsEditing((current) => !current);

   const router = useRouter();

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         categoryId: initialData?.crategoryId || ""
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
   };
   const selectedOption = options.find((option) => option.value === initialData.crategoryId);

   return (
      <div className="mt-6 border bg-slate-100 rounded-md p-4">
         <div className="fornt-medium flex items-center justify-between">
            Course Category
            <Button onClick={toggleEdit} variant="ghost">
               {isEditing ? (
                  <>
                     Cancel
                     <X size={"sm"} />
                  </>
               ) : (
                  <>
                     <Pencil className="h-4 w-4 mr-2" />
                     Edit category
                  </>
               )}
            </Button>
         </div>
         {!isEditing && (
            <p className={cn(
               "text-sm my-2",
               !initialData.crategoryId && "text-slate-500 italic"
            )}>
               {selectedOption?.label || "No Category"}
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
                     name="categoryId"
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <Combobox
                                 options={options}
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
                        Save
                     </Button>
                  </div>
               </form>
            </Form>
         )}
      </div>
   )
}