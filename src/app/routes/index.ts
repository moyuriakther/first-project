import { Router } from 'express'
import { UserRoutes } from '../modules/user/user.route'
import { StudentRoutes } from '../modules/student/student.route'
import { academicSemesterRoutes } from '../modules/academicSemester/academicSemester.route'
import { academicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route'
import { academicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route'
import { FacultyRoutes } from '../modules/faculty/faculty.route'
import { AdminRoutes } from '../modules/admin/admin.route'
import { CourseRoutes } from '../modules/Course/course.route'
import { SemesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.route'
import { OfferedCourseRoutes } from '../modules/offeredCourse/offeredCourse.route'
import { AuthRoutes } from '../modules/auth/auth.route'

const router = Router()

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/faculties',
    route: FacultyRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/academic-semesters',
    route: academicSemesterRoutes,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
  {
    path: '/academic-faculties',
    route: academicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: academicDepartmentRoutes,
  },
  {
    path: '/semester-registration',
    route: SemesterRegistrationRoutes,
  },
  {
    path: '/offered-course',
    route: OfferedCourseRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
