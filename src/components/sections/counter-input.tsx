import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import ThemeText from '../text';
import {SectionItem, useSectionItem, useSectionStyle} from './section-utils';
import insets from '../../utils/insets';
import ThemeIcon from '../theme-icon';
import {Add, Remove} from '../../assets/svg/icons/actions';
import {StyleSheet} from '../../theme';

export type CounterInputProps = SectionItem<{
  text: string;
  count: number;
  addCount: () => void;
  removeCount: () => void;
}>;
export default function CounterInput({
  text,
  count,
  addCount,
  removeCount,
  ...props
}: CounterInputProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();
  const counterStyles = useStyles();
  return (
    <View style={[style.baseItem, topContainer, counterStyles.travellerCount]}>
      <View style={[style.spaceBetween, contentContainer]}>
        <ThemeText>
          {count} {text}
        </ThemeText>
      </View>
      <View style={counterStyles.travellerCountActions}>
        <TouchableOpacity
          onPress={() => removeCount()}
          accessibilityRole="button"
          accessibilityLabel={`Minsk antall til ${count - 1}`}
          accessibilityElementsHidden={count <= 1}
          importantForAccessibility={count > 1 ? 'yes' : 'no-hide-descendants'}
          hitSlop={insets.all(8)}
        >
          <ThemeIcon svg={Remove} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => addCount()}
          accessibilityRole="button"
          accessibilityLabel={`Øk antall til ${count + 1}`}
          hitSlop={insets.all(8)}
        >
          <ThemeIcon svg={Add} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook(() => ({
  travellerCount: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  travellerCountActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 70,
  },
}));
