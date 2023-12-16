import { Types } from 'mongoose'

export type Days = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

export type TOfferedCourse = {
  semesterRegistration: Types.ObjectId
  academicSemester?: Types.ObjectId
  academicFaculty: Types.ObjectId
  academicDepartment: Types.ObjectId
  course: Types.ObjectId
  faculty: Types.ObjectId
  maxCapacity: number
  section: number
  days: Days[]
  startTime: string
  endTime: string
}

export type TSchedule = {
  days: Days[]
  startTime: string
  endTime: string
}
