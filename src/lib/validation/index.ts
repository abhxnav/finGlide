import { z } from 'zod'

// =========== Auth ===========
const authSchema = (type: string) => {
  const schema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .max(20, { message: 'Password must not exceed 20 characters.' })
      .regex(/[A-Z]/, {
        message: 'Password must include at least one uppercase letter.',
      })
      .regex(/[a-z]/, {
        message: 'Password must include at least one lowercase letter.',
      })
      .regex(/[0-9]/, { message: 'Password must include at least one number.' })
      .regex(/[@$!%*?&]/, {
        message: 'Password must include at least one special character.',
      }),

    firstName: z.string().min(3, {
      message: 'First name must be at least 3 characters long.',
    }),
    lastName: z.string().min(3, {
      message: 'Last name must be at least 3 characters long.',
    }),
    address1: z.string().max(50, {
      message: 'Address must not exceed 50 characters.',
    }),
    state: z
      .string()
      .max(2, { message: 'State must not exceed 2 characters.' }),
    postalCode: z.string().min(3).max(6, {
      message: 'Postal code must be between 3 and 6 characters.',
    }),
    dob: z.string().refine(
      (date) => {
        const currentDate = new Date()
        const dobDate = new Date(date)
        const age = currentDate.getFullYear() - dobDate.getFullYear()
        const isBirthdayPassed =
          currentDate.getMonth() > dobDate.getMonth() ||
          (currentDate.getMonth() === dobDate.getMonth() &&
            currentDate.getDate() >= dobDate.getDate())

        return age > 18 || (age === 18 && isBirthdayPassed)
      },
      { message: 'You must be at least 18 years old.' }
    ),
    ssn: z.string().length(9, {
      message: 'Enter a valid SSN.',
    }),
  })

  return type === 'sign-in'
    ? schema.partial({
        firstName: true,
        lastName: true,
        address1: true,
        state: true,
        postalCode: true,
        dob: true,
        ssn: true,
      })
    : schema
}

export { authSchema }
