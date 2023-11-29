import {
  TAcademicSemesterNameCodeMapper,
  TMonths,
} from './academicSemester.interface'

export const Months: TMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const academicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
  Summer: '01',
  Winter: '02',
  Fall: '03',
}
