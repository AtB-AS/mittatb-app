export enum Benefit {
  FREE_UNLOCK = 'free-unlock',
}

export type OperatorBenefitsType = {
  operator: string;
  benefits: Benefit[];
};
