import {Benefit, OperatorBenefitsType} from '../types';

export const getBenefits = (): Promise<OperatorBenefitsType[]> => {
  return Promise.resolve([
    {
      operator: 'YVO:Operator:voi',
      benefits: [Benefit.FREE_UNLOCK],
    },
  ]);
};
