import {OperatorBenefitIdType} from '@atb-as/config-specs/lib/mobility-operators';

export type UserBenefitsType = {
  operator: string;
  benefits: OperatorBenefitIdType[];
};

export const getBenefits = (): Promise<UserBenefitsType[]> => {
  console.log('Calling GET /mobility/benefits');
  return Promise.resolve([
    {
      operator: 'YVO:Operator:voi',
      benefits: ['free-unlock'],
    },
  ]);
};

export const getValueCode = (operatorId: string) => {
  console.log(`Calling POST /mobility/code/${operatorId}`);
  return Promise.resolve('aseaa-aws3ef-asfaew-ff23r2-1fds4');
};
