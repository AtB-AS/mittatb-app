import {TFunc} from '@leile/lobo-t';
import React from 'react';
import {View} from 'react-native';
import {QuayInfo} from '../../../api/departures/types';
import {WalkingPerson} from '../../../assets/svg/icons/transportation';
import {
  SectionItem,
  useSectionItem,
  useSectionStyle,
} from '../../../components/sections/section-utils';
import ThemeText from '../../../components/text';
import ThemeIcon from '../../../components/theme-icon';
import {StyleSheet} from '../../../theme';
import {dictionary, Language, useTranslation} from '../../../translations';

export type QuayHeaderItemProps = SectionItem<{
  quay: QuayInfo;
  distance?: number;
}>;
export default function QuayHeaderItem({
  quay,
  distance,
  ...props
}: QuayHeaderItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  return (
    <View style={[topContainer, sectionStyle.spaceBetween, contentContainer]}>
      <ThemeText>{quay.name}</ThemeText>
      <Distance distance={distance} />
    </View>
  );
}

type DistanceProps = {
  distance?: number;
};
function Distance({distance}: DistanceProps) {
  const styles = useItemStyles();
  const {t} = useTranslation();
  if (distance == null) {
    return null;
  }

  return (
    <View style={styles.itemStyle}>
      <ThemeText>{humanizeDistance(distance, t)}</ThemeText>
      <ThemeIcon svg={WalkingPerson} style={styles.icon} />
    </View>
  );
}
const humanizeDistance = (meters: number, t: TFunc<typeof Language>) => {
  if (meters >= 1000) {
    return `${Math.round(meters / 1000)}${t(dictionary.distance.km)}`;
  }
  return `${Math.round(meters)}${t(dictionary.distance.m)}`;
};
const useItemStyles = StyleSheet.createThemeHook((theme) => ({
  itemStyle: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: theme.spacings.medium,
  },
}));
