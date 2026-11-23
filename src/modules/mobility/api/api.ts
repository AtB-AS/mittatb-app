import {client} from '@atb/api';
import {OperatorBenefitId} from '@atb-as/config-specs/lib/mobility';
import {LanguageAndTextTypeArray} from '@atb-as/config-specs/lib/common';
import {z} from 'zod';
import type {PreassignedFareProduct} from '@atb/modules/ticketing';

const VoucherBenefit = z.object({
  operatorId: z.string(),
  benefitTypes: OperatorBenefitId.array(),
  title: LanguageAndTextTypeArray.nullish().transform((v) => v ?? undefined),
  description: LanguageAndTextTypeArray.nullish().transform(
    (v) => v ?? undefined,
  ),
  illustrationName: z.string().optional(),
});
export type VoucherBenefitType = z.infer<typeof VoucherBenefit>;

export const getFareProductBenefits = (
  productId: PreassignedFareProduct['id'],
): Promise<VoucherBenefitType[]> => {
  return client
    .get(`/benefit/v1/voucher/${productId}`, {
      authWithIdToken: true,
    })
    .then((response) => VoucherBenefit.array().parse(response.data ?? []));
};
