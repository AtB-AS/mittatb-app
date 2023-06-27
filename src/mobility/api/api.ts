import {OperatorBenefitIdType} from '@atb-as/config-specs/lib/mobility-operators';

export type UserBenefitsType = {
  operator: string;
  benefits: OperatorBenefitIdType[];
};

export const getBenefits = (): Promise<UserBenefitsType[]> => {
  console.log('Calling GET /mobility/benefits');
  return Promise.resolve([
    {
      operator: 'YTR:Operator:trondheimbysykkel',
      benefits: ['free-use'],
    },
    {
      operator: 'YVO:Operator:voi',
      benefits: ['free-unlock'],
    },
  ]);
};

export const getValueCode = (operatorId: string) => {
  console.log(`Calling POST /mobility/code/${operatorId}`);
  return Promise.resolve('1fds4');
};
