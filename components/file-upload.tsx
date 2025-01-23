"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";

interface FileUploadProps {
   onChange: (url?: string) => void;
   endpoint: keyof typeof ourFileRouter;
};

export const FileUpload = ({
   onChange,
   endpoint
}: FileUploadProps) => {
   return (
      <UploadDropzone
         endpoint={endpoint}
         onClientUploadComplete={(res) => {
            console.log(`\nResponse: ${res}`);
            onChange(res?.[0].url);
            console.log(`File uploaded: ${res?.[0].url}`);
         }}
         onUploadError={(error) => {
            toast.error(`Error: ${error?.message} .`);
         }}
      />
   )
}