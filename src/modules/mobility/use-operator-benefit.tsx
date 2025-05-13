import {useOperators} from './use-operators';

export const useOperatorBenefit = (operatorId: string | undefined) => {
  const operators = useOperators();

  // The data model supports multiple benefits per operator.
  // Currently, there is no requirement for more than one benefit per operator,
  // and the current UI is designed for only one.
  const operatorBenefit = operators.byId(operatorId)?.benefits[0];

  return {
    operatorBenefit,
  };
};
