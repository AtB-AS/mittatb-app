import {client} from '@atb/api';
import {OperatorBenefitIdType} from '@atb-as/config-specs/lib/mobility-operators';

export type UserBenefitsType = {
  operator: string;
  benefits: OperatorBenefitIdType[];
};

export const getBenefits = (): Promise<UserBenefitsType[]> => {
  return client.get('/mobility/benefits').then((response) => response.data);
};

export const getValueCode = (operatorId: string): Promise<string> => {
  return client
    .post(`/mobility/code/${operatorId}`)
    .then((response) => response.data.code);
};
