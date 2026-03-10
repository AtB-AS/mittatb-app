import {LanguageAndTextSchema} from '@atb/translations';
import z from 'zod';

export const Enrollment = z.object({
  programId: z.string(), // can be mapped to KnownProgramId enum, but keeping it flexible to allow for new programs without app code changes
  programTitle: z.array(LanguageAndTextSchema),
  programIsActive: z.boolean(),
  enturProgramId: z.number().nullable().optional(),
  enturReference: z.string().nullable().optional(),
  groupReference: z.string().nullable().optional(),
  enrolledAt: z.coerce.date(),
});

export type EnrollmentType = z.infer<typeof Enrollment>;

export enum KnownProgramId {
  BONUS = 'bonus',
}

export function isKnownProgramId(value: string): value is KnownProgramId {
  return Object.values(KnownProgramId).includes(value as KnownProgramId);
}
