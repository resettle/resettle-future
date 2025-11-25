import { route } from '@resettle/utils'

export const auth = route('auth', {
  signIn: route('sign-in', {
    email: route('email'),
  }),
  otp: route('otp', {
    email: route('email'),
  }),
})
