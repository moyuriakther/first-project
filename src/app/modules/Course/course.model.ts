import { Schema, model } from 'mongoose'
import {
  TCourse,
  TCourseFaculty,
  TPreRequisiteCourses,
} from './course.interface'

const preRequisiteSchema = new Schema<TPreRequisiteCourses>({
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  isDeleted: { type: Boolean, default: false },
})

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    prefix: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: Number,
      required: true,
      trim: true,
    },
    credits: {
      type: Number,
      required: true,
      trim: true,
    },
    preRequisiteCourses: [preRequisiteSchema],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

export const CourseModel = model<TCourse>('Course', courseSchema)

const courseFacultiesSchema = new Schema<TCourseFaculty>(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', unique: true },
    faculties: [{ type: Schema.Types.ObjectId, ref: 'faculty' }],
  },
  { timestamps: true },
)

export const CourseFacultyModel = model<TCourseFaculty>(
  'CourseFaculty',
  courseFacultiesSchema,
)
