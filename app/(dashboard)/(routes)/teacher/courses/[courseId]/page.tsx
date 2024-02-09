const CourseIdPage = ({
   params
}: {
   params: {courseId: string}
}) => {
   return ( 
      <div>
         This is courseId: {params.courseId}
      </div>
    );
}
 
export default CourseIdPage;