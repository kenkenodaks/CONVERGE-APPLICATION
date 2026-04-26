import { z } from 'zod';

// Philippine mobile number: 09XXXXXXXXX — exactly 11 digits
const phPhoneRegex = /^09\d{9}$/;

export const applicationSchema = z.object({
  plan: z.enum(['Plan 888', 'Plan 999'], { required_error: 'Please select a plan' }),

  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be 100 characters or less')
    .trim()
    .regex(/^[a-zA-Z\s.\-'ñÑ]+$/, 'Full name may only contain letters, spaces, and hyphens'),

  sitio: z
    .string()
    .min(1, 'Sitio / Purok is required')
    .max(100, 'Too long')
    .trim(),

  barangay: z
    .string()
    .min(1, 'Barangay is required')
    .max(100, 'Too long')
    .trim(),

  municipality: z
    .string()
    .min(1, 'Municipality / City is required')
    .max(100, 'Too long')
    .trim(),

  landmark: z
    .string()
    .min(1, 'Landmark is required')
    .max(150, 'Too long')
    .trim(),

  cellphone: z
    .string()
    .regex(phPhoneRegex, 'Must be 11 digits starting with 09 (e.g., 09171234567)'),

  email: z
    .string()
    .email('Enter a valid email address')
    .max(150, 'Email is too long')
    .toLowerCase()
    .trim(),
});

export const step1Schema = applicationSchema.pick({
  plan: true,
  fullName: true,
  cellphone: true,
  email: true,
});

export const step2Schema = applicationSchema.pick({
  sitio: true,
  barangay: true,
  municipality: true,
  landmark: true,
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
export type Step1Values = z.infer<typeof step1Schema>;
export type Step2Values = z.infer<typeof step2Schema>;

export function validateServerSide(data: Record<string, string>) {
  return applicationSchema.safeParse(data);
}

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('09')) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return phone;
}
