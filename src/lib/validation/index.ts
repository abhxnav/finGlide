import { z } from 'zod'

// =========== Auth ===========
const authSchema = (type: 'sign-up' | 'sign-in') => {
  // Common validation rules
  const stringField = (min: number, max: number, messagePrefix: string) =>
    z
      .string()
      .min(min, {
        message: `${messagePrefix} must be at least ${min} characters long.`,
      })
      .max(max, {
        message: `${messagePrefix} must not exceed ${max} characters.`,
      })

  const passwordField = z
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
    })

  const dobField = z.string().refine(
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
  )

  const baseSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: passwordField,
  })

  // Additional fields for sign-up
  if (type === 'sign-up') {
    return baseSchema.extend({
      firstName: stringField(3, 100, 'First name'),
      lastName: stringField(3, 100, 'Last name'),
      address1: stringField(3, 100, 'Address'),
      city: stringField(3, 100, 'City'),
      state: z
        .string()
        .max(2, { message: 'State must not exceed 2 characters.' }),
      postalCode: z
        .string()
        .min(3, { message: 'Postal code must be between 3 and 6 characters.' })
        .max(6, { message: 'Postal code must be between 3 and 6 characters.' }),
      dateOfBirth: dobField,
      ssn: z.string().length(9, { message: 'Enter a valid SSN.' }),
    })
  }

  // Optional fields for sign-in
  return baseSchema.extend({
    firstName: stringField(3, 100, 'First name').optional(),
    lastName: stringField(3, 100, 'Last name').optional(),
    address1: stringField(3, 100, 'Address').optional(),
    city: stringField(3, 100, 'City').optional(),
    state: z
      .string()
      .max(2, { message: 'State must not exceed 2 characters.' })
      .optional(),
    postalCode: z
      .string()
      .min(3, { message: 'Postal code must be between 3 and 6 characters.' })
      .max(6, { message: 'Postal code must be between 3 and 6 characters.' })
      .optional(),
    dateOfBirth: dobField.optional(),
    ssn: z.string().length(9, { message: 'Enter a valid SSN.' }).optional(),
  })
}

// =========== Payment Transfer ===========
const PaymentTransferFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(4, 'Transfer note is too short'),
  amount: z.string().min(4, 'Amount is too short'),
  senderBank: z.string().min(4, 'Please select a valid bank account'),
  sharableId: z.string().min(8, 'Please select a valid sharable Id'),
})

export { authSchema, PaymentTransferFormSchema }
