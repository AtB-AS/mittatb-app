import {FormFactorFilterType} from '@atb/components/map';
import {useEffect, useState} from 'react';
import {MobilityOperatorType} from '@atb-as/config-specs/lib/mobility-operators';

export const useOperatorToggle = (
  allOperators: MobilityOperatorType[],
  initialFilter: FormFactorFilterType | undefined,
  onFilterChange: (filter: FormFactorFilterType) => void,
) => {
  const [filter, setFilter] = useState<FormFactorFilterType>();

  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  const onAllToggle = (checked: boolean) => {
    const newFilter = {
      showAll: checked,
      operators: [],
    };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const onOperatorToggle = (operator: string) => (checked: boolean) => {
    let newFilter = getNewFilterState(checked, operator, filter, allOperators);
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const showAll = () => filter?.showAll;

  const isChecked = (operatorId: string) =>
    !!filter?.operators?.includes(operatorId) || showAll();

  return {
    onAllToggle,
    onOperatorToggle,
    showAll,
    isChecked,
  };
};

const getNewFilterState = (
  isChecked: boolean,
  selectedOperator: string,
  currentFilter: FormFactorFilterType | undefined,
  allOperators: MobilityOperatorType[],
): FormFactorFilterType => {
  if (isChecked) {
    // Add checked operator to list
    const operators = [...(currentFilter?.operators ?? []), selectedOperator];
    // If all operators are checked, set 'showAll' to true, rather that having all operators explicitly in the list.
    // This allows for showing operators that do not exist in the whitelist
    return operators.length === allOperators.length
      ? {
          operators: [],
          showAll: true,
        }
      : {
          operators,
          showAll: false,
        };
  }
  // If only one operator exists, treat unselecting this as unselecting all
  if (allOperators.length === 1) {
    return {
      operators: [],
      showAll: false,
    };
  }
  // If 'showAll' was true at the time of unchecking one, all other operators should be added to the list.
  const operators = currentFilter?.showAll
    ? allOperators.map((o) => o.id).filter((o) => o !== selectedOperator)
    : currentFilter?.operators?.filter((o: string) => o !== selectedOperator) ??
      [];
  return {
    operators,
    showAll: false,
  };
};
