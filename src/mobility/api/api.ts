import {client} from '@atb/api';
import {OperatorBenefitId} from '@atb-as/config-specs/lib/mobility-operators';
import {getAxiosErrorMetadata} from '@atb/api/utils';
import {z} from 'zod';
import {PreassignedFareProductId} from '@atb/configuration/types';

const UserBenefits = z
  .object({
    operator: z.string(),
    benefits: OperatorBenefitId.array(),
  })
  .transform((it) => ({
    operator: it.operator,
    benefitIds: it.benefits,
  }));

export type UserBenefitsType = z.infer<typeof UserBenefits>;

export const getBenefitsForUser = (): Promise<UserBenefitsType[]> => {
  return client
    .get('/mobility/benefits', {
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
      `/mobility/code/${operatorId}`,
      {},
      {
        authWithIdToken: true,
        skipErrorLogging: (error) => error.response?.status === 404,
      },
    )
    .then((response) => String(response.data.code))
    .catch((error) => {
      throw error;
    });
};

const FareProductBenefitMapping = z.object({
  operator: z.string(),
  benefits: OperatorBenefitId.array(),
});

type FareProductBenefitMappingType = z.infer<typeof FareProductBenefitMapping>;

export const getFareProductBenefits = (
  productId: PreassignedFareProductId,
): Promise<FareProductBenefitMappingType[]> => {
  return client
    .get(`/mobility/v1/benefits/${productId}`, {
      authWithIdToken: true,
    })
    .then((response) =>
      FareProductBenefitMapping.array().parse(response.data ?? []),
    );
};
