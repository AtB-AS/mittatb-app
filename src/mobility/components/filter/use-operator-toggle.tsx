import {OperatorFilterType} from '@atb/components/map';
import {useEffect, useState} from 'react';

export const useOperatorToggle = (
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
    const operators = checked
      ? [...(filter?.operators ?? []), operator]
      : filter?.operators?.filter((o) => o !== operator) ?? [];
    const showAll = operators.length === 0;
    const newFilter = {
      operators,
      showAll,
    };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const showAll = () => filter?.showAll;

  const isChecked = (operatorId: string) =>
    !!filter?.operators?.includes(operatorId);

  return {
    onAllToggle,
    onOperatorToggle,
    showAll,
    isChecked,
  };
};
