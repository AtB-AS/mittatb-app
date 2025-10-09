import {client} from '@atb/api';
import {OperatorBenefitId} from '@atb-as/config-specs/lib/mobility';
import {getAxiosErrorMetadata} from '@atb/api/utils';
import {z} from 'zod';
import {PreassignedFareProduct} from '@atb/modules/configuration';

const UserBenefits = z.object({
  operator_id: z.string(),
  benefit_types: OperatorBenefitId.array(),
});

export type UserBenefitsType = z.infer<typeof UserBenefits>;

export const getBenefitsForUser = (): Promise<UserBenefitsType[]> => {
  return client
    .get('/benefit/v1/voucher/customer-benefits', {
      authWithIdToken: true,
      skipErrorLogging: (error) => error.response?.status === 404,
    })
    .then((response) => UserBenefits.array().parse(response.data ?? []))
    .catch((error) => {
      if (getAxiosErrorMetadata(error).responseStatus === 404) return [];
      throw error;
    });
};

export const getValueCode = (
  operatorId: string | undefined,
): Promise<string | null> => {
  if (!operatorId) return Promise.resolve(null);
  return client
    .post(
      `/benefit/v1/voucher/claim/${operatorId}`,
      {},
      {
        authWithIdToken: true,
        skipErrorLogging: (error) => error.response?.status === 404,
      },
    )
    .then((response) => String(response.data.code));
};

const FareProductBenefitMapping = z.object({
  operator_id: z.string(),
  benefit_types: OperatorBenefitId.array(),
});

type FareProductBenefitMappingType = z.infer<typeof FareProductBenefitMapping>;

export const getFareProductBenefits = (
  productId: PreassignedFareProduct['id'],
): Promise<FareProductBenefitMappingType[]> => {
  return client
    .get(`/benefit/v1/voucher/${productId}`, {
      authWithIdToken: true,
    })
    .then((response) => {
      const result = FareProductBenefitMapping.array().parse(
        response.data ?? [],
      );
      return result;
    });
};
