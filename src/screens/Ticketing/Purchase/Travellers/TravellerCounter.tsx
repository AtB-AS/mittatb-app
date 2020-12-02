import {TouchableOpacity, View} from 'react-native';
import ThemeText from '../../../../components/text';
import insets from '../../../../utils/insets';
import ThemeIcon from '../../../../components/theme-icon';
import {Add, Remove} from '../../../../assets/svg/icons/actions';
import React from 'react';
import {StyleSheet} from '../../../../theme';
import {TravellerType, TravellerWithCount} from '../traveller-types';

type Props = {
  travellerWithCount: TravellerWithCount;
  addCount: (t: TravellerType) => void;
  removeCount: (t: TravellerType) => void;
  firstItem: boolean;
  lastItem: boolean;
};

export default function TravellerCounter({
  travellerWithCount,
  addCount,
  removeCount,
  firstItem,
  lastItem,
}: Props) {
  const styles = useStyles();
  const {type, count, price, text} = travellerWithCount;
  return (
    <View
      style={[
        styles.travellerContainer,
        firstItem && styles.travellerContainerFirst,
        lastItem && styles.travellerContainerLast,
      ]}
    >
      <View style={styles.travellerCount}>
        <ThemeText type="paragraphHeadline">
          {count || 0} {text}
        </ThemeText>
      </View>
      <View style={styles.travellerCountActions}>
        <ThemeText type="lead">{price},-</ThemeText>
        <TouchableOpacity
          onPress={() => removeCount(type)}
          accessibilityRole="button"
          accessibilityLabel={`Minsk antall til ${count - 1}`}
          accessibilityElementsHidden={count <= 1}
          importantForAccessibility={count > 1 ? 'yes' : 'no-hide-descendants'}
          hitSlop={insets.all(8)}
        >
          <ThemeIcon svg={Remove} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => addCount(type)}
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
const useStyles = StyleSheet.createThemeHook((theme) => ({
  travellerContainer: {
    backgroundColor: theme.background.level1,
    padding: theme.spacings.medium,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  travellerContainerFirst: {
    borderTopLeftRadius: theme.border.radius.regular,
    borderTopEndRadius: theme.border.radius.regular,
  },
  travellerContainerLast: {
    borderBottomLeftRadius: theme.border.radius.regular,
    borderBottomEndRadius: theme.border.radius.regular,
    marginBottom: 0,
  },
  travellerCount: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  travellerCountActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 100,
  },
}));
