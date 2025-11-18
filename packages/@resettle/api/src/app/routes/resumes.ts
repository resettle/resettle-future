import { route } from '@resettle/utils'

export const resumes = route('resumes', {
  id: route(':resumeId'),
})
