import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { isTeacher } from "@/actions/teacher";

const TeacherLayout = async ({ children }: {
    children: React.ReactNode
}) => {
    const { userId } = await auth();

    if (!isTeacher(userId)) {
        return redirect("/");
    }

    return <>{children}</>;
}

export default TeacherLayout;