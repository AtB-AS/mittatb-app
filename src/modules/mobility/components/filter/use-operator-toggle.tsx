import {FormFactorFilterType} from '@atb/modules/map';
import {useEffect, useState} from 'react';
import {MobilityOperatorType} from '@atb/modules/configuration';
import {getNewFilterState} from '../../utils';

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
    const newFilter = getNewFilterState(
      checked,
      operator,
      filter,
      allOperators,
    );
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
