import {client} from '@atb/api';
import {OperatorBenefitId} from '@atb-as/config-specs/lib/mobility';
import {z} from 'zod';
import {PreassignedFareProduct} from '@atb/modules/configuration';
import {RequestError, isErrorResponse} from '@atb/api/utils';

const VoucherBenefit = z.object({
  operatorId: z.string(),
  benefitTypes: OperatorBenefitId.array(),
});
export type VoucherBenefitType = z.infer<typeof VoucherBenefit>;

export const getBenefitsForUser = (): Promise<VoucherBenefitType[]> => {
  return client
    .get('/benefit/v1/voucher/customer-benefits', {
      authWithIdToken: true,
      skipErrorLogging: (error) => error.response?.status === 404,
    })
    .then((response) => VoucherBenefit.array().parse(response.data ?? []))
    .catch((e) => {
      const error = e as RequestError;

      if (isErrorResponse(error) && error.http.code === 404) return [];
      throw error;
    });
};

export const getValueCode = (
  operatorId: string | undefined,
): Promise<string | null> => {
  if (!operatorId) return Promise.resolve(null);
  return client
    .put(
      `/benefit/v1/voucher/claim/${operatorId}`,
      {},
      {
        authWithIdToken: true,
        skipErrorLogging: (error) => error.response?.status === 404,
      },
    )
    .then((response) => String(response.data.code));
};

export const getFareProductBenefits = (
  productId: PreassignedFareProduct['id'],
): Promise<VoucherBenefitType[]> => {
  return client
    .get(`/benefit/v1/voucher/${productId}`, {
      authWithIdToken: true,
    })
    .then((response) => VoucherBenefit.array().parse(response.data ?? []));
};
