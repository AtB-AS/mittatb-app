import {z} from 'zod';
import {FormFactor} from '@entur/sdk/lib/mobility/types';

export const MobilityOperator = z.object({
  id: z.string().nonempty(),
  showInApp: z.boolean().default(true),
  formFactors: z.array(z.nativeEnum(FormFactor)),
});

export type MobilityOperatorType = z.infer<typeof MobilityOperator>;
