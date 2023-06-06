import {z} from 'zod';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

export const MobilityOperator = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  showInApp: z.boolean().default(true),
  formFactors: z.array(z.nativeEnum(FormFactor)),
});

export type MobilityOperatorType = z.infer<typeof MobilityOperator>;
