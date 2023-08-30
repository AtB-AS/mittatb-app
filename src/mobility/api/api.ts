import {client} from '@atb/api';
import {OperatorBenefitId} from '@atb-as/config-specs/lib/mobility-operators';
import {getAxiosErrorMetadata} from '@atb/api/utils';
import {z} from 'zod';

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

export const getBenefits = (): Promise<UserBenefitsType[]> => {
  return client
    .get('/mobility/benefits', {authWithIdToken: true})
    .then((response) => UserBenefits.array().parse(response.data ?? []));
};

export const getValueCode = (
  operatorId: string,
): Promise<string | undefined> => {
  return client
    .post(`/mobility/code/${operatorId}`, {}, {authWithIdToken: true})
    .then((response) => String(response.data.code))
    .catch((error) => {
      if (getAxiosErrorMetadata(error).responseStatus === 404) return undefined;
      throw error;
    });
};
