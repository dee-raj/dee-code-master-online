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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";

interface PriceFormProps {
   initialData: Course;
   courseId: string;
}

const formSchema = z.object({
   price: z.coerce.number(),
});

export const PriceForm = ({
   initialData,
   courseId
}: PriceFormProps) => {
   const [isEditing, setIsEditing] = useState(false);
   const toggleEdit = () => setIsEditing((current) => !current);

   const router = useRouter();

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         price: initialData?.price || undefined
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
            Course Price
            <Button onClick={toggleEdit} variant="ghost">
               {isEditing ? (
                  <>
                     Cancel
                     <X size={"sm"} />
                  </>
               ) : (
                  <>
                     <Pencil className="h-4 w-4 mr-2" />
                     Edit price
                  </>
               )}
            </Button>
         </div>
         {!isEditing && (
            <p className={cn(
               "text-sm my-2",
               !initialData.price && "text-slate-500 italic"
            )}>
               {initialData.price
                  ? formatPrice(initialData.price)
                  : "No price"
               }
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
                     name="price"
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <Input
                                 type="number"
                                 step="0.01"
                                 disabled={isSubmitting}
                                 placeholder="set a price for your course"
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