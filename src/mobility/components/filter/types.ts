import {OperatorFilterType} from '@atb/components/map';
import {ViewStyle} from 'react-native';

export type MapFilterProps = {
  initialFilter: OperatorFilterType | undefined;
  onFilterChange: (filter: OperatorFilterType) => void;
  style?: ViewStyle;
};
