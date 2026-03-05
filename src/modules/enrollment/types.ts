import {LanguageAndTextSchema} from '@atb/translations';
import z from 'zod';

export const Enrollment = z.object({
  programId: z.string(), // can be mapped to ProgramId enum, but keeping it flexible to allow for new programs without app code changes
  programTitle: z.array(LanguageAndTextSchema),
  programIsActive: z.boolean(),
  enturProgramId: z.number().nullable().optional(),
  enturReference: z.string().nullable().optional(),
  groupReference: z.string().nullable().optional(),
  enrolledAt: z.coerce.date(),
});

export type EnrollmentType = z.infer<typeof Enrollment>;

export type EnrollmentContextState = {
  enrollments: EnrollmentType[];
  isLoading: boolean;
  error: Error | null;
};

export enum ProgramId {
  BONUS = 'bonus',
}

export function isValidProgramId(value: string): value is ProgramId {
  return Object.values(ProgramId).includes(value as ProgramId);
}
