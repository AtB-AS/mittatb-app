import {OperatorFilterType} from '@atb/components/map';
import {useEffect, useState} from 'react';
import {MobilityOperatorType} from '@atb/mobility';

export const useOperatorToggle = (
  allOperators: MobilityOperatorType[],
  initialFilter: OperatorFilterType | undefined,
  onFilterChange: (filter: OperatorFilterType) => void,
) => {
  const [filter, setFilter] = useState<OperatorFilterType>();

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
    let newFilter;
    if (checked) {
      // Add checked operator to list
      const operators = [...(filter?.operators ?? []), operator];
      // If all operators are checked, set 'showAll' to true, rather that having all operators explicitly in the list.
      // This allows for showing operators that do not exist in the whitelist
      newFilter =
        operators.length === allOperators.length
          ? {
              operators: [],
              showAll: true,
            }
          : {
              operators,
              showAll: false,
            };
    } else {
      // If 'showAll' was true at the time of unchecking one, all other operators should be added to the list.
      const operators = filter?.showAll
        ? allOperators.map((o) => o.id).filter((o) => o !== operator)
        : filter?.operators?.filter((o) => o !== operator) ?? [];
      newFilter = {
        operators,
        showAll: false,
      };
    }
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
