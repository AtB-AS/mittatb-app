import {client} from '@atb/api';
import {OperatorBenefitIdType} from '@atb-as/config-specs/lib/mobility-operators';
import {getAxiosErrorMetadata} from '@atb/api/utils';

export type UserBenefitsType = {
  operator: string;
  benefits: OperatorBenefitIdType[];
};

export const getBenefits = (): Promise<UserBenefitsType[]> => {
  return client
    .get('/mobility/benefits', {authWithIdToken: true})
    .then((response) => response.data);
};

export const getValueCode = (
  operatorId: string,
): Promise<string | undefined> => {
  return client
    .post(`/mobility/code/${operatorId}`, {}, {authWithIdToken: true})
    .then((response) => response.data.code)
    .catch((error) => {
      if (getAxiosErrorMetadata(error).responseStatus === 404) return undefined;
      throw error;
    });
};
